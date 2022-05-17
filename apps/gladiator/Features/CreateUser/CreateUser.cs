using System.Security.Claims;
using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Features.Shared;
using Borngladiator.Gladiator.Helper;
using Dapper;
using FastEndpoints;
using FluentValidation.Results;
using HashidsNet;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Npgsql;
using Ory.Client.Model;
using SendGrid;
using SendGrid.Helpers.Mail;
using ILogger = Serilog.ILogger;

namespace Borngladiator.Gladiator.Features.CreateUser;

public class CreateUser : Endpoint<CreateUserDto>
{
  private User _user;
  private readonly AppConfiguration _configuration;
  private readonly ILogger _logger;

  public CreateUser( User user, IOptionsSnapshot<AppConfiguration> configuration, ILogger logger)
  {
    _user = user;
    _logger = logger;
    _configuration = configuration.Value;
  }
  public override void Configure()
  {
    Verbs(Http.POST);
    Routes("api/user/create");
  }

  public override async Task HandleAsync(CreateUserDto req, CancellationToken ct)
  {
    var userPrinciple = _user.GetUser(HttpContext.Request);

    if (userPrinciple == null)
    {
      _logger.Error($"user requested endpoint without authentication");
      await SendErrorsAsync(cancellation: ct);
      return;
    }

    var inserts = SqlHelper.CreateSqlDictionary(req, userPrinciple);

    await DapperHelper.ExecuteMultipleWrite(ct,inserts,_configuration.Database.Connection);

    await SendOkAsync(ct);
  }

  public override async void OnAfterHandle(CreateUserDto req, object res)
  {
    if (HttpContext.Response.StatusCode != 200)
    {
      _logger.Information("Unable to send {@welcomeEmail}",req);
      return;
    }

    var client = new SendGridClient(_configuration.SENDGRID_API_KEY);

    var from = new EmailAddress(_configuration.SendGrid.EmailFrom, "welcome to death clock");

    var user = _user.GetUser(HttpContext.Request)?.Principal;

    if (user?.Identity == null)
    {
      _logger.Error("Unable to send welcome email, user is not authenticated");
      return;
    }

    var to = new EmailAddress(user.GetUserEmail(), user.Identity.Name);

    var hashId = new Hashids(_configuration.HashIdsSalt);

    var userHashedId = hashId.EncodeHex(user.GetUserId().ToString("N"));

    if (string.IsNullOrWhiteSpace(userHashedId))
    {
      _logger.Error("Unable to create valid user hash for unsubscribe link");
      return;
    }

    //Todo: allow sendgrid to enable user to unsubscribe
    var msg = MailHelper.CreateSingleTemplateEmail(from,to,_configuration.SendGrid.WelcomeTemplateId,new
    {
      username = user.Identity.Name,
      unsubscribeId = userHashedId
    });

    var response = await client.SendEmailAsync(msg);

    //check for response success or failure
    if (!response.IsSuccessStatusCode)
    {
      _logger.Error("Sendgrid failed to send {@welcomeEmail}",response);

      //Todo: Send email at a later date.
      //Todo: Also can be placed in the cron job or a queue to call a later date
    }
  }

}

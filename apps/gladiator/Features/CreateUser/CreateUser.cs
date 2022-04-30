using System.Security.Claims;
using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Features.Shared;
using Borngladiator.Gladiator.Helper;
using Dapper;
using FastEndpoints;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Npgsql;
using Ory.Client.Model;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Borngladiator.Gladiator.Features.CreateUser;

public class CreateUser : Endpoint<CreateUserDto>
{
  private User _user;
  private readonly AppConfiguration _configuration;

  public CreateUser( User user, IOptionsSnapshot<AppConfiguration> configuration)
  {
    _user = user;
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
      //Todo: log
      return;
    }

    var sendgridKey = _configuration.SENDGRID_API_KEY;

    var client = new SendGridClient(sendgridKey);

    var from = new EmailAddress(_configuration.SendGrid.EmailFrom, "welcome to death clock");

    var user = _user.GetUser(HttpContext.Request)?.Principal;

    if (user?.Identity == null)
    {
      //Todo: log
      return;
    }

    //Todo: utilise the actual user email on real test
    // var to = new EmailAddress(user.GetUserEmail(), user.Identity.Name);
    var to = new EmailAddress("hazecode90@gmail.com", "hazecode");

    //Todo: allow sendgrid to enable user to unsubscribe
    var msg = MailHelper.CreateSingleTemplateEmail(from,to,_configuration.SendGrid.WelcomeTemplateId,new
    {
      days_left = "20000000000",
      username = user.Identity.Name
    });

    var response = await client.SendEmailAsync(msg);

    //check for response success or failure
    if (!response.IsSuccessStatusCode)
    {
      //Todo: log it
      //Todo: retry sending it later
    }
  }

}

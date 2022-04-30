using System.Globalization;
using System.Numerics;
using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Features.Shared;
using Borngladiator.Gladiator.Helper;
using FastEndpoints;
using HashidsNet;
using Microsoft.Extensions.Options;
using Npgsql;
using ILogger = Serilog.ILogger;

namespace Borngladiator.Gladiator.Features.Subscribe;

public class Subscribe : Endpoint<SubscribeDto>
{
  private User _user;
  private readonly AppConfiguration _configuration;
  private readonly ILogger _logger;
  public Subscribe(User user,IOptionsSnapshot<AppConfiguration> configuration, ILogger logger)
  {
    _user = user;
    _logger = logger;
    _configuration = configuration.Value;
  }

  public override void Configure()
  {
    Post("api/user/subscribe");
    AllowAnonymous();
  }

  public override async Task HandleAsync(SubscribeDto req, CancellationToken ct)
  {

    var hashId = new Hashids(_configuration.HashIdsSalt);

    var unsubscribeId = hashId.DecodeHex(req.UnsubscribeId);

    if (unsubscribeId == null)
    {
      _logger.Error($"user requested endpoint without authentication");
      await SendNoContentAsync(ct);
      return;
    }

    if (!Guid.TryParse(unsubscribeId, out var userId))
    {
      _logger.Information("Failed to Unsubscribe user, not a valid {@Guid}", userId);
      await SendNoContentAsync(ct);
      return;
    }

    var subscribeSql = @"update users set subscribed = @Subscribed where user_id = @Id";

    var subscribeParams = new
    {
      Subscribed = req.Subscribe,
      Id = userId
    };

    await DapperHelper.ExecuteWrite(ct,subscribeSql, subscribeParams, _configuration.Database.Connection);

    await SendOkAsync(ct);
  }
}

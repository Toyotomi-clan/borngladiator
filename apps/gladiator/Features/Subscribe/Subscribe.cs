using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Features.Shared;
using Borngladiator.Gladiator.Helper;
using FastEndpoints;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Borngladiator.Gladiator.Features.Subscribe;

public class Subscribe : Endpoint<SubscribeDto>
{
  private User _user;
  private readonly AppConfiguration _configuration;

  public Subscribe(User user,IOptionsSnapshot<AppConfiguration> configuration)
  {
    _user = user;
    _configuration = configuration.Value;
  }

  public override void Configure()
  {
    Put("api/user/subscribe");
  }

  public override async Task HandleAsync(SubscribeDto req, CancellationToken ct)
  {
    var userPrinciple = _user.GetUser(HttpContext.Request);

    if (userPrinciple == null)
    {
      await SendErrorsAsync(cancellation: ct);

      return;
    }

    var subscribeSql = @"update users set subscribed = @Subscribed where user_id = @Id";
    var subscribeParams = new
    {
      Subscribed = req.Subscribe,
      Id = userPrinciple.Principal.GetUserId()
    };

    await DapperHelper.ExecuteWrite(ct,subscribeSql, subscribeParams, _configuration.Database.Connection);

    await SendOkAsync(ct);
  }
}

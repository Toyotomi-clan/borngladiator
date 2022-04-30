using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Features.Shared;
using Borngladiator.Gladiator.Helper;
using Dapper;
using FastEndpoints;
using Microsoft.Extensions.Options;
using Npgsql;
using ILogger = Serilog.ILogger;

namespace Borngladiator.Gladiator.Features.GetUser;

public class GetUser : EndpointWithoutRequest<GetUserDto>
{
  private ILogger _logger;
  private User _user;
  private readonly AppConfiguration _configuration;

  public override void Configure()
  {
    Get("api/user/");
  }

  public GetUser( IOptionsSnapshot<AppConfiguration> configuration, User user, ILogger logger)
  {
    _user = user;
    _logger = logger;
    _configuration = configuration.Value;
  }

  public override async Task HandleAsync(CancellationToken ct)
  {
    var userPrinciple = _user.GetUser(HttpContext.Request);

    if (userPrinciple == null)
    {
      _logger.Error($"user requested endpoint without authentication");
      await SendErrorsAsync(cancellation: ct);
    }

    var getUserSql = "select date_of_birth as DateOfBirth,subscribed, (select gender from gender where id = users.gender) as gender  from users where user_id = @user";
    var getUserParams = new
    {
      user = userPrinciple.Principal.GetUserId()
    };

    await using var connection = new NpgsqlConnection(_configuration.Database.Connection);

    var dto = await connection.QuerySingleOrDefaultAsync<GetUserDto>(getUserSql,getUserParams);

    if (dto == null)
    {
      _logger.Information($"User has not been created");

      await SendNoContentAsync(ct);

      return;
    }

    await SendOkAsync(dto,ct);

  }
}

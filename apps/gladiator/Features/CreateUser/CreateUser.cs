using System.Security.Claims;
using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Helper;
using Dapper;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Npgsql;
using Ory.Client.Model;

namespace Borngladiator.Gladiator.Features.CreateUser;

public class CreateUser : Endpoint<CreateUserDto>
{
  private IMemoryCache _memoryCache;
  private readonly DatabaseOptions _databaseOptions;
  private readonly OryOptions _oryOptions;

  public CreateUser(IMemoryCache memoryCache, IOptionsSnapshot<DatabaseOptions> databaseOption, IOptionsSnapshot<OryOptions> oryOptions)
  {
    _memoryCache = memoryCache;
    _oryOptions = oryOptions.Value;
    _databaseOptions = databaseOption.Value;
  }
  public override void Configure()
  {
    Verbs(Http.POST);
    Routes("api/user/create");
  }

  public override async Task HandleAsync(CreateUserDto req, CancellationToken ct)
  {
    var getOryCookie = OryHelper.GetOryCookie(_oryOptions.Slug, HttpContext.Request);

    if (getOryCookie == null)
    {
      await SendErrorsAsync(cancellation: ct);
    }

    if (!_memoryCache.TryGetValue(getOryCookie, out AuthenticationTicket userPrinciple))
    {
      await SendErrorsAsync(cancellation: ct);
    }
    var inserts = CreateSqlDictionary(req, userPrinciple);

    await DapperHelper.ExecuteMultipleWrite(ct,inserts,_databaseOptions.Connection);

    await SendOkAsync(ct);
  }

  private static Dictionary<string, object> CreateSqlDictionary(CreateUserDto req, AuthenticationTicket userPrinciple)
  {
    var createUserParams = new
    {
      user_id = new Guid(userPrinciple.Principal.GetUserId()),
      username = userPrinciple.Principal.Identity?.Name,
      email = userPrinciple.Principal.GetUserEmail(),
      date_of_birth = req.DateOfBirth, subscribed = true,
      gender = req.Gender
    };

    var createUserSql =
      @"INSERT INTO users (user_id,username,email,date_of_birth,subscribed, gender)
      Values (@user_id,@username,@email,@date_of_birth,@subscribed,(select id from gender where gender = @gender) );";

    var userLastCheckedInParams = new
    {
      user_id = new Guid(userPrinciple.Principal.GetUserId()),
      last_logged_in = DateTime.UtcNow
    };

    var userLastCheckedInSql = "INSERT INTO last_checking (user_id,last_logged_in) Values (@user_id,@last_logged_in);";

    var inserts = new Dictionary<string, object>
    {
      {createUserSql, createUserParams},
      {userLastCheckedInSql, userLastCheckedInParams}
    };
    return inserts;
  }

}

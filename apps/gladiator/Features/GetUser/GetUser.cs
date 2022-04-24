using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Helper;
using Dapper;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Borngladiator.Gladiator.Features.GetUser;

public class GetUser : EndpointWithoutRequest<GetUserDto>
{
  private IMemoryCache _memoryCache;
  private readonly DatabaseOptions _databaseOptions;
  private readonly OryOptions _oryOptions;

  public override void Configure()
  {
    Get("api/user/");
  }

  public GetUser(IMemoryCache memoryCache, IOptionsSnapshot<DatabaseOptions> databaseOption, IOptionsSnapshot<OryOptions> oryOptions)
  {
    _memoryCache = memoryCache;
    _oryOptions = oryOptions.Value;
    _databaseOptions = databaseOption.Value;
  }

  public override async Task HandleAsync(CancellationToken ct)
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

    var getUserSql = "select date_of_birth as DateOfBirth,subscribed, (select gender from gender where id = users.gender) as gender  from users where user_id = @user";
    var getUserParams = new
    {
      user = new Guid(userPrinciple.Principal.GetUserId())
    };

    await using var connection = new NpgsqlConnection(_databaseOptions.Connection);

    var dto = await connection.QuerySingleOrDefaultAsync<GetUserDto>(getUserSql,getUserParams);

    if (dto == null)
    {
      await SendNoContentAsync(ct);
    }

    await SendOkAsync(dto,ct);

  }
}

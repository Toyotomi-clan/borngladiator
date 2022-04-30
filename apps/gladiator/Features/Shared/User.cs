using Borngladiator.Gladiator.Configuration;
using Borngladiator.Gladiator.Helper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Borngladiator.Gladiator.Features.Shared;

public class User
{
  private IMemoryCache _memoryCache;
  private readonly AppConfiguration _configuration;

  public User(IMemoryCache memoryCache, IOptionsSnapshot<AppConfiguration> configuration)
  {
    _memoryCache = memoryCache;
    _configuration = configuration.Value;
  }

  public AuthenticationTicket? GetUser(HttpRequest request)
  {
    var getOryCookie = OryHelper.GetOryCookie(_configuration.Ory.Slug,request);

    if (getOryCookie == null)
    {
      return null;
    }

    return !_memoryCache.TryGetValue(getOryCookie, out AuthenticationTicket userPrinciple) ? null : userPrinciple;
  }
}

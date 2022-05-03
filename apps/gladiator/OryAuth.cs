using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Ory.Client.Api;
using ILogger = Serilog.ILogger;

namespace Borngladiator.Gladiator;

public class OryAuthOptions : AuthenticationSchemeOptions
{
  public string? EndPoint { get; set; }

  public string? Realm { get; set; }

  public string? Slug { get; set; }

  public ITicketStore? SessionStore { get; set; }

}

public class OryAuthOptionsConfiguration : IPostConfigureOptions<OryAuthOptions>
{
  public void PostConfigure(string name, OryAuthOptions options)
  {
    if (string.IsNullOrWhiteSpace(options.Realm))
    {
      throw new InvalidOperationException("A realm is required to specified");
    }
    if(string.IsNullOrWhiteSpace(options.EndPoint))
    {
      throw new InvalidOperationException(
        "Ory endpoint must be specified (i.e. https://{your cloud instance}.projects.oryapis.com)");
    }

    if (string.IsNullOrWhiteSpace(options.Slug))
    {
      throw new InvalidOperationException("A ory slug is required to specified i.e. playboy-carti-k1hdi6xth0	");
    }
  }
}

public class OryAuthHandler : AuthenticationHandler<OryAuthOptions>
{
  private V0alpha2Api _alpha2;
  private IMemoryCache _memoryCache;
  private ILogger _logger;
  public OryAuthHandler(IOptionsMonitor<OryAuthOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, V0alpha2Api alpha2, IMemoryCache memoryCache, ILogger logger1) : base(options, logger, encoder, clock)
  {
    _alpha2 = alpha2;
    _memoryCache = memoryCache;
    _logger = logger1;
  }

  protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    try
    {
      var oryCookie = Helper.OryHelper.GetOryCookie(Options.Slug, Request);

      if (oryCookie == null)
      {
        return AuthenticateResult.NoResult();
      }

      if (_memoryCache.TryGetValue(oryCookie, out AuthenticationTicket alreadyAuthenticated) &&
          DateTime.Compare( alreadyAuthenticated.Properties.ExpiresUtc?.UtcDateTime ?? DateTime.UtcNow,DateTime.UtcNow) > 0 )
      {
        return AuthenticateResult.Success(alreadyAuthenticated);
      }

      var user =  await _alpha2.ToSessionAsync(null,oryCookie);

      if (user == null)
      {
        //Todo: log this
        return AuthenticateResult.NoResult();
      }

      var jsonTraits = user.Identity.Traits as JObject;

      var traits = jsonTraits?.ToObject<UserTraits>();

      if (traits == null)
      {
        //Todo: log this
        return AuthenticateResult.NoResult();
      }

      var claims = new[]
      {
        new Claim(ClaimTypes.Sid, user.Identity.Id),
        new Claim(ClaimsIdentity.DefaultIssuer, "Ory_Cloud"),
        new Claim(ClaimTypes.Name, traits.UserName),
        new Claim(ClaimTypes.Email, traits.Email)
      };

      var identity = new ClaimsIdentity(claims, Scheme.Name);

      var principle = new ClaimsPrincipal(identity);

      var ticket = new AuthenticationTicket(principle,new AuthenticationProperties
      {
        ExpiresUtc = user.ExpiresAt,
        AllowRefresh = false,
        IsPersistent = true,
        IssuedUtc = user.IssuedAt,
      }, Scheme.Name);

      _memoryCache.Set(oryCookie, ticket,user.ExpiresAt);

      return AuthenticateResult.Success(ticket);
    }
    catch (Exception e)
    {
      //Todo Log error

      return AuthenticateResult.Fail(e);
    }
  }
}

public class UserTraits
{
  [JsonPropertyName("username")]
  public string UserName { get; set; }

  [JsonPropertyName("email")]
  public string Email { get; set; }
}
public static class OryAuthenticationDefaults
{
  public const string AuthenticationScheme = "OryAuth";
}

public static class OryAuthenticationExtensions
{
  public static AuthenticationBuilder AddOry(this AuthenticationBuilder builder)

  {
    return AddOry(builder, OryAuthenticationDefaults.AuthenticationScheme, _ => { });
  }

  public static AuthenticationBuilder AddOry(this AuthenticationBuilder builder, string authenticationScheme)
  {
    return AddOry(builder, authenticationScheme, _ => { });
  }

  public static AuthenticationBuilder AddOry(this AuthenticationBuilder builder, Action<OryAuthOptions> configureOptions)
  {
    return AddOry(builder, OryAuthenticationDefaults.AuthenticationScheme, configureOptions);
  }

  public static AuthenticationBuilder AddOry(this AuthenticationBuilder builder, string authenticationScheme, Action<OryAuthOptions> configureOptions)
  {
    builder.Services.AddSingleton<IPostConfigureOptions<OryAuthOptions>, OryAuthOptionsConfiguration>();
    builder.Services.AddSingleton(ory => new V0alpha2Api( new Ory.Client.Client.Configuration
    {
      BasePath =  new Uri("https://competent-benz-v5hxi6dzh2.projects.oryapis.com", UriKind.Absolute).ToString()
    }));

    return builder.AddScheme<OryAuthOptions, OryAuthHandler>(
      authenticationScheme, configureOptions);
  }
}

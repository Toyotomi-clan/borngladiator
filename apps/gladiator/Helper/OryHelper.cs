using Microsoft.AspNetCore.Authentication;

namespace Borngladiator.Gladiator.Helper;

public static class OryHelper
{
  public static string? GetOryCookie( string? slug, HttpRequest request)
  {
    var slugTrimmed = slug?.Replace("-", "").Trim();

    if (slugTrimmed == null)
    {
      return null;
    }

    var orySession = $"ory_session_{slugTrimmed}";

    var sessionCookie = request.Cookies[orySession];

    if (sessionCookie == null)
    {
      return null;
    }

    return  $"{orySession}={sessionCookie}";
  }

}

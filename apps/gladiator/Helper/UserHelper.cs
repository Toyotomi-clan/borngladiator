using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace Borngladiator.Gladiator.Helper;

public static class UserHelper
{

  public static Guid GetUserId(this ClaimsPrincipal  principal)
  {
    return new Guid(principal.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
  }

  public static string GetUserEmail(this ClaimsPrincipal  principal)
  {
    return principal.Claims.First(x => x.Type == ClaimTypes.Email).Value;
  }
}

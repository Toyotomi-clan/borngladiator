using Borngladiator.Gladiator.Features.Shared;
using Borngladiator.Gladiator.Helper;
using Serilog;
using Serilog.Context;
using Serilog.Events;

namespace Borngladiator.Gladiator.Middleware;

public class EnrichLogWithUserDetailsMiddleware
{
  private readonly RequestDelegate _next;

  public EnrichLogWithUserDetailsMiddleware(RequestDelegate next)
  {
    _next = next;
  }

  public async Task Invoke(HttpContext context, User? user)
  {
    if (user == null)
    {
      await _next.Invoke(context);;
    }

    var angle = user?.GetUser(context.Request);

    if (angle == null)
    {
      await _next.Invoke(context);
    }
    else
    {
      var logContext = LogContext.PushProperty("angle", new
      {
        id = angle.Principal.GetUserId()
      },true);

      using (logContext)
      {
        await _next.Invoke(context);
      };
    }

  }

}

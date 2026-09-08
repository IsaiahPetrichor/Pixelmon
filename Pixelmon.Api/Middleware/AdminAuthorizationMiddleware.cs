using Pixelmon.Api.Services;

namespace Pixelmon.Api.Middleware;

public sealed class AdminAuthorizationMiddleware(
    RequestDelegate next,
    IConfiguration configuration,
    AdminTokenService tokenService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/DatabaseTest"))
        {
            var token = context.Request.Headers.Authorization.ToString();
            token = token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? token["Bearer ".Length..].Trim()
                : null;

            var configuredUsername = configuration["AdminAccess:Username"] ?? string.Empty;
            if (!tokenService.IsValid(token, configuredUsername))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }
        }

        //context.Request.Path.StartsWithSegments("/WorkItems")

        await next(context);
    }
}
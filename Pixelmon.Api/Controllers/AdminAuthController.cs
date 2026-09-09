using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminAuthController(IConfiguration configuration, AdminTokenService tokenService, ILogger<AdminAuthController> logger) : ControllerBase
{
    private readonly ILogger<AdminAuthController> _logger = logger;

    [HttpPost("verify")]
    public IActionResult Verify(AdminCredentials credentials)
    {
        var configuredUsername = configuration["AdminAccess:Username"] ?? string.Empty;
        var configuredApiKey = configuration["AdminAccess:ApiKey"] ?? string.Empty;

        var usernameMatches = FixedTimeEquals(credentials.Username, configuredUsername);
        var apiKeyMatches = FixedTimeEquals(credentials.ApiKey, configuredApiKey);

        var authStatus = usernameMatches && apiKeyMatches;

        _logger.LogInformation($"[AdminAuth/Verify] called, user is {(authStatus ? "authorized" : "unauthorized")}.");

        return authStatus
            ? Ok(new { authorized = true, token = tokenService.CreateToken(credentials.Username) })
            : Unauthorized(new { authorized = false, message = "Invalid username or API key." });
    }

    [HttpGet("validate")]
    public IActionResult Validate()
    {
        var authorization = Request.Headers.Authorization.ToString();
        var token = authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? authorization["Bearer ".Length..].Trim()
            : null;
        var configuredUsername = configuration["AdminAccess:Username"] ?? string.Empty;

        _logger.LogInformation($"[AdminAuth/Validate] called, user is {(tokenService.IsValid(token, configuredUsername) ? "valid" : "invalid")}.");

        return tokenService.IsValid(token, configuredUsername)
            ? Ok(new { authorized = true })
            : Unauthorized(new { authorized = false });
    }

    private static bool FixedTimeEquals(string providedValue, string configuredValue)
    {
        var providedBytes = Encoding.UTF8.GetBytes(providedValue);
        var configuredBytes = Encoding.UTF8.GetBytes(configuredValue);

        return providedBytes.Length == configuredBytes.Length &&
            CryptographicOperations.FixedTimeEquals(providedBytes, configuredBytes);
    }
}

public sealed record AdminCredentials(string Username, string ApiKey);
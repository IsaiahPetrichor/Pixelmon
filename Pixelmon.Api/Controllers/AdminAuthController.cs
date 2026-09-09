using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Pixelmon.Api.Models;
using Pixelmon.Api.Services;

namespace Pixelmon.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminAuthController(
    IDatabaseService databaseService,
    AdminTokenService tokenService,
    IPasswordHasher<User> passwordHasher,
    ILogger<AdminAuthController> logger) : ControllerBase
{
    private readonly ILogger<AdminAuthController> _logger = logger;

    [HttpPost("verify")]
    public async Task<IActionResult> Verify(AdminCredentials credentials, CancellationToken cancellationToken)
    {
        var user = await databaseService.QueryUserForAuthentication(credentials.Username, cancellationToken);
        var passwordValid = user is not null &&
            passwordHasher.VerifyHashedPassword(
                new User { Id = user.Id, Username = user.Username, RankId = 0, CreatedAt = default },
                user.PasswordHash,
                credentials.Password) != PasswordVerificationResult.Failed;

        _logger.LogInformation("[AdminAuth/Verify] called, user is {AuthStatus}.", passwordValid ? "authorized" : "unauthorized");

        return passwordValid
            ? Ok(new { authorized = true, token = tokenService.CreateToken(user!) })
            : Unauthorized(new { authorized = false, message = "Invalid username or password." });
    }

    [HttpGet("validate")]
    public IActionResult Validate()
    {
        var authorization = Request.Headers.Authorization.ToString();
        var token = authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? authorization["Bearer ".Length..].Trim()
            : null;
        var isValid = tokenService.IsValid(token, out var authToken);
        _logger.LogInformation("[AdminAuth/Validate] called, user is {AuthStatus}.", isValid ? "valid" : "invalid");

        return isValid
            ? Ok(new { authorized = true, user = authToken })
            : Unauthorized(new { authorized = false });
    }
}

public sealed record AdminCredentials(string Username, string Password);
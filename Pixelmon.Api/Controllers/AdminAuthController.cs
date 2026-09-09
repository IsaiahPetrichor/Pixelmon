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

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp(SignUpRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || request.Password.Length < 8)
        {
            return BadRequest(new { message = "Username is required and password must be at least 8 characters." });
        }

        var normalizedUsername = request.Username.Trim();
        var user = new User
        {
            Id = 0,
            Username = normalizedUsername,
            RankId = 0,
            CreatedAt = DateTime.UtcNow
        };
        var passwordHash = passwordHasher.HashPassword(user, request.Password);

        try
        {
            var created = await databaseService.CreateBaseUser(normalizedUsername, passwordHash, cancellationToken);
            if (!created)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "The base user rank is not configured." });
            }
        }
        catch (Npgsql.PostgresException exception) when (exception.SqlState == Npgsql.PostgresErrorCodes.UniqueViolation)
        {
            return Conflict(new { message = "That username is already in use." });
        }

        var authenticatedUser = await databaseService.QueryUserForAuthentication(normalizedUsername, cancellationToken);
        return authenticatedUser is null
            ? StatusCode(StatusCodes.Status500InternalServerError)
            : Ok(new { authorized = true, token = tokenService.CreateToken(authenticatedUser) });
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

public sealed record SignUpRequest(string Username, string Password);
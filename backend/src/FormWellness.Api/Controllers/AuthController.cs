using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("google")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> GoogleAuth([FromBody] GoogleAuthRequest request, CancellationToken ct)
    {
        var result = await _authService.AuthenticateWithGoogleAsync(request, ct);
        return Success(result, "Authentication successful");
    }

    [HttpPost("dev-login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> DevLogin([FromBody] DevLoginRequest request, CancellationToken ct)
    {
        var result = await _authService.DevLoginAsync(request, ct);
        return Success(result, "Dev login successful");
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetMe(CancellationToken ct)
    {
        var result = await _authService.GetCurrentUserProfileAsync(ct);
        return Success(result);
    }
}

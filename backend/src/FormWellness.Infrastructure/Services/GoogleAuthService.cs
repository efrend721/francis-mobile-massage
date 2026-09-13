using FormWellness.Application.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FormWellness.Infrastructure.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IConfiguration _config;
    private readonly ILogger<GoogleAuthService> _logger;

    public GoogleAuthService(IConfiguration config, ILogger<GoogleAuthService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<GoogleUserInfo?> ValidateTokenAsync(string idToken)
    {
        if (string.IsNullOrWhiteSpace(idToken)) return null;

        // Dev mock token support for local testing
        if (idToken.StartsWith("dev-mock-"))
        {
            var parts = idToken.Split(':');
            var email = parts.Length > 1 ? parts[1] : "test.client@example.com";
            var name = parts.Length > 2 ? parts[2] : "Dev Client";

            return new GoogleUserInfo
            {
                SubjectId = "dev-google-sub-" + email.GetHashCode(),
                Email = email,
                Name = name,
                Picture = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            };
        }

        try
        {
            var clientId = _config["Authentication:Google:ClientId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings();
            if (!string.IsNullOrEmpty(clientId))
            {
                settings.Audience = new[] { clientId };
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return new GoogleUserInfo
            {
                SubjectId = payload.Subject,
                Email = payload.Email,
                Name = payload.Name ?? payload.Email,
                Picture = payload.Picture
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate Google ID Token");
            return null;
        }
    }
}

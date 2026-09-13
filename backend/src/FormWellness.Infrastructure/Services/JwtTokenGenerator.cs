using FormWellness.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FormWellness.Infrastructure.Services;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _config;

    public JwtTokenGenerator(IConfiguration config)
    {
        _config = config;
    }

    public (string Token, DateTime ExpiresAt) GenerateToken(string userId, string email, string name, string role, bool isClient)
    {
        var secretKey = _config["Jwt:SecretKey"] ?? "DEVELOPMENT_FALLBACK_KEY_CHANGE_IN_AZURE_APP_SETTINGS_MIN32CHARS!";
        var issuer = _config["Jwt:Issuer"] ?? "FormWellnessApi";
        var audience = _config["Jwt:Audience"] ?? "FormWellnessClient";
        var expiryHours = int.TryParse(_config["Jwt:ExpiryInHours"], out var h) ? h : 72;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTime.UtcNow.AddHours(expiryHours);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.Name, name),
            new(ClaimTypes.Role, role),
            new("is_client", isClient.ToString().ToLower())
        };

        var tokenDescriptor = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return (tokenHandler.WriteToken(tokenDescriptor), expiresAt);
    }
}

namespace FormWellness.Application.Interfaces;
public class GoogleUserInfo {
    public string SubjectId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Picture { get; set; }
}
public interface IGoogleAuthService {
    Task<GoogleUserInfo?> ValidateTokenAsync(string idToken);
}
public interface IJwtTokenGenerator {
    (string Token, DateTime ExpiresAt) GenerateToken(string userId, string email, string name, string role, bool isClient);
}
public interface ICurrentUserService {
    string? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
    bool IsClient { get; }
}

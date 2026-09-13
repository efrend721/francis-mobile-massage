namespace FormWellness.Application.DTOs;
public class GoogleAuthRequest {
    public string IdToken { get; set; } = string.Empty;
    public string? QuadrantCode { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }
}
public class DevLoginRequest {
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "ADMIN";
}
public class AuthResponse {
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileDto User { get; set; } = null!;
}
public class UserProfileDto {
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Picture { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "CLIENT";
    public bool IsGoogleUser { get; set; }
    public string? DefaultAddress { get; set; }
    public string? DefaultPostalCode { get; set; }
    public string? DefaultQuadrantCode { get; set; }
}

using FormWellness.Application.Common.Exceptions;
using FormWellness.Application.DTOs;
using FormWellness.Application.Interfaces;
using FormWellness.Application.Services.Interfaces;
using FormWellness.Domain.Entities;
using FormWellness.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FormWellness.Application.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _db;
    private readonly IGoogleAuthService _googleAuth;
    private readonly IJwtTokenGenerator _jwtGenerator;
    private readonly ICurrentUserService _currentUser;

    public AuthService(
        IApplicationDbContext db,
        IGoogleAuthService googleAuth,
        IJwtTokenGenerator jwtGenerator,
        ICurrentUserService currentUser)
    {
        _db = db;
        _googleAuth = googleAuth;
        _jwtGenerator = jwtGenerator;
        _currentUser = currentUser;
    }

    public async Task<AuthResponse> AuthenticateWithGoogleAsync(GoogleAuthRequest request, CancellationToken ct = default)
    {
        var googleUser = await _googleAuth.ValidateTokenAsync(request.IdToken);
        if (googleUser == null)
            throw new BadRequestException("Invalid Google Token");

        var staffUser = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == googleUser.Email.ToLower(), ct);

        if (staffUser != null)
        {
            staffUser.LastLoginAt = DateTime.UtcNow;
            if (!string.IsNullOrEmpty(googleUser.Picture)) staffUser.Picture = googleUser.Picture;
            await _db.SaveChangesAsync(ct);

            var (staffToken, staffExpires) = _jwtGenerator.GenerateToken(
                staffUser.Id, staffUser.Email, staffUser.Name, staffUser.Role.Code, isClient: false);

            return new AuthResponse
            {
                Token = staffToken,
                ExpiresAt = staffExpires,
                User = new UserProfileDto
                {
                    Id = staffUser.Id,
                    Name = staffUser.Name,
                    Email = staffUser.Email,
                    Picture = staffUser.Picture,
                    Phone = staffUser.Phone,
                    Role = staffUser.Role.Code,
                    IsGoogleUser = true
                }
            };
        }

        var client = await _db.Clients
            .Include(c => c.DefaultQuadrant)
            .FirstOrDefaultAsync(c => c.Email.ToLower() == googleUser.Email.ToLower() || c.Id == googleUser.SubjectId, ct);

        int? quadrantId = null;
        if (!string.IsNullOrWhiteSpace(request.QuadrantCode))
        {
            var q = await _db.CalgaryQuadrants.FirstOrDefaultAsync(x => x.Code == request.QuadrantCode, ct);
            if (q != null) quadrantId = q.Id;
        }

        if (client == null)
        {
            client = new Client
            {
                Id = googleUser.SubjectId,
                Name = googleUser.Name,
                Email = googleUser.Email,
                Picture = googleUser.Picture,
                IsGoogleUser = true,
                DefaultQuadrantId = quadrantId,
                DefaultAddress = request.Address,
                DefaultPostalCode = request.PostalCode,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Clients.Add(client);
        }
        else
        {
            client.Name = googleUser.Name;
            if (!string.IsNullOrEmpty(googleUser.Picture)) client.Picture = googleUser.Picture;
            if (quadrantId.HasValue) client.DefaultQuadrantId = quadrantId;
            if (!string.IsNullOrWhiteSpace(request.Address)) client.DefaultAddress = request.Address;
            if (!string.IsNullOrWhiteSpace(request.PostalCode)) client.DefaultPostalCode = request.PostalCode;
            client.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);

        var (token, expiresAt) = _jwtGenerator.GenerateToken(
            client.Id, client.Email, client.Name, "CLIENT", isClient: true);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserProfileDto
            {
                Id = client.Id,
                Name = client.Name,
                Email = client.Email,
                Picture = client.Picture,
                Phone = client.Phone,
                Role = "CLIENT",
                IsGoogleUser = true,
                DefaultAddress = client.DefaultAddress,
                DefaultPostalCode = client.DefaultPostalCode,
                DefaultQuadrantCode = client.DefaultQuadrant?.Code
            }
        };
    }

    public async Task<AuthResponse> DevLoginAsync(DevLoginRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new BadRequestException("Email is required");

        if (request.Role == RoleCodes.Admin || request.Role == RoleCodes.Therapist)
        {
            var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower(), ct);
            if (user == null)
            {
                var role = await _db.Roles.FirstOrDefaultAsync(r => r.Code == request.Role, ct)
                    ?? await _db.Roles.FirstAsync(ct);

                user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = string.IsNullOrWhiteSpace(request.Name) ? "Francis Admin" : request.Name,
                    Email = request.Email,
                    RoleId = role.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync(ct);
                user.Role = role;
            }

            var (token, exp) = _jwtGenerator.GenerateToken(user.Id, user.Email, user.Name, user.Role.Code, isClient: false);
            return new AuthResponse
            {
                Token = token,
                ExpiresAt = exp,
                User = new UserProfileDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.Code,
                    IsGoogleUser = false
                }
            };
        }
        else
        {
            var client = await _db.Clients.Include(c => c.DefaultQuadrant).FirstOrDefaultAsync(c => c.Email.ToLower() == request.Email.ToLower(), ct);
            if (client == null)
            {
                client = new Client
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = string.IsNullOrWhiteSpace(request.Name) ? "Client Dev" : request.Name,
                    Email = request.Email,
                    IsGoogleUser = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Clients.Add(client);
                await _db.SaveChangesAsync(ct);
            }

            var (token, exp) = _jwtGenerator.GenerateToken(client.Id, client.Email, client.Name, "CLIENT", isClient: true);
            return new AuthResponse
            {
                Token = token,
                ExpiresAt = exp,
                User = new UserProfileDto
                {
                    Id = client.Id,
                    Name = client.Name,
                    Email = client.Email,
                    Role = "CLIENT",
                    IsGoogleUser = false,
                    DefaultAddress = client.DefaultAddress,
                    DefaultPostalCode = client.DefaultPostalCode,
                    DefaultQuadrantCode = client.DefaultQuadrant?.Code
                }
            };
        }
    }

    public async Task<UserProfileDto> GetCurrentUserProfileAsync(CancellationToken ct = default)
    {
        if (!_currentUser.IsAuthenticated || string.IsNullOrEmpty(_currentUser.UserId))
            throw new UnauthorizedException("Not logged in");

        if (_currentUser.IsClient)
        {
            var client = await _db.Clients
                .Include(c => c.DefaultQuadrant)
                .FirstOrDefaultAsync(c => c.Id == _currentUser.UserId, ct);

            if (client == null) throw new NotFoundException("Client", _currentUser.UserId);

            return new UserProfileDto
            {
                Id = client.Id,
                Name = client.Name,
                Email = client.Email,
                Picture = client.Picture,
                Phone = client.Phone,
                Role = "CLIENT",
                IsGoogleUser = client.IsGoogleUser,
                DefaultAddress = client.DefaultAddress,
                DefaultPostalCode = client.DefaultPostalCode,
                DefaultQuadrantCode = client.DefaultQuadrant?.Code
            };
        }
        else
        {
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == _currentUser.UserId, ct);

            if (user == null) throw new NotFoundException("User", _currentUser.UserId);

            return new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Picture = user.Picture,
                Phone = user.Phone,
                Role = user.Role.Code,
                IsGoogleUser = true
            };
        }
    }
}

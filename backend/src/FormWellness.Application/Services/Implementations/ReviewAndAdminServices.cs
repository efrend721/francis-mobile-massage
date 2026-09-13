using FormWellness.Application.Common.Exceptions;
using FormWellness.Application.DTOs;
using FormWellness.Application.Interfaces;
using FormWellness.Application.Services.Interfaces;
using FormWellness.Domain.Entities;
using FormWellness.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FormWellness.Application.Services.Implementations;

public class ReviewService : IReviewService
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public ReviewService(IApplicationDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<List<ReviewDto>> GetPublicReviewsAsync(int limit = 10, CancellationToken ct = default)
    {
        return await _db.Reviews
            .Include(r => r.Client)
            .Include(r => r.Service)
            .Where(r => r.IsPublic)
            .OrderByDescending(r => r.CreatedAt)
            .Take(limit)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                ClientName = r.Client.Name,
                ClientPicture = r.Client.Picture,
                ServiceTitle = r.Service != null ? r.Service.Title : null,
                Rating = r.Rating,
                ReviewText = r.ReviewText,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync(ct);
    }

    public async Task<ReviewDto> CreateReviewAsync(CreateReviewRequest request, CancellationToken ct = default)
    {
        if (!_currentUser.IsAuthenticated || string.IsNullOrEmpty(_currentUser.UserId))
            throw new UnauthorizedException("You must be logged in to leave a review");

        if (request.Rating < 1 || request.Rating > 5)
            throw new BadRequestException("Rating must be between 1 and 5");

        var review = new Review
        {
            Id = Guid.NewGuid(),
            ClientId = _currentUser.UserId,
            ServiceId = request.ServiceId,
            AppointmentId = request.AppointmentId,
            Rating = request.Rating,
            ReviewText = request.ReviewText,
            IsPublic = request.IsPublic,
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync(ct);

        var client = await _db.Clients.FindAsync(new object[] { _currentUser.UserId }, ct);
        var service = request.ServiceId.HasValue ? await _db.Services.FindAsync(new object[] { request.ServiceId.Value }, ct) : null;

        return new ReviewDto
        {
            Id = review.Id,
            ClientName = client?.Name ?? "Client",
            ClientPicture = client?.Picture,
            ServiceTitle = service?.Title,
            Rating = review.Rating,
            ReviewText = review.ReviewText,
            CreatedAt = review.CreatedAt
        };
    }
}

public class AdminService : IAdminService
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public AdminService(IApplicationDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    private void EnsureStaffOrAdmin()
    {
        if (!_currentUser.IsAuthenticated || _currentUser.IsClient)
            throw new ForbiddenException("Staff or Administrator access required");
    }

    public async Task<List<AppointmentDto>> GetCalendarAppointmentsAsync(DateTime fromUtc, DateTime toUtc, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        return await _db.Appointments
            .Include(a => a.Client)
            .Include(a => a.Therapist)
            .Include(a => a.Service)
            .Include(a => a.Status)
            .Include(a => a.Quadrant)
            .Where(a => a.ScheduledAt >= fromUtc && a.ScheduledAt <= toUtc)
            .OrderBy(a => a.ScheduledAt)
            .Select(a => new AppointmentDto
            {
                Id = a.Id,
                ClientId = a.ClientId,
                ClientName = a.Client.Name,
                ClientEmail = a.Client.Email,
                ClientPhone = a.Client.Phone,
                ServiceId = a.ServiceId,
                ServiceTitle = a.Service.Title,
                TherapistName = a.Therapist.Name,
                StatusId = a.StatusId,
                StatusCode = a.Status.Code,
                StatusName = a.Status.Name,
                StatusColorHex = a.Status.ColorHex,
                QuadrantCode = a.Quadrant.Code,
                QuadrantName = a.Quadrant.Name,
                DurationMinutes = a.DurationMinutes,
                Price = a.Price,
                ScheduledAt = a.ScheduledAt,
                BufferMinutes = a.BufferMinutes,
                ServiceAddress = a.ServiceAddress,
                PostalCode = a.PostalCode,
                ClientSpecialNotes = a.ClientSpecialNotes,
                TherapistClinicalNotes = a.TherapistClinicalNotes,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync(ct);
    }

    public async Task<AppointmentDto> UpdateAppointmentStatusAsync(Guid appointmentId, string statusCode, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var app = await _db.Appointments
            .Include(a => a.Client)
            .Include(a => a.Therapist)
            .Include(a => a.Service)
            .Include(a => a.Status)
            .Include(a => a.Quadrant)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, ct)
            ?? throw new NotFoundException("Appointment", appointmentId);

        var status = await _db.AppointmentStatuses.FirstOrDefaultAsync(s => s.Code == statusCode, ct)
            ?? throw new NotFoundException("Status", statusCode);

        app.StatusId = status.Id;
        app.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new AppointmentDto
        {
            Id = app.Id,
            ClientId = app.ClientId,
            ClientName = app.Client.Name,
            ClientEmail = app.Client.Email,
            ClientPhone = app.Client.Phone,
            ServiceId = app.ServiceId,
            ServiceTitle = app.Service.Title,
            TherapistName = app.Therapist.Name,
            StatusId = status.Id,
            StatusCode = status.Code,
            StatusName = status.Name,
            StatusColorHex = status.ColorHex,
            QuadrantCode = app.Quadrant.Code,
            QuadrantName = app.Quadrant.Name,
            DurationMinutes = app.DurationMinutes,
            Price = app.Price,
            ScheduledAt = app.ScheduledAt,
            BufferMinutes = app.BufferMinutes,
            ServiceAddress = app.ServiceAddress,
            PostalCode = app.PostalCode,
            ClientSpecialNotes = app.ClientSpecialNotes,
            TherapistClinicalNotes = app.TherapistClinicalNotes,
            CreatedAt = app.CreatedAt
        };
    }

    public async Task<AppointmentDto> UpdateClinicalNotesAsync(Guid appointmentId, string notes, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var app = await _db.Appointments
            .Include(a => a.Client)
            .Include(a => a.Therapist)
            .Include(a => a.Service)
            .Include(a => a.Status)
            .Include(a => a.Quadrant)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, ct)
            ?? throw new NotFoundException("Appointment", appointmentId);

        app.TherapistClinicalNotes = notes;
        app.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new AppointmentDto
        {
            Id = app.Id,
            ClientId = app.ClientId,
            ClientName = app.Client.Name,
            ClientEmail = app.Client.Email,
            ClientPhone = app.Client.Phone,
            ServiceId = app.ServiceId,
            ServiceTitle = app.Service.Title,
            TherapistName = app.Therapist.Name,
            StatusId = app.StatusId,
            StatusCode = app.Status.Code,
            StatusName = app.Status.Name,
            StatusColorHex = app.Status.ColorHex,
            QuadrantCode = app.Quadrant.Code,
            QuadrantName = app.Quadrant.Name,
            DurationMinutes = app.DurationMinutes,
            Price = app.Price,
            ScheduledAt = app.ScheduledAt,
            BufferMinutes = app.BufferMinutes,
            ServiceAddress = app.ServiceAddress,
            PostalCode = app.PostalCode,
            ClientSpecialNotes = app.ClientSpecialNotes,
            TherapistClinicalNotes = app.TherapistClinicalNotes,
            CreatedAt = app.CreatedAt
        };
    }

    public async Task<List<WorkingScheduleDto>> GetWorkingSchedulesAsync(CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var days = new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
        var schedules = await _db.WorkingSchedules.OrderBy(s => s.DayOfWeek).ToListAsync(ct);

        return schedules.Select(s => new WorkingScheduleDto
        {
            Id = s.Id,
            DayOfWeek = s.DayOfWeek,
            DayName = days[s.DayOfWeek % 7],
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            SlotIntervalMinutes = s.SlotIntervalMinutes,
            BufferMinutes = s.BufferMinutes,
            IsActive = s.IsActive
        }).ToList();
    }

    public async Task UpdateWorkingSchedulesAsync(UpdateWorkingScheduleRequest request, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == _currentUser.UserId, ct)
            ?? await _db.Users.FirstAsync(ct);

        foreach (var item in request.Schedules)
        {
            var existing = await _db.WorkingSchedules.FirstOrDefaultAsync(s => s.UserId == user.Id && s.DayOfWeek == item.DayOfWeek, ct);
            var startTime = TimeOnly.Parse(item.StartTime);
            var endTime = TimeOnly.Parse(item.EndTime);

            if (existing != null)
            {
                existing.StartTime = startTime;
                existing.EndTime = endTime;
                existing.SlotIntervalMinutes = item.SlotIntervalMinutes;
                existing.BufferMinutes = item.BufferMinutes;
                existing.IsActive = item.IsActive;
            }
            else
            {
                _db.WorkingSchedules.Add(new WorkingSchedule
                {
                    UserId = user.Id,
                    DayOfWeek = item.DayOfWeek,
                    StartTime = startTime,
                    EndTime = endTime,
                    SlotIntervalMinutes = item.SlotIntervalMinutes,
                    BufferMinutes = item.BufferMinutes,
                    IsActive = item.IsActive,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _db.SaveChangesAsync(ct);
    }

    public async Task<List<ScheduleBlackoutDto>> GetBlackoutsAsync(DateTime fromUtc, DateTime toUtc, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        return await _db.ScheduleBlackouts
            .Where(b => b.StartTime <= toUtc && b.EndTime >= fromUtc)
            .OrderBy(b => b.StartTime)
            .Select(b => new ScheduleBlackoutDto
            {
                Id = b.Id,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                IsAllDay = b.IsAllDay,
                Reason = b.Reason,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync(ct);
    }

    public async Task<ScheduleBlackoutDto> CreateBlackoutAsync(CreateScheduleBlackoutRequest request, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var userId = _currentUser.UserId ?? (await _db.Users.Select(u => u.Id).FirstAsync(ct));

        var blackout = new ScheduleBlackout
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            StartTime = request.StartTime.ToUniversalTime(),
            EndTime = request.EndTime.ToUniversalTime(),
            IsAllDay = request.IsAllDay,
            Reason = request.Reason,
            CreatedAt = DateTime.UtcNow
        };

        _db.ScheduleBlackouts.Add(blackout);
        await _db.SaveChangesAsync(ct);

        return new ScheduleBlackoutDto
        {
            Id = blackout.Id,
            StartTime = blackout.StartTime,
            EndTime = blackout.EndTime,
            IsAllDay = blackout.IsAllDay,
            Reason = blackout.Reason,
            CreatedAt = blackout.CreatedAt
        };
    }

    public async Task DeleteBlackoutAsync(Guid blackoutId, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var blackout = await _db.ScheduleBlackouts.FindAsync(new object[] { blackoutId }, ct)
            ?? throw new NotFoundException("Blackout", blackoutId);

        _db.ScheduleBlackouts.Remove(blackout);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<List<ClientFollowUpDto>> GetClientFollowUpsAsync(string clientId, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        return await _db.ClientFollowUps
            .Include(f => f.Client)
            .Include(f => f.User)
            .Include(f => f.ContactType)
            .Where(f => f.ClientId == clientId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new ClientFollowUpDto
            {
                Id = f.Id,
                ClientId = f.ClientId,
                ClientName = f.Client.Name,
                UserName = f.User.Name,
                ContactTypeCode = f.ContactType.Code,
                ContactTypeName = f.ContactType.Name,
                PromoOffered = f.PromoOffered,
                OutcomeNotes = f.OutcomeNotes,
                CreatedAt = f.CreatedAt
            })
            .ToListAsync(ct);
    }

    public async Task<ClientFollowUpDto> CreateClientFollowUpAsync(CreateClientFollowUpRequest request, CancellationToken ct = default)
    {
        EnsureStaffOrAdmin();

        var userId = _currentUser.UserId ?? (await _db.Users.Select(u => u.Id).FirstAsync(ct));
        var client = await _db.Clients.FindAsync(new object[] { request.ClientId }, ct)
            ?? throw new NotFoundException("Client", request.ClientId);

        var contactType = await _db.ContactTypes.FirstOrDefaultAsync(c => c.Code == request.ContactTypeCode, ct)
            ?? await _db.ContactTypes.FirstAsync(ct);

        var followUp = new ClientFollowUp
        {
            Id = Guid.NewGuid(),
            ClientId = client.Id,
            UserId = userId,
            ContactTypeId = contactType.Id,
            PromoOffered = request.PromoOffered,
            OutcomeNotes = request.OutcomeNotes,
            CreatedAt = DateTime.UtcNow
        };

        _db.ClientFollowUps.Add(followUp);
        await _db.SaveChangesAsync(ct);

        var user = await _db.Users.FindAsync(new object[] { userId }, ct);

        return new ClientFollowUpDto
        {
            Id = followUp.Id,
            ClientId = client.Id,
            ClientName = client.Name,
            UserName = user?.Name ?? "Staff",
            ContactTypeCode = contactType.Code,
            ContactTypeName = contactType.Name,
            PromoOffered = followUp.PromoOffered,
            OutcomeNotes = followUp.OutcomeNotes,
            CreatedAt = followUp.CreatedAt
        };
    }
}

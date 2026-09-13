using FormWellness.Application.Common.Exceptions;
using FormWellness.Application.DTOs;
using FormWellness.Application.Interfaces;
using FormWellness.Application.Services.Interfaces;
using FormWellness.Domain.Entities;
using FormWellness.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FormWellness.Application.Services.Implementations;

public class AppointmentService : IAppointmentService
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public AppointmentService(IApplicationDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<DayAvailabilityDto> GetAvailabilityAsync(AvailabilityQuery query, CancellationToken ct = default)
    {
        var therapist = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Role.Code == RoleCodes.Admin || u.Role.Code == RoleCodes.Therapist, ct);

        if (therapist == null)
            return new DayAvailabilityDto { Date = query.Date, IsWorkingDay = false };

        var dayOfWeek = (int)query.Date.DayOfWeek;
        var schedule = await _db.WorkingSchedules
            .FirstOrDefaultAsync(s => s.UserId == therapist.Id && s.DayOfWeek == dayOfWeek && s.IsActive, ct);

        if (schedule == null)
            return new DayAvailabilityDto { Date = query.Date, IsWorkingDay = false };

        var dayStartUtc = query.Date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var dayEndUtc = query.Date.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

        var blackouts = await _db.ScheduleBlackouts
            .Where(b => b.UserId == therapist.Id && b.StartTime < dayEndUtc && b.EndTime > dayStartUtc)
            .ToListAsync(ct);

        var activeStatusIds = await _db.AppointmentStatuses
            .Where(s => s.Code != AppointmentStatusCodes.Cancelled)
            .Select(s => s.Id)
            .ToListAsync(ct);

        var appointments = await _db.Appointments
            .Where(a => a.TherapistId == therapist.Id && activeStatusIds.Contains(a.StatusId)
                     && a.ScheduledAt >= dayStartUtc.AddHours(-4) && a.ScheduledAt <= dayEndUtc.AddHours(4))
            .ToListAsync(ct);

        var slots = new List<TimeSlotDto>();
        var currentSlotTime = schedule.StartTime;
        var duration = query.DurationMinutes;
        var buffer = schedule.BufferMinutes;

        while (currentSlotTime.AddMinutes(duration) <= schedule.EndTime)
        {
            var slotStartUtc = query.Date.ToDateTime(currentSlotTime, DateTimeKind.Utc);
            var slotEndUtc = slotStartUtc.AddMinutes(duration);
            var slotWithBufferEndUtc = slotEndUtc.AddMinutes(buffer);

            bool isConflict = false;
            string? reason = null;

            if (slotStartUtc <= DateTime.UtcNow)
            {
                isConflict = true;
                reason = "Past time";
            }

            if (!isConflict)
            {
                foreach (var blackout in blackouts)
                {
                    if (blackout.IsAllDay || (blackout.StartTime < slotWithBufferEndUtc && blackout.EndTime > slotStartUtc))
                    {
                        isConflict = true;
                        reason = "Therapist unavailable";
                        break;
                    }
                }
            }

            if (!isConflict)
            {
                foreach (var app in appointments)
                {
                    var appStart = app.ScheduledAt;
                    var appEndWithBuffer = appStart.AddMinutes(app.DurationMinutes + app.BufferMinutes);

                    if (appStart < slotWithBufferEndUtc && appEndWithBuffer > slotStartUtc)
                    {
                        isConflict = true;
                        reason = "Slot already booked";
                        break;
                    }
                }
            }

            var timeString = DateTime.Today.Add(currentSlotTime.ToTimeSpan()).ToString("h:mm tt");

            slots.Add(new TimeSlotDto
            {
                Time = currentSlotTime,
                FormattedTime = timeString,
                IsAvailable = !isConflict,
                ReasonUnavailable = reason
            });

            currentSlotTime = currentSlotTime.AddMinutes(schedule.SlotIntervalMinutes);
        }

        return new DayAvailabilityDto
        {
            Date = query.Date,
            IsWorkingDay = true,
            Slots = slots
        };
    }

    public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        string clientId;
        Client client;

        if (_currentUser.IsAuthenticated && !string.IsNullOrEmpty(_currentUser.UserId) && _currentUser.IsClient)
        {
            clientId = _currentUser.UserId;
            client = await _db.Clients.FindAsync(new object[] { clientId }, ct)
                ?? throw new NotFoundException("Client", clientId);
        }
        else
        {
            if (string.IsNullOrWhiteSpace(request.ClientEmail) || string.IsNullOrWhiteSpace(request.ClientName))
                throw new BadRequestException("Client name and email are required for guest booking");

            var existingClient = await _db.Clients.FirstOrDefaultAsync(c => c.Email.ToLower() == request.ClientEmail.ToLower(), ct);
            if (existingClient != null)
            {
                client = existingClient;
                clientId = existingClient.Id;
            }
            else
            {
                clientId = Guid.NewGuid().ToString();
                client = new Client
                {
                    Id = clientId,
                    Name = request.ClientName,
                    Email = request.ClientEmail,
                    Phone = request.ClientPhone,
                    IsGoogleUser = false,
                    DefaultAddress = request.ServiceAddress,
                    DefaultPostalCode = request.PostalCode,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Clients.Add(client);
            }
        }

        var service = await _db.Services.FirstOrDefaultAsync(s => s.Id == request.ServiceId && s.IsActive, ct)
            ?? throw new NotFoundException("Service", request.ServiceId);

        var quadrant = await _db.CalgaryQuadrants.FirstOrDefaultAsync(q => q.Code == request.QuadrantCode && q.IsActive, ct)
            ?? await _db.CalgaryQuadrants.FirstOrDefaultAsync(ct)
            ?? throw new BadRequestException("Invalid Quadrant");

        var pendingStatus = await _db.AppointmentStatuses.FirstOrDefaultAsync(s => s.Code == AppointmentStatusCodes.Pending, ct)
            ?? await _db.AppointmentStatuses.FirstAsync(ct);

        var therapist = await _db.Users.Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Role.Code == RoleCodes.Admin || u.Role.Code == RoleCodes.Therapist, ct)
            ?? throw new BadRequestException("No active therapist found in system");

        decimal price = service.BasePrice;
        if (request.DurationMinutes == 90) price += 35m;
        else if (request.DurationMinutes == 120) price += 70m;

        var appointment = new Appointment
        {
            Id = Guid.NewGuid(),
            ClientId = client.Id,
            TherapistId = therapist.Id,
            ServiceId = service.Id,
            StatusId = pendingStatus.Id,
            QuadrantId = quadrant.Id,
            DurationMinutes = request.DurationMinutes,
            Price = price,
            ScheduledAt = request.ScheduledAt.ToUniversalTime(),
            BufferMinutes = 30,
            ServiceAddress = request.ServiceAddress,
            PostalCode = request.PostalCode,
            ClientSpecialNotes = request.ClientSpecialNotes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync(ct);

        return new AppointmentDto
        {
            Id = appointment.Id,
            ClientId = client.Id,
            ClientName = client.Name,
            ClientEmail = client.Email,
            ClientPhone = client.Phone,
            ServiceId = service.Id,
            ServiceTitle = service.Title,
            TherapistName = therapist.Name,
            StatusId = pendingStatus.Id,
            StatusCode = pendingStatus.Code,
            StatusName = pendingStatus.Name,
            StatusColorHex = pendingStatus.ColorHex,
            QuadrantCode = quadrant.Code,
            QuadrantName = quadrant.Name,
            DurationMinutes = appointment.DurationMinutes,
            Price = appointment.Price,
            ScheduledAt = appointment.ScheduledAt,
            BufferMinutes = appointment.BufferMinutes,
            ServiceAddress = appointment.ServiceAddress,
            PostalCode = appointment.PostalCode,
            ClientSpecialNotes = appointment.ClientSpecialNotes,
            CreatedAt = appointment.CreatedAt
        };
    }

    public async Task<List<AppointmentDto>> GetMyAppointmentsAsync(CancellationToken ct = default)
    {
        if (!_currentUser.IsAuthenticated || string.IsNullOrEmpty(_currentUser.UserId))
            throw new UnauthorizedException();

        return await _db.Appointments
            .Include(a => a.Client)
            .Include(a => a.Therapist)
            .Include(a => a.Service)
            .Include(a => a.Status)
            .Include(a => a.Quadrant)
            .Where(a => a.ClientId == _currentUser.UserId)
            .OrderByDescending(a => a.ScheduledAt)
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

    public async Task<AppointmentDto> CancelAppointmentAsync(Guid appointmentId, CancellationToken ct = default)
    {
        var app = await _db.Appointments
            .Include(a => a.Client)
            .Include(a => a.Therapist)
            .Include(a => a.Service)
            .Include(a => a.Status)
            .Include(a => a.Quadrant)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, ct)
            ?? throw new NotFoundException("Appointment", appointmentId);

        if (_currentUser.IsClient && app.ClientId != _currentUser.UserId)
            throw new ForbiddenException("You cannot cancel another client's appointment");

        var cancelStatus = await _db.AppointmentStatuses.FirstOrDefaultAsync(s => s.Code == AppointmentStatusCodes.Cancelled, ct)
            ?? throw new BadRequestException("Cancelled status not configured");

        app.StatusId = cancelStatus.Id;
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
            StatusId = cancelStatus.Id,
            StatusCode = cancelStatus.Code,
            StatusName = cancelStatus.Name,
            StatusColorHex = cancelStatus.ColorHex,
            QuadrantCode = app.Quadrant.Code,
            QuadrantName = app.Quadrant.Name,
            DurationMinutes = app.DurationMinutes,
            Price = app.Price,
            ScheduledAt = app.ScheduledAt,
            BufferMinutes = app.BufferMinutes,
            ServiceAddress = app.ServiceAddress,
            PostalCode = app.PostalCode,
            CreatedAt = app.CreatedAt
        };
    }
}

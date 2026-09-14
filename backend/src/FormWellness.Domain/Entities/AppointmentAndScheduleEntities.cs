using FormWellness.Domain.Common;

namespace FormWellness.Domain.Entities;

public class WorkingSchedule : BaseEntity<int>
{
    public string UserId { get; set; } = string.Empty;
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int SlotIntervalMinutes { get; set; } = 30;
    public int BufferMinutes { get; set; } = 30;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User User { get; set; } = null!;
}

public class ScheduleBlackout : BaseEntity<Guid>
{
    public string UserId { get; set; } = string.Empty;
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public bool IsAllDay { get; set; }
    public string? Reason { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User User { get; set; } = null!;
}

public class Appointment : AuditableEntity<Guid>
{
    public string ClientId { get; set; } = string.Empty;
    public string TherapistId { get; set; } = string.Empty;
    public int ServiceId { get; set; }
    public int StatusId { get; set; }
    public int QuadrantId { get; set; }

    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public DateTimeOffset ScheduledAt { get; set; }
    public int BufferMinutes { get; set; } = 30;

    public string ServiceAddress { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public string? ClientSpecialNotes { get; set; }
    public string? TherapistClinicalNotes { get; set; }

    public Client Client { get; set; } = null!;
    public User Therapist { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public AppointmentStatus Status { get; set; } = null!;
    public CalgaryQuadrant Quadrant { get; set; } = null!;
    public Review? Review { get; set; }
}

public class Review : BaseEntity<Guid>
{
    public string ClientId { get; set; } = string.Empty;
    public int? ServiceId { get; set; }
    public Guid? AppointmentId { get; set; }

    public int Rating { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Client Client { get; set; } = null!;
    public Service? Service { get; set; }
    public Appointment? Appointment { get; set; }
}

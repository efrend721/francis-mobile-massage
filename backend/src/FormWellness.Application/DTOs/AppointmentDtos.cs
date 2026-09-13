namespace FormWellness.Application.DTOs;
public class CreateAppointmentRequest {
    public int ServiceId { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string QuadrantCode { get; set; } = string.Empty;
    public string ServiceAddress { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public string? ClientSpecialNotes { get; set; }
    public string? ClientName { get; set; }
    public string? ClientEmail { get; set; }
    public string? ClientPhone { get; set; }
}
public class AppointmentDto {
    public Guid Id { get; set; }
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string? ClientPhone { get; set; }
    public int ServiceId { get; set; }
    public string ServiceTitle { get; set; } = string.Empty;
    public string TherapistName { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public string StatusCode { get; set; } = string.Empty;
    public string StatusName { get; set; } = string.Empty;
    public string? StatusColorHex { get; set; }
    public string QuadrantCode { get; set; } = string.Empty;
    public string QuadrantName { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public DateTime ScheduledAt { get; set; }
    public int BufferMinutes { get; set; }
    public string ServiceAddress { get; set; } = string.Empty;
    public string? PostalCode { get; set; }
    public string? ClientSpecialNotes { get; set; }
    public string? TherapistClinicalNotes { get; set; }
    public DateTime CreatedAt { get; set; }
}
public class AvailabilityQuery {
    public DateOnly Date { get; set; }
    public int DurationMinutes { get; set; } = 60;
}
public class TimeSlotDto {
    public TimeOnly Time { get; set; }
    public string FormattedTime { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public string? ReasonUnavailable { get; set; }
}
public class DayAvailabilityDto {
    public DateOnly Date { get; set; }
    public bool IsWorkingDay { get; set; }
    public List<TimeSlotDto> Slots { get; set; } = [];
}

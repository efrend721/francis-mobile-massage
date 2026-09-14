namespace FormWellness.Application.DTOs;

public class CreateReviewRequest {
    public int? ServiceId { get; set; }
    public Guid? AppointmentId { get; set; }
    public int Rating { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = true;
}

public class ReviewDto {
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientPicture { get; set; }
    public string? ServiceTitle { get; set; }
    public int Rating { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
}

public class WorkingScheduleDto {
    public int Id { get; set; }
    public int DayOfWeek { get; set; }
    public string DayName { get; set; } = string.Empty;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int SlotIntervalMinutes { get; set; }
    public int BufferMinutes { get; set; }
    public bool IsActive { get; set; }
}

public class UpdateWorkingScheduleRequest {
    public List<WorkingScheduleItemRequest> Schedules { get; set; } = [];
}

public class WorkingScheduleItemRequest {
    public int DayOfWeek { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "20:00";
    public int SlotIntervalMinutes { get; set; } = 30;
    public int BufferMinutes { get; set; } = 30;
    public bool IsActive { get; set; } = true;
}

public class ScheduleBlackoutDto {
    public Guid Id { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public bool IsAllDay { get; set; }
    public string? Reason { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class CreateScheduleBlackoutRequest {
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public bool IsAllDay { get; set; }
    public string? Reason { get; set; }
}

public class ClientFollowUpDto {
    public Guid Id { get; set; }
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string ContactTypeCode { get; set; } = string.Empty;
    public string ContactTypeName { get; set; } = string.Empty;
    public string? PromoOffered { get; set; }
    public string? OutcomeNotes { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class CreateClientFollowUpRequest {
    public string ClientId { get; set; } = string.Empty;
    public string ContactTypeCode { get; set; } = "PHONE_CALL";
    public string? PromoOffered { get; set; }
    public string? OutcomeNotes { get; set; }
}

public class UpdateAppointmentStatusRequest {
    public string StatusCode { get; set; } = string.Empty;
}

public class UpdateClinicalNotesRequest {
    public string ClinicalNotes { get; set; } = string.Empty;
}

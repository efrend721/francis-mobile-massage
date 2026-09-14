using FormWellness.Domain.Common;

namespace FormWellness.Domain.Entities;

public class User : BaseEntity<string>
{
    public int RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Picture { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? LastLoginAt { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<WorkingSchedule> WorkingSchedules { get; set; } = new List<WorkingSchedule>();
    public ICollection<ScheduleBlackout> ScheduleBlackouts { get; set; } = new List<ScheduleBlackout>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<ClientFollowUp> FollowUps { get; set; } = new List<ClientFollowUp>();
}

public class Client : AuditableEntity<string>
{
    public int? DefaultQuadrantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Picture { get; set; }
    public string? DefaultAddress { get; set; }
    public string? DefaultPostalCode { get; set; }
    public bool IsGoogleUser { get; set; } = true;
    public string? PrivateNotes { get; set; }
    public bool AcceptsPromos { get; set; } = true;

    public CalgaryQuadrant? DefaultQuadrant { get; set; }
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<ClientIntakeForm> IntakeForms { get; set; } = new List<ClientIntakeForm>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<ClientFollowUp> FollowUps { get; set; } = new List<ClientFollowUp>();
}

public class ClientFollowUp : BaseEntity<Guid>
{
    public string ClientId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public int ContactTypeId { get; set; }
    public string? PromoOffered { get; set; }
    public string? OutcomeNotes { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Client Client { get; set; } = null!;
    public User User { get; set; } = null!;
    public ContactType ContactType { get; set; } = null!;
}

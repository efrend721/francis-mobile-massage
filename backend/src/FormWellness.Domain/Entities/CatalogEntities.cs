using FormWellness.Domain.Common;

namespace FormWellness.Domain.Entities;

public class Role : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<User> Users { get; set; } = new List<User>();
}

public class CalgaryQuadrant : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Client> Clients { get; set; } = new List<Client>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

public class PressureLevel : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<ClientIntakeForm> IntakeForms { get; set; } = new List<ClientIntakeForm>();
}

public class AromatherapyOption : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal ExtraCharge { get; set; } = 0.00m;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<ClientIntakeForm> IntakeForms { get; set; } = new List<ClientIntakeForm>();
}

public class FocusArea : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<IntakeFormFocusArea> IntakeFormFocusAreas { get; set; } = new List<IntakeFormFocusArea>();
}

public class Service : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? Description { get; set; }
    public int[] AvailableDurationsMin { get; set; } = [60, 90];
    public decimal BasePrice { get; set; }
    public string? Badge { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

public class AppointmentStatus : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ColorHex { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

public class ContactType : BaseEntity<int>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<ClientFollowUp> FollowUps { get; set; } = new List<ClientFollowUp>();
}

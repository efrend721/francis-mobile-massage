using FormWellness.Domain.Common;

namespace FormWellness.Domain.Entities;

public class ClientIntakeForm : AuditableEntity<Guid>
{
    public string ClientId { get; set; } = string.Empty;
    public int PressureLevelId { get; set; }
    public int AromatherapyId { get; set; }

    public bool IsFirstVisit { get; set; } = true;
    public bool HasHighBloodPressure { get; set; }
    public bool IsPregnant { get; set; }
    public string? PregnancyWeeks { get; set; }
    public bool HasRecentSurgeriesOrInjuries { get; set; }
    public string? SurgeriesDetails { get; set; }
    public bool HasAllergiesToOilsOrNuts { get; set; }
    public string? AllergiesDetails { get; set; }
    public string? OtherHealthNotes { get; set; }

    public bool PipaConsentAccepted { get; set; }
    public bool CancellationPolicyAccepted { get; set; }
    public string SignatureName { get; set; } = string.Empty;

    public bool IsLatest { get; set; } = true;
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    public Client Client { get; set; } = null!;
    public PressureLevel PressureLevel { get; set; } = null!;
    public AromatherapyOption AromatherapyOption { get; set; } = null!;
    public ICollection<IntakeFormFocusArea> IntakeFormFocusAreas { get; set; } = new List<IntakeFormFocusArea>();
}

public class IntakeFormFocusArea
{
    public Guid IntakeFormId { get; set; }
    public int FocusAreaId { get; set; }
    public int? PainLevel { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ClientIntakeForm IntakeForm { get; set; } = null!;
    public FocusArea FocusArea { get; set; } = null!;
}

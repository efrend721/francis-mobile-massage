namespace FormWellness.Application.DTOs;

public class IntakeFocusAreaRequest {
    public int FocusAreaId { get; set; }
    public int? PainLevel { get; set; }
}

public class IntakeFocusAreaDto {
    public int FocusAreaId { get; set; }
    public string FocusAreaCode { get; set; } = string.Empty;
    public string FocusAreaName { get; set; } = string.Empty;
    public int? PainLevel { get; set; }
}

public class SaveIntakeFormRequest {
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
    public List<IntakeFocusAreaRequest> FocusAreas { get; set; } = [];
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? QuadrantCode { get; set; }
}

public class IntakeFormDto {
    public Guid Id { get; set; }
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public int PressureLevelId { get; set; }
    public string PressureLevelName { get; set; } = string.Empty;
    public int AromatherapyId { get; set; }
    public string AromatherapyName { get; set; } = string.Empty;
    public bool IsFirstVisit { get; set; }
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
    public DateTimeOffset CompletedAt { get; set; }
    public List<IntakeFocusAreaDto> FocusAreas { get; set; } = [];
}

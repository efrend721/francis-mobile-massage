namespace FormWellness.Application.DTOs;
public class CalgaryQuadrantDto {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
public class PressureLevelDto {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}
public class AromatherapyOptionDto {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal ExtraCharge { get; set; }
    public int DisplayOrder { get; set; }
}
public class FocusAreaDto {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}
public class ServiceDto {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? Description { get; set; }
    public int[] AvailableDurationsMin { get; set; } = [];
    public decimal BasePrice { get; set; }
    public string? Badge { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
}
public class AppointmentStatusDto {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ColorHex { get; set; }
    public string? Description { get; set; }
}
public class AllCatalogsDto {
    public List<CalgaryQuadrantDto> Quadrants { get; set; } = [];
    public List<PressureLevelDto> PressureLevels { get; set; } = [];
    public List<AromatherapyOptionDto> AromatherapyOptions { get; set; } = [];
    public List<FocusAreaDto> FocusAreas { get; set; } = [];
    public List<ServiceDto> Services { get; set; } = [];
    public List<AppointmentStatusDto> Statuses { get; set; } = [];
}

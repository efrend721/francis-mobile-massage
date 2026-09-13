namespace FormWellness.Domain.Enums;

public static class RoleCodes
{
    public const string Admin = "ADMIN";
    public const string Therapist = "THERAPIST";
    public const string Staff = "STAFF";
}

public static class QuadrantCodes
{
    public const string Northwest = "NW";
    public const string Southwest = "SW";
    public const string Southeast = "SE";
    public const string Northeast = "NE";
    public const string Downtown = "DOWNTOWN";
    public const string Surrounding = "SURROUNDING";
}

public static class AppointmentStatusCodes
{
    public const string Pending = "PENDING";
    public const string Confirmed = "CONFIRMED";
    public const string EnRoute = "EN_ROUTE";
    public const string Completed = "COMPLETED";
    public const string Cancelled = "CANCELLED";
}

public static class PressureLevelCodes
{
    public const string Light = "LIGHT";
    public const string Medium = "MEDIUM";
    public const string Firm = "FIRM";
    public const string DeepTissue = "DEEP_TISSUE";
}

public static class AromatherapyCodes
{
    public const string Unscented = "UNSCENTED";
    public const string Eucalyptus = "EUCALYPTUS";
    public const string Lavender = "LAVENDER";
    public const string Peppermint = "PEPPERMINT";
    public const string SweetOrange = "SWEET_ORANGE";
}

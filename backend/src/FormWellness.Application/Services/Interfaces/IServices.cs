using FormWellness.Application.DTOs;
namespace FormWellness.Application.Services.Interfaces;
public interface ICatalogService {
    Task<AllCatalogsDto> GetAllCatalogsAsync(CancellationToken ct = default);
    Task<List<ServiceDto>> GetServicesAsync(CancellationToken ct = default);
    Task<List<CalgaryQuadrantDto>> GetQuadrantsAsync(CancellationToken ct = default);
}
public interface IAuthService {
    Task<AuthResponse> AuthenticateWithGoogleAsync(GoogleAuthRequest request, CancellationToken ct = default);
    Task<AuthResponse> DevLoginAsync(DevLoginRequest request, CancellationToken ct = default);
    Task<UserProfileDto> GetCurrentUserProfileAsync(CancellationToken ct = default);
}
public interface IAppointmentService {
    Task<DayAvailabilityDto> GetAvailabilityAsync(AvailabilityQuery query, CancellationToken ct = default);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentRequest request, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetMyAppointmentsAsync(CancellationToken ct = default);
    Task<AppointmentDto> CancelAppointmentAsync(Guid appointmentId, CancellationToken ct = default);
}
public interface IIntakeService {
    Task<IntakeFormDto> SaveIntakeFormAsync(SaveIntakeFormRequest request, CancellationToken ct = default);
    Task<IntakeFormDto?> GetMyLatestIntakeFormAsync(CancellationToken ct = default);
}
public interface IReviewService {
    Task<List<ReviewDto>> GetPublicReviewsAsync(int limit = 10, CancellationToken ct = default);
    Task<ReviewDto> CreateReviewAsync(CreateReviewRequest request, CancellationToken ct = default);
}
public interface IAdminService {
    Task<List<AppointmentDto>> GetCalendarAppointmentsAsync(DateTime fromUtc, DateTime toUtc, CancellationToken ct = default);
    Task<AppointmentDto> UpdateAppointmentStatusAsync(Guid appointmentId, string statusCode, CancellationToken ct = default);
    Task<AppointmentDto> UpdateClinicalNotesAsync(Guid appointmentId, string notes, CancellationToken ct = default);
    Task<List<WorkingScheduleDto>> GetWorkingSchedulesAsync(CancellationToken ct = default);
    Task UpdateWorkingSchedulesAsync(UpdateWorkingScheduleRequest request, CancellationToken ct = default);
    Task<List<ScheduleBlackoutDto>> GetBlackoutsAsync(DateTime fromUtc, DateTime toUtc, CancellationToken ct = default);
    Task<ScheduleBlackoutDto> CreateBlackoutAsync(CreateScheduleBlackoutRequest request, CancellationToken ct = default);
    Task DeleteBlackoutAsync(Guid blackoutId, CancellationToken ct = default);
    Task<List<ClientFollowUpDto>> GetClientFollowUpsAsync(string clientId, CancellationToken ct = default);
    Task<ClientFollowUpDto> CreateClientFollowUpAsync(CreateClientFollowUpRequest request, CancellationToken ct = default);
}

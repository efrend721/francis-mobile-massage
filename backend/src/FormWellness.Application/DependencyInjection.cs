using FormWellness.Application.Services.Implementations;
using FormWellness.Application.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace FormWellness.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<IIntakeService, IntakeService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IAdminService, AdminService>();

        return services;
    }
}

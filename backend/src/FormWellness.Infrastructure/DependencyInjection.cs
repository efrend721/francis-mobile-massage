using FormWellness.Application.Interfaces;
using FormWellness.Infrastructure.Data;
using FormWellness.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FormWellness.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=form_wellness_db;Username=postgres;Password=postgres";

        services.AddDbContext<FormWellnessDbContext>(options =>
            options.UseSqlServer(connectionString, b =>
            {
                b.MigrationsAssembly(typeof(FormWellnessDbContext).Assembly.FullName);
                b.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
            }));

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<FormWellnessDbContext>());
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}

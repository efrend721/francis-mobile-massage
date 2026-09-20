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
            ?? "Server=(localdb)\\mssqllocaldb;Database=form_wellness_db;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";

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

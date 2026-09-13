using FormWellness.Domain.Entities;
using Microsoft.EntityFrameworkCore;
namespace FormWellness.Application.Interfaces;
public interface IApplicationDbContext {
    DbSet<Role> Roles { get; }
    DbSet<CalgaryQuadrant> CalgaryQuadrants { get; }
    DbSet<PressureLevel> PressureLevels { get; }
    DbSet<AromatherapyOption> AromatherapyOptions { get; }
    DbSet<FocusArea> FocusAreas { get; }
    DbSet<Service> Services { get; }
    DbSet<AppointmentStatus> AppointmentStatuses { get; }
    DbSet<ContactType> ContactTypes { get; }
    DbSet<User> Users { get; }
    DbSet<Client> Clients { get; }
    DbSet<ClientFollowUp> ClientFollowUps { get; }
    DbSet<ClientIntakeForm> ClientIntakeForms { get; }
    DbSet<IntakeFormFocusArea> IntakeFormFocusAreas { get; }
    DbSet<WorkingSchedule> WorkingSchedules { get; }
    DbSet<ScheduleBlackout> ScheduleBlackouts { get; }
    DbSet<Appointment> Appointments { get; }
    DbSet<Review> Reviews { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

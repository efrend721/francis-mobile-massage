using FormWellness.Application.Interfaces;
using FormWellness.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace FormWellness.Infrastructure.Data;

public class FormWellnessDbContext : DbContext, IApplicationDbContext
{
    public FormWellnessDbContext(DbContextOptions<FormWellnessDbContext> options) : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<CalgaryQuadrant> CalgaryQuadrants => Set<CalgaryQuadrant>();
    public DbSet<PressureLevel> PressureLevels => Set<PressureLevel>();
    public DbSet<AromatherapyOption> AromatherapyOptions => Set<AromatherapyOption>();
    public DbSet<FocusArea> FocusAreas => Set<FocusArea>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<AppointmentStatus> AppointmentStatuses => Set<AppointmentStatus>();
    public DbSet<ContactType> ContactTypes => Set<ContactType>();

    public DbSet<User> Users => Set<User>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<ClientFollowUp> ClientFollowUps => Set<ClientFollowUp>();

    public DbSet<ClientIntakeForm> ClientIntakeForms => Set<ClientIntakeForm>();
    public DbSet<IntakeFormFocusArea> IntakeFormFocusAreas => Set<IntakeFormFocusArea>();

    public DbSet<WorkingSchedule> WorkingSchedules => Set<WorkingSchedule>();
    public DbSet<ScheduleBlackout> ScheduleBlackouts => Set<ScheduleBlackout>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}

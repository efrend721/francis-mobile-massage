using FormWellness.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FormWellness.Infrastructure.Data.Configurations;

public class CoreEntityConfigurations :
    IEntityTypeConfiguration<User>,
    IEntityTypeConfiguration<Client>,
    IEntityTypeConfiguration<ClientFollowUp>,
    IEntityTypeConfiguration<ClientIntakeForm>,
    IEntityTypeConfiguration<IntakeFormFocusArea>,
    IEntityTypeConfiguration<WorkingSchedule>,
    IEntityTypeConfiguration<ScheduleBlackout>,
    IEntityTypeConfiguration<Appointment>,
    IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id").HasMaxLength(128);
        builder.Property(e => e.RoleId).HasColumnName("role_id");
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(150).IsRequired();
        builder.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
        builder.HasIndex(e => e.Email).IsUnique();
        builder.Property(e => e.Picture).HasColumnName("picture");
        builder.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(30);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
        builder.Property(e => e.LastLoginAt).HasColumnName("last_login_at");

        builder.HasOne(e => e.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(e => e.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("clients");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id").HasMaxLength(128);
        builder.Property(e => e.DefaultQuadrantId).HasColumnName("default_quadrant_id");
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(150).IsRequired();
        builder.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
        builder.HasIndex(e => e.Email).IsUnique();
        builder.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(30);
        builder.Property(e => e.Picture).HasColumnName("picture");
        builder.Property(e => e.DefaultAddress).HasColumnName("default_address");
        builder.Property(e => e.DefaultPostalCode).HasColumnName("default_postal_code").HasMaxLength(10);
        builder.Property(e => e.IsGoogleUser).HasColumnName("is_google_user").HasDefaultValue(true);
        builder.Property(e => e.PrivateNotes).HasColumnName("private_notes");
        builder.Property(e => e.AcceptsPromos).HasColumnName("accepts_promos").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(e => e.DefaultQuadrant)
            .WithMany(q => q.Clients)
            .HasForeignKey(e => e.DefaultQuadrantId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    public void Configure(EntityTypeBuilder<ClientFollowUp> builder)
    {
        builder.ToTable("client_follow_ups");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ClientId).HasColumnName("client_id").HasMaxLength(128);
        builder.Property(e => e.UserId).HasColumnName("user_id").HasMaxLength(128);
        builder.Property(e => e.ContactTypeId).HasColumnName("contact_type_id");
        builder.Property(e => e.PromoOffered).HasColumnName("promo_offered").HasMaxLength(150);
        builder.Property(e => e.OutcomeNotes).HasColumnName("outcome_notes");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");

        builder.HasOne(e => e.Client)
            .WithMany(c => c.FollowUps)
            .HasForeignKey(e => e.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.User)
            .WithMany(u => u.FollowUps)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ContactType)
            .WithMany(t => t.FollowUps)
            .HasForeignKey(e => e.ContactTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public void Configure(EntityTypeBuilder<ClientIntakeForm> builder)
    {
        builder.ToTable("client_intake_forms");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ClientId).HasColumnName("client_id").HasMaxLength(128);
        builder.Property(e => e.PressureLevelId).HasColumnName("pressure_level_id");
        builder.Property(e => e.AromatherapyId).HasColumnName("aromatherapy_id");

        builder.Property(e => e.IsFirstVisit).HasColumnName("is_first_visit").HasDefaultValue(true);
        builder.Property(e => e.HasHighBloodPressure).HasColumnName("has_high_blood_pressure").HasDefaultValue(false);
        builder.Property(e => e.IsPregnant).HasColumnName("is_pregnant").HasDefaultValue(false);
        builder.Property(e => e.PregnancyWeeks).HasColumnName("pregnancy_weeks").HasMaxLength(20);
        builder.Property(e => e.HasRecentSurgeriesOrInjuries).HasColumnName("has_recent_surgeries_or_injuries").HasDefaultValue(false);
        builder.Property(e => e.SurgeriesDetails).HasColumnName("surgeries_details");
        builder.Property(e => e.HasAllergiesToOilsOrNuts).HasColumnName("has_allergies_to_oils_or_nuts").HasDefaultValue(false);
        builder.Property(e => e.AllergiesDetails).HasColumnName("allergies_details");
        builder.Property(e => e.OtherHealthNotes).HasColumnName("other_health_notes");

        builder.Property(e => e.PipaConsentAccepted).HasColumnName("pipa_consent_accepted").HasDefaultValue(false);
        builder.Property(e => e.CancellationPolicyAccepted).HasColumnName("cancellation_policy_accepted").HasDefaultValue(false);
        builder.Property(e => e.SignatureName).HasColumnName("signature_name").HasMaxLength(150).IsRequired();

        builder.Property(e => e.IsLatest).HasColumnName("is_latest").HasDefaultValue(true);
        builder.Property(e => e.CompletedAt).HasColumnName("completed_at");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(e => e.Client)
            .WithMany(c => c.IntakeForms)
            .HasForeignKey(e => e.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.PressureLevel)
            .WithMany(p => p.IntakeForms)
            .HasForeignKey(e => e.PressureLevelId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.AromatherapyOption)
            .WithMany(a => a.IntakeForms)
            .HasForeignKey(e => e.AromatherapyId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public void Configure(EntityTypeBuilder<IntakeFormFocusArea> builder)
    {
        builder.ToTable("intake_form_focus_areas");
        builder.HasKey(e => new { e.IntakeFormId, e.FocusAreaId });
        builder.Property(e => e.IntakeFormId).HasColumnName("intake_form_id");
        builder.Property(e => e.FocusAreaId).HasColumnName("focus_area_id");
        builder.Property(e => e.PainLevel).HasColumnName("pain_level");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");

        builder.HasOne(e => e.IntakeForm)
            .WithMany(f => f.IntakeFormFocusAreas)
            .HasForeignKey(e => e.IntakeFormId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.FocusArea)
            .WithMany(f => f.IntakeFormFocusAreas)
            .HasForeignKey(e => e.FocusAreaId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public void Configure(EntityTypeBuilder<WorkingSchedule> builder)
    {
        builder.ToTable("working_schedules");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.UserId).HasColumnName("user_id").HasMaxLength(128);
        builder.Property(e => e.DayOfWeek).HasColumnName("day_of_week");
        builder.Property(e => e.StartTime).HasColumnName("start_time");
        builder.Property(e => e.EndTime).HasColumnName("end_time");
        builder.Property(e => e.SlotIntervalMinutes).HasColumnName("slot_interval_minutes").HasDefaultValue(30);
        builder.Property(e => e.BufferMinutes).HasColumnName("buffer_minutes").HasDefaultValue(30);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");

        builder.HasIndex(e => new { e.UserId, e.DayOfWeek }).IsUnique();

        builder.HasOne(e => e.User)
            .WithMany(u => u.WorkingSchedules)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public void Configure(EntityTypeBuilder<ScheduleBlackout> builder)
    {
        builder.ToTable("schedule_blackouts");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.UserId).HasColumnName("user_id").HasMaxLength(128);
        builder.Property(e => e.StartTime).HasColumnName("start_time");
        builder.Property(e => e.EndTime).HasColumnName("end_time");
        builder.Property(e => e.IsAllDay).HasColumnName("is_all_day").HasDefaultValue(false);
        builder.Property(e => e.Reason).HasColumnName("reason").HasMaxLength(150);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");

        builder.HasIndex(e => new { e.UserId, e.StartTime, e.EndTime });

        builder.HasOne(e => e.User)
            .WithMany(u => u.ScheduleBlackouts)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("appointments");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ClientId).HasColumnName("client_id").HasMaxLength(128);
        builder.Property(e => e.TherapistId).HasColumnName("therapist_id").HasMaxLength(128);
        builder.Property(e => e.ServiceId).HasColumnName("service_id");
        builder.Property(e => e.StatusId).HasColumnName("status_id");
        builder.Property(e => e.QuadrantId).HasColumnName("quadrant_id");
        builder.Property(e => e.DurationMinutes).HasColumnName("duration_minutes");
        builder.Property(e => e.Price).HasColumnName("price").HasPrecision(10, 2);
        builder.Property(e => e.ScheduledAt).HasColumnName("scheduled_at");
        builder.Property(e => e.BufferMinutes).HasColumnName("buffer_minutes").HasDefaultValue(30);
        builder.Property(e => e.ServiceAddress).HasColumnName("service_address").IsRequired();
        builder.Property(e => e.PostalCode).HasColumnName("postal_code").HasMaxLength(10);
        builder.Property(e => e.ClientSpecialNotes).HasColumnName("client_special_notes");
        builder.Property(e => e.TherapistClinicalNotes).HasColumnName("therapist_clinical_notes");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(e => e.ClientId);
        builder.HasIndex(e => e.TherapistId);
        builder.HasIndex(e => e.ScheduledAt);

        builder.HasOne(e => e.Client)
            .WithMany(c => c.Appointments)
            .HasForeignKey(e => e.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Therapist)
            .WithMany(u => u.Appointments)
            .HasForeignKey(e => e.TherapistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Service)
            .WithMany(s => s.Appointments)
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Status)
            .WithMany(s => s.Appointments)
            .HasForeignKey(e => e.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Quadrant)
            .WithMany(q => q.Appointments)
            .HasForeignKey(e => e.QuadrantId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("reviews");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ClientId).HasColumnName("client_id").HasMaxLength(128);
        builder.Property(e => e.ServiceId).HasColumnName("service_id");
        builder.Property(e => e.AppointmentId).HasColumnName("appointment_id");
        builder.Property(e => e.Rating).HasColumnName("rating");
        builder.Property(e => e.ReviewText).HasColumnName("review").IsRequired();
        builder.Property(e => e.IsPublic).HasColumnName("is_public").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");

        builder.HasIndex(e => new { e.IsPublic, e.CreatedAt });
        builder.HasIndex(e => e.ClientId);

        builder.HasOne(e => e.Client)
            .WithMany(c => c.Reviews)
            .HasForeignKey(e => e.ClientId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(e => e.Service)
            .WithMany(s => s.Reviews)
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.Appointment)
            .WithOne(a => a.Review)
            .HasForeignKey<Review>(e => e.AppointmentId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}

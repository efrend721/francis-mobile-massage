using FormWellness.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FormWellness.Infrastructure.Data.Configurations;

public class CatalogConfigurations :
    IEntityTypeConfiguration<Role>,
    IEntityTypeConfiguration<CalgaryQuadrant>,
    IEntityTypeConfiguration<PressureLevel>,
    IEntityTypeConfiguration<AromatherapyOption>,
    IEntityTypeConfiguration<FocusArea>,
    IEntityTypeConfiguration<Service>,
    IEntityTypeConfiguration<AppointmentStatus>,
    IEntityTypeConfiguration<ContactType>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<CalgaryQuadrant> builder)
    {
        builder.ToTable("calgary_quadrants");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(20).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<PressureLevel> builder)
    {
        builder.ToTable("pressure_levels");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<AromatherapyOption> builder)
    {
        builder.ToTable("aromatherapy_options");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.ExtraCharge).HasColumnName("extra_charge").HasPrecision(10, 2).HasDefaultValue(0.00m);
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<FocusArea> builder)
    {
        builder.ToTable("focus_areas");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable("services");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(80).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Title).HasColumnName("title").HasMaxLength(150).IsRequired();
        builder.Property(e => e.Tagline).HasColumnName("tagline").HasMaxLength(255);
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.AvailableDurationsMin).HasColumnName("available_durations_min");
        builder.Property(e => e.BasePrice).HasColumnName("base_price").HasPrecision(10, 2);
        builder.Property(e => e.Badge).HasColumnName("badge").HasMaxLength(50);
        builder.Property(e => e.Icon).HasColumnName("icon").HasMaxLength(50);
        builder.Property(e => e.ImageUrl).HasColumnName("image_url");
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<AppointmentStatus> builder)
    {
        builder.ToTable("appointment_statuses");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.ColorHex).HasColumnName("color_hex").HasMaxLength(20);
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }

    public void Configure(EntityTypeBuilder<ContactType> builder)
    {
        builder.ToTable("contact_types");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Code).IsUnique();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Icon).HasColumnName("icon").HasMaxLength(50);
        builder.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FormWellness.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "appointment_statuses",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    color_hex = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointment_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "aromatherapy_options",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    extra_charge = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_aromatherapy_options", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "calgary_quadrants",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_calgary_quadrants", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "contact_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contact_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "focus_areas",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_focus_areas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pressure_levels",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pressure_levels", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    tagline = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    available_durations_min = table.Column<int[]>(type: "integer[]", nullable: false),
                    base_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    badge = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    image_url = table.Column<string>(type: "text", nullable: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    default_quadrant_id = table.Column<int>(type: "integer", nullable: true),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    picture = table.Column<string>(type: "text", nullable: true),
                    default_address = table.Column<string>(type: "text", nullable: true),
                    default_postal_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    is_google_user = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    private_notes = table.Column<string>(type: "text", nullable: true),
                    accepts_promos = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.id);
                    table.ForeignKey(
                        name: "FK_clients_calgary_quadrants_default_quadrant_id",
                        column: x => x.default_quadrant_id,
                        principalTable: "calgary_quadrants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    picture = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    last_login_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "client_intake_forms",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    pressure_level_id = table.Column<int>(type: "integer", nullable: false),
                    aromatherapy_id = table.Column<int>(type: "integer", nullable: false),
                    is_first_visit = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    has_high_blood_pressure = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_pregnant = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    pregnancy_weeks = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    has_recent_surgeries_or_injuries = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    surgeries_details = table.Column<string>(type: "text", nullable: true),
                    has_allergies_to_oils_or_nuts = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    allergies_details = table.Column<string>(type: "text", nullable: true),
                    other_health_notes = table.Column<string>(type: "text", nullable: true),
                    pipa_consent_accepted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    cancellation_policy_accepted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    signature_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    is_latest = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_intake_forms", x => x.id);
                    table.ForeignKey(
                        name: "FK_client_intake_forms_aromatherapy_options_aromatherapy_id",
                        column: x => x.aromatherapy_id,
                        principalTable: "aromatherapy_options",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_client_intake_forms_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_client_intake_forms_pressure_levels_pressure_level_id",
                        column: x => x.pressure_level_id,
                        principalTable: "pressure_levels",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "appointments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    therapist_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    service_id = table.Column<int>(type: "integer", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    quadrant_id = table.Column<int>(type: "integer", nullable: false),
                    duration_minutes = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    scheduled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    buffer_minutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 30),
                    service_address = table.Column<string>(type: "text", nullable: false),
                    postal_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    client_special_notes = table.Column<string>(type: "text", nullable: true),
                    therapist_clinical_notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointments", x => x.id);
                    table.ForeignKey(
                        name: "FK_appointments_appointment_statuses_status_id",
                        column: x => x.status_id,
                        principalTable: "appointment_statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_calgary_quadrants_quadrant_id",
                        column: x => x.quadrant_id,
                        principalTable: "calgary_quadrants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_appointments_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_users_therapist_id",
                        column: x => x.therapist_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "client_follow_ups",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    user_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    contact_type_id = table.Column<int>(type: "integer", nullable: false),
                    promo_offered = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    outcome_notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_follow_ups", x => x.id);
                    table.ForeignKey(
                        name: "FK_client_follow_ups_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_client_follow_ups_contact_types_contact_type_id",
                        column: x => x.contact_type_id,
                        principalTable: "contact_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_client_follow_ups_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "schedule_blackouts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    start_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_all_day = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    reason = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schedule_blackouts", x => x.id);
                    table.ForeignKey(
                        name: "FK_schedule_blackouts_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "working_schedules",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    day_of_week = table.Column<int>(type: "integer", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    slot_interval_minutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 30),
                    buffer_minutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 30),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_working_schedules", x => x.id);
                    table.ForeignKey(
                        name: "FK_working_schedules_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "intake_form_focus_areas",
                columns: table => new
                {
                    intake_form_id = table.Column<Guid>(type: "uuid", nullable: false),
                    focus_area_id = table.Column<int>(type: "integer", nullable: false),
                    pain_level = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_intake_form_focus_areas", x => new { x.intake_form_id, x.focus_area_id });
                    table.ForeignKey(
                        name: "FK_intake_form_focus_areas_client_intake_forms_intake_form_id",
                        column: x => x.intake_form_id,
                        principalTable: "client_intake_forms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_intake_form_focus_areas_focus_areas_focus_area_id",
                        column: x => x.focus_area_id,
                        principalTable: "focus_areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    service_id = table.Column<int>(type: "integer", nullable: true),
                    appointment_id = table.Column<Guid>(type: "uuid", nullable: true),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    review = table.Column<string>(type: "text", nullable: false),
                    is_public = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.id);
                    table.ForeignKey(
                        name: "FK_reviews_appointments_appointment_id",
                        column: x => x.appointment_id,
                        principalTable: "appointments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_reviews_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reviews_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_statuses_code",
                table: "appointment_statuses",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_client_id",
                table: "appointments",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_quadrant_id",
                table: "appointments",
                column: "quadrant_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_scheduled_at",
                table: "appointments",
                column: "scheduled_at");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_service_id",
                table: "appointments",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_status_id",
                table: "appointments",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_therapist_id",
                table: "appointments",
                column: "therapist_id");

            migrationBuilder.CreateIndex(
                name: "IX_aromatherapy_options_code",
                table: "aromatherapy_options",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_calgary_quadrants_code",
                table: "calgary_quadrants",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_client_follow_ups_client_id",
                table: "client_follow_ups",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_client_follow_ups_contact_type_id",
                table: "client_follow_ups",
                column: "contact_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_client_follow_ups_user_id",
                table: "client_follow_ups",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_client_intake_forms_aromatherapy_id",
                table: "client_intake_forms",
                column: "aromatherapy_id");

            migrationBuilder.CreateIndex(
                name: "IX_client_intake_forms_client_id",
                table: "client_intake_forms",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_client_intake_forms_pressure_level_id",
                table: "client_intake_forms",
                column: "pressure_level_id");

            migrationBuilder.CreateIndex(
                name: "IX_clients_default_quadrant_id",
                table: "clients",
                column: "default_quadrant_id");

            migrationBuilder.CreateIndex(
                name: "IX_clients_email",
                table: "clients",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_contact_types_code",
                table: "contact_types",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_focus_areas_code",
                table: "focus_areas",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_intake_form_focus_areas_focus_area_id",
                table: "intake_form_focus_areas",
                column: "focus_area_id");

            migrationBuilder.CreateIndex(
                name: "IX_pressure_levels_code",
                table: "pressure_levels",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_appointment_id",
                table: "reviews",
                column: "appointment_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_client_id",
                table: "reviews",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_is_public_created_at",
                table: "reviews",
                columns: new[] { "is_public", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_reviews_service_id",
                table: "reviews",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_roles_code",
                table: "roles",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_schedule_blackouts_user_id_start_time_end_time",
                table: "schedule_blackouts",
                columns: new[] { "user_id", "start_time", "end_time" });

            migrationBuilder.CreateIndex(
                name: "IX_services_code",
                table: "services",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_role_id",
                table: "users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_working_schedules_user_id_day_of_week",
                table: "working_schedules",
                columns: new[] { "user_id", "day_of_week" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "client_follow_ups");

            migrationBuilder.DropTable(
                name: "intake_form_focus_areas");

            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "schedule_blackouts");

            migrationBuilder.DropTable(
                name: "working_schedules");

            migrationBuilder.DropTable(
                name: "contact_types");

            migrationBuilder.DropTable(
                name: "client_intake_forms");

            migrationBuilder.DropTable(
                name: "focus_areas");

            migrationBuilder.DropTable(
                name: "appointments");

            migrationBuilder.DropTable(
                name: "aromatherapy_options");

            migrationBuilder.DropTable(
                name: "pressure_levels");

            migrationBuilder.DropTable(
                name: "appointment_statuses");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "services");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "calgary_quadrants");

            migrationBuilder.DropTable(
                name: "roles");
        }
    }
}

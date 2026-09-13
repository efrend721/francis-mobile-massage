using FormWellness.Domain.Entities;
using FormWellness.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FormWellness.Infrastructure.Data.Seeders;

public static class DbInitializer
{
    public static async Task SeedAsync(FormWellnessDbContext db, ILogger logger)
    {
        try
        {
            await db.Database.EnsureCreatedAsync();

            // 1. Roles
            if (!await db.Roles.AnyAsync())
            {
                db.Roles.AddRange(
                    new Role { Code = "ADMIN", Name = "Administrator", Description = "Francis - Full system ownership, clients, CRM, schedules, and configurations" },
                    new Role { Code = "THERAPIST", Name = "Registered Massage Therapist (RMT)", Description = "Access to assigned appointments, addresses, and clinical notes" },
                    new Role { Code = "STAFF", Name = "Receptionist / Assistant", Description = "Basic booking management and client inquiries" }
                );
                await db.SaveChangesAsync();
            }

            // 2. Calgary Quadrants
            if (!await db.CalgaryQuadrants.AnyAsync())
            {
                db.CalgaryQuadrants.AddRange(
                    new CalgaryQuadrant { Code = "NW", Name = "Northwest (NW)", DisplayOrder = 1 },
                    new CalgaryQuadrant { Code = "SW", Name = "Southwest (SW)", DisplayOrder = 2 },
                    new CalgaryQuadrant { Code = "SE", Name = "Southeast (SE)", DisplayOrder = 3 },
                    new CalgaryQuadrant { Code = "NE", Name = "Northeast (NE)", DisplayOrder = 4 },
                    new CalgaryQuadrant { Code = "DOWNTOWN", Name = "Downtown / Beltline", DisplayOrder = 5 },
                    new CalgaryQuadrant { Code = "SURROUNDING", Name = "Surrounding Calgary Area", DisplayOrder = 6 }
                );
                await db.SaveChangesAsync();
            }

            // 3. Pressure Levels
            if (!await db.PressureLevels.AnyAsync())
            {
                db.PressureLevels.AddRange(
                    new PressureLevel { Code = "LIGHT", Name = "Light & Gentle", Description = "Gentle, soothing touch for surface relaxation and stress relief", DisplayOrder = 1 },
                    new PressureLevel { Code = "MEDIUM", Name = "Medium (Balanced)", Description = "Harmonious balance between muscular relief and relaxation", DisplayOrder = 2 },
                    new PressureLevel { Code = "FIRM", Name = "Firm (Therapeutic)", Description = "Firm, targeted pressure designed to release stubborn tension knots", DisplayOrder = 3 },
                    new PressureLevel { Code = "DEEP_TISSUE", Name = "Deep Tissue (Intense)", Description = "Deep, sustained pressure on inner muscle layers and connective fascia", DisplayOrder = 4 }
                );
                await db.SaveChangesAsync();
            }

            // 4. Aromatherapy Options
            if (!await db.AromatherapyOptions.AnyAsync())
            {
                db.AromatherapyOptions.AddRange(
                    new AromatherapyOption { Code = "UNSCENTED", Name = "Unscented (Fragrance-Free)", Description = "Pure organic hypoallergenic carrier oil without fragrances", ExtraCharge = 0.00m, DisplayOrder = 1 },
                    new AromatherapyOption { Code = "EUCALYPTUS", Name = "Nordic Eucalyptus & Pine", Description = "Clears respiratory airways, refreshes and revitalizes energy", ExtraCharge = 0.00m, DisplayOrder = 2 },
                    new AromatherapyOption { Code = "LAVENDER", Name = "French Lavender Serenity", Description = "Promotes deep nervous system relaxation and restorative sleep", ExtraCharge = 0.00m, DisplayOrder = 3 },
                    new AromatherapyOption { Code = "PEPPERMINT", Name = "Reviving Peppermint", Description = "Relieves tension headaches and stimulates muscular recovery", ExtraCharge = 0.00m, DisplayOrder = 4 },
                    new AromatherapyOption { Code = "SWEET_ORANGE", Name = "Calgary Sunshine Sweet Orange", Description = "Elevates mood and dissolves daily emotional stress", ExtraCharge = 0.00m, DisplayOrder = 5 }
                );
                await db.SaveChangesAsync();
            }

            // 5. Focus Areas
            if (!await db.FocusAreas.AnyAsync())
            {
                db.FocusAreas.AddRange(
                    new FocusArea { Code = "NECK", Name = "Neck & Cervical", Description = "Cervical tension and cranial base tightness", DisplayOrder = 1 },
                    new FocusArea { Code = "SHOULDERS", Name = "Shoulders & Trapezius", Description = "Postural fatigue, trapezius knots and desk strain", DisplayOrder = 2 },
                    new FocusArea { Code = "UPPER_BACK", Name = "Upper & Mid Back", Description = "Rhomboids, thoracic spine and shoulder blades", DisplayOrder = 3 },
                    new FocusArea { Code = "LOWER_BACK", Name = "Lower Back (Lumbar)", Description = "Lumbar pain, sciatic nerve relief and stiffness", DisplayOrder = 4 },
                    new FocusArea { Code = "ARMS_HANDS", Name = "Arms & Hands", Description = "Keyboard repetitive strain and forearm tightness", DisplayOrder = 5 },
                    new FocusArea { Code = "HIPS_GLUTES", Name = "Hips & Glutes", Description = "Pelvic imbalance and sitting-induced tightness", DisplayOrder = 6 },
                    new FocusArea { Code = "LEGS_FEET", Name = "Legs, Calves & Feet", Description = "Tired legs, calf cramps and plantar fascia", DisplayOrder = 7 },
                    new FocusArea { Code = "FULL_BODY", Name = "Full Body Relaxation", Description = "Comprehensive, holistic body-wide relaxation", DisplayOrder = 8 }
                );
                await db.SaveChangesAsync();
            }

            // 6. Services
            if (!await db.Services.AnyAsync())
            {
                db.Services.AddRange(
                    new Service
                    {
                        Code = "THERAPEUTIC_SWEDISH",
                        Title = "Therapeutic Swedish & Relaxation",
                        Tagline = "Restorative, flowing pressure designed to melt away daily stress.",
                        Description = "A gentle to medium-pressure therapeutic treatment utilizing long, rhythmic strokes to enhance circulation, reduce muscle tension, and calm the central nervous system.",
                        AvailableDurationsMin = [60, 90, 120],
                        BasePrice = 110.00m,
                        Badge = "Most Popular",
                        Icon = "Heart",
                        ImageUrl = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2400&q=85",
                        DisplayOrder = 1
                    },
                    new Service
                    {
                        Code = "DEEP_TISSUE",
                        Title = "Deep Tissue & Therapeutic Massage",
                        Tagline = "Targeted relief for persistent tightness, knots, and chronic pain.",
                        Description = "Focused firm pressure aimed at deeper muscle layers and connective tissues. Ideal for relieving neck stiffness, lower back pain, and posture fatigue from work or sports.",
                        AvailableDurationsMin = [60, 90, 120],
                        BasePrice = 125.00m,
                        Badge = "Therapeutic Focus",
                        Icon = "Activity",
                        ImageUrl = "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=2400&q=85",
                        DisplayOrder = 2
                    },
                    new Service
                    {
                        Code = "HOT_STONE",
                        Title = "Hot Stone Therapy",
                        Tagline = "Deep thermal relaxation with natural volcanic basalt stones.",
                        Description = "Heated smooth volcanic basalt stones massaged over tight muscles, melting away deep-seated tension, boosting circulation, and promoting total tranquility.",
                        AvailableDurationsMin = [75, 90],
                        BasePrice = 140.00m,
                        Badge = "Deep Thermal Warmth",
                        Icon = "Flame",
                        ImageUrl = "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=2400&q=85",
                        DisplayOrder = 3
                    },
                    new Service
                    {
                        Code = "PRENATAL",
                        Title = "Prenatal Massage (Expecting Mothers)",
                        Tagline = "Nurturing, safe care designed specifically for mothers-to-be.",
                        Description = "Gentle and supportive techniques using specialized ergonomic positioning to ease lower back strain, reduce leg swelling, and promote restful sleep throughout pregnancy.",
                        AvailableDurationsMin = [60, 75],
                        BasePrice = 120.00m,
                        Badge = "Maternity Care",
                        Icon = "Baby",
                        ImageUrl = "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=2400&q=85",
                        DisplayOrder = 4
                    },
                    new Service
                    {
                        Code = "AROMATHERAPY",
                        Title = "Aromatherapy Botanical Experience",
                        Tagline = "Custom organic essential oil blends for sensory tranquility.",
                        Description = "Combines restorative massage with therapeutic-grade botanical essential oils to harmonize the senses, release nervous tension, and restore inner vitality.",
                        AvailableDurationsMin = [60, 90],
                        BasePrice = 125.00m,
                        Badge = "Botanical Essence",
                        Icon = "Leaf",
                        ImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=85",
                        DisplayOrder = 5
                    },
                    new Service
                    {
                        Code = "TRIGGER_POINT",
                        Title = "Trigger Point & Sports Recovery",
                        Tagline = "Targeted myofascial release for athletes and active lifestyles.",
                        Description = "Focused pressure on neuromuscular trigger points to dissolve stubborn referral pain, restore range of motion, and accelerate post-workout muscular recovery.",
                        AvailableDurationsMin = [60, 90],
                        BasePrice = 130.00m,
                        Badge = "Performance & Rehab",
                        Icon = "Zap",
                        ImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2400&q=85",
                        DisplayOrder = 6
                    }
                );
                await db.SaveChangesAsync();
            }

            // 7. Appointment Statuses
            if (!await db.AppointmentStatuses.AnyAsync())
            {
                db.AppointmentStatuses.AddRange(
                    new AppointmentStatus { Code = "PENDING", Name = "Pending Confirmation", ColorHex = "#C7B198", Description = "Newly booked by client, awaiting therapist confirmation", DisplayOrder = 1 },
                    new AppointmentStatus { Code = "CONFIRMED", Name = "Confirmed", ColorHex = "#5A7B6E", Description = "Confirmed on Francis calendar and scheduled", DisplayOrder = 2 },
                    new AppointmentStatus { Code = "EN_ROUTE", Name = "En Route to Home", ColorHex = "#4F6D7A", Description = "Therapist is driving to the clients home", DisplayOrder = 3 },
                    new AppointmentStatus { Code = "COMPLETED", Name = "Completed", ColorHex = "#3F594F", Description = "Session completed successfully", DisplayOrder = 4 },
                    new AppointmentStatus { Code = "CANCELLED", Name = "Cancelled", ColorHex = "#A84B4B", Description = "Cancelled by client or therapist", DisplayOrder = 5 }
                );
                await db.SaveChangesAsync();
            }

            // 8. Contact Types
            if (!await db.ContactTypes.AnyAsync())
            {
                db.ContactTypes.AddRange(
                    new ContactType { Code = "PHONE_CALL", Name = "Phone Call", Icon = "Phone" },
                    new ContactType { Code = "WHATSAPP", Name = "WhatsApp Message", Icon = "MessageSquare" },
                    new ContactType { Code = "EMAIL_PROMO", Name = "Email Campaign", Icon = "Mail" },
                    new ContactType { Code = "IN_PERSON", Name = "In-Person Conversation", Icon = "UserCheck" }
                );
                await db.SaveChangesAsync();
            }

            // 9. Default Therapist (Francis) and working schedule
            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.Code == "ADMIN");
            if (adminRole != null && !await db.Users.AnyAsync(u => u.RoleId == adminRole.Id))
            {
                var therapist = new User
                {
                    Id = "francis-rmt-admin",
                    Name = "Francis (RMT)",
                    Email = "francis.wellness@gmail.com",
                    RoleId = adminRole.Id,
                    Phone = "(403) 555-0199",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                db.Users.Add(therapist);
                await db.SaveChangesAsync();

                // Add default working schedule for Francis (Mon - Sat: 9:00 AM - 8:00 PM)
                for (int day = 1; day <= 6; day++)
                {
                    db.WorkingSchedules.Add(new WorkingSchedule
                    {
                        UserId = therapist.Id,
                        DayOfWeek = day,
                        StartTime = new TimeOnly(9, 0),
                        EndTime = new TimeOnly(20, 0),
                        SlotIntervalMinutes = 30,
                        BufferMinutes = 30,
                        IsActive = true
                    });
                }
                await db.SaveChangesAsync();
            }

            logger.LogInformation("Database Seed Completed Successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while seeding database");
        }
    }
}

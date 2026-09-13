using FormWellness.Application.Common.Exceptions;
using FormWellness.Application.DTOs;
using FormWellness.Application.Interfaces;
using FormWellness.Application.Services.Interfaces;
using FormWellness.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FormWellness.Application.Services.Implementations;

public class IntakeService : IIntakeService
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public IntakeService(IApplicationDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<IntakeFormDto> SaveIntakeFormAsync(SaveIntakeFormRequest request, CancellationToken ct = default)
    {
        string clientId;
        Client client;

        if (_currentUser.IsAuthenticated && !string.IsNullOrEmpty(_currentUser.UserId) && _currentUser.IsClient)
        {
            clientId = _currentUser.UserId;
            client = await _db.Clients.FindAsync(new object[] { clientId }, ct)
                ?? throw new NotFoundException("Client", clientId);
        }
        else
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.FullName))
                throw new BadRequestException("Full name and email are required");

            var existing = await _db.Clients.FirstOrDefaultAsync(c => c.Email.ToLower() == request.Email.ToLower(), ct);
            if (existing != null)
            {
                client = existing;
                clientId = existing.Id;
            }
            else
            {
                clientId = Guid.NewGuid().ToString();
                client = new Client
                {
                    Id = clientId,
                    Name = request.FullName,
                    Email = request.Email,
                    Phone = request.Phone,
                    IsGoogleUser = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Clients.Add(client);
            }
        }

        var existingForms = await _db.ClientIntakeForms.Where(f => f.ClientId == clientId && f.IsLatest).ToListAsync(ct);
        foreach (var f in existingForms)
        {
            f.IsLatest = false;
        }

        var intakeForm = new ClientIntakeForm
        {
            Id = Guid.NewGuid(),
            ClientId = clientId,
            PressureLevelId = request.PressureLevelId,
            AromatherapyId = request.AromatherapyId,
            IsFirstVisit = request.IsFirstVisit,
            HasHighBloodPressure = request.HasHighBloodPressure,
            IsPregnant = request.IsPregnant,
            PregnancyWeeks = request.PregnancyWeeks,
            HasRecentSurgeriesOrInjuries = request.HasRecentSurgeriesOrInjuries,
            SurgeriesDetails = request.SurgeriesDetails,
            HasAllergiesToOilsOrNuts = request.HasAllergiesToOilsOrNuts,
            AllergiesDetails = request.AllergiesDetails,
            OtherHealthNotes = request.OtherHealthNotes,
            PipaConsentAccepted = request.PipaConsentAccepted,
            CancellationPolicyAccepted = request.CancellationPolicyAccepted,
            SignatureName = request.SignatureName,
            IsLatest = true,
            CompletedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (request.FocusAreas != null && request.FocusAreas.Count > 0)
        {
            foreach (var fa in request.FocusAreas)
            {
                intakeForm.IntakeFormFocusAreas.Add(new IntakeFormFocusArea
                {
                    IntakeFormId = intakeForm.Id,
                    FocusAreaId = fa.FocusAreaId,
                    PainLevel = fa.PainLevel,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        _db.ClientIntakeForms.Add(intakeForm);
        await _db.SaveChangesAsync(ct);

        var pressure = await _db.PressureLevels.FindAsync(new object[] { intakeForm.PressureLevelId }, ct);
        var aroma = await _db.AromatherapyOptions.FindAsync(new object[] { intakeForm.AromatherapyId }, ct);

        return new IntakeFormDto
        {
            Id = intakeForm.Id,
            ClientId = client.Id,
            ClientName = client.Name,
            PressureLevelId = intakeForm.PressureLevelId,
            PressureLevelName = pressure?.Name ?? "",
            AromatherapyId = intakeForm.AromatherapyId,
            AromatherapyName = aroma?.Name ?? "",
            IsFirstVisit = intakeForm.IsFirstVisit,
            HasHighBloodPressure = intakeForm.HasHighBloodPressure,
            IsPregnant = intakeForm.IsPregnant,
            PregnancyWeeks = intakeForm.PregnancyWeeks,
            HasRecentSurgeriesOrInjuries = intakeForm.HasRecentSurgeriesOrInjuries,
            SurgeriesDetails = intakeForm.SurgeriesDetails,
            HasAllergiesToOilsOrNuts = intakeForm.HasAllergiesToOilsOrNuts,
            AllergiesDetails = intakeForm.AllergiesDetails,
            OtherHealthNotes = intakeForm.OtherHealthNotes,
            PipaConsentAccepted = intakeForm.PipaConsentAccepted,
            CancellationPolicyAccepted = intakeForm.CancellationPolicyAccepted,
            SignatureName = intakeForm.SignatureName,
            CompletedAt = intakeForm.CompletedAt,
            FocusAreas = intakeForm.IntakeFormFocusAreas.Select(fa => new IntakeFocusAreaDto
            {
                FocusAreaId = fa.FocusAreaId,
                PainLevel = fa.PainLevel
            }).ToList()
        };
    }

    public async Task<IntakeFormDto?> GetMyLatestIntakeFormAsync(CancellationToken ct = default)
    {
        if (!_currentUser.IsAuthenticated || string.IsNullOrEmpty(_currentUser.UserId))
            throw new UnauthorizedException();

        var form = await _db.ClientIntakeForms
            .Include(f => f.Client)
            .Include(f => f.PressureLevel)
            .Include(f => f.AromatherapyOption)
            .Include(f => f.IntakeFormFocusAreas)
                .ThenInclude(fa => fa.FocusArea)
            .FirstOrDefaultAsync(f => f.ClientId == _currentUser.UserId && f.IsLatest, ct);

        if (form == null) return null;

        return new IntakeFormDto
        {
            Id = form.Id,
            ClientId = form.ClientId,
            ClientName = form.Client.Name,
            PressureLevelId = form.PressureLevelId,
            PressureLevelName = form.PressureLevel.Name,
            AromatherapyId = form.AromatherapyId,
            AromatherapyName = form.AromatherapyOption.Name,
            IsFirstVisit = form.IsFirstVisit,
            HasHighBloodPressure = form.HasHighBloodPressure,
            IsPregnant = form.IsPregnant,
            PregnancyWeeks = form.PregnancyWeeks,
            HasRecentSurgeriesOrInjuries = form.HasRecentSurgeriesOrInjuries,
            SurgeriesDetails = form.SurgeriesDetails,
            HasAllergiesToOilsOrNuts = form.HasAllergiesToOilsOrNuts,
            AllergiesDetails = form.AllergiesDetails,
            OtherHealthNotes = form.OtherHealthNotes,
            PipaConsentAccepted = form.PipaConsentAccepted,
            CancellationPolicyAccepted = form.CancellationPolicyAccepted,
            SignatureName = form.SignatureName,
            CompletedAt = form.CompletedAt,
            FocusAreas = form.IntakeFormFocusAreas.Select(fa => new IntakeFocusAreaDto
            {
                FocusAreaId = fa.FocusAreaId,
                FocusAreaCode = fa.FocusArea.Code,
                FocusAreaName = fa.FocusArea.Name,
                PainLevel = fa.PainLevel
            }).ToList()
        };
    }
}

using FormWellness.Application.DTOs;
using FormWellness.Application.Interfaces;
using FormWellness.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FormWellness.Application.Services.Implementations;

public class CatalogService : ICatalogService
{
    private readonly IApplicationDbContext _db;
    public CatalogService(IApplicationDbContext db) { _db = db; }

    public async Task<AllCatalogsDto> GetAllCatalogsAsync(CancellationToken ct = default)
    {
        var quadrants = await _db.CalgaryQuadrants
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new CalgaryQuadrantDto { Id = x.Id, Code = x.Code, Name = x.Name, DisplayOrder = x.DisplayOrder })
            .ToListAsync(ct);

        var pressureLevels = await _db.PressureLevels
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new PressureLevelDto { Id = x.Id, Code = x.Code, Name = x.Name, Description = x.Description, DisplayOrder = x.DisplayOrder })
            .ToListAsync(ct);

        var aromatherapy = await _db.AromatherapyOptions
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new AromatherapyOptionDto { Id = x.Id, Code = x.Code, Name = x.Name, Description = x.Description, ExtraCharge = x.ExtraCharge, DisplayOrder = x.DisplayOrder })
            .ToListAsync(ct);

        var focusAreas = await _db.FocusAreas
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new FocusAreaDto { Id = x.Id, Code = x.Code, Name = x.Name, Description = x.Description, DisplayOrder = x.DisplayOrder })
            .ToListAsync(ct);

        var services = await _db.Services
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new ServiceDto
            {
                Id = x.Id,
                Code = x.Code,
                Title = x.Title,
                Tagline = x.Tagline,
                Description = x.Description,
                AvailableDurationsMin = x.AvailableDurationsMin,
                BasePrice = x.BasePrice,
                Badge = x.Badge,
                Icon = x.Icon,
                ImageUrl = x.ImageUrl,
                DisplayOrder = x.DisplayOrder
            })
            .ToListAsync(ct);

        var statuses = await _db.AppointmentStatuses
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new AppointmentStatusDto { Id = x.Id, Code = x.Code, Name = x.Name, ColorHex = x.ColorHex, Description = x.Description })
            .ToListAsync(ct);

        return new AllCatalogsDto
        {
            Quadrants = quadrants,
            PressureLevels = pressureLevels,
            AromatherapyOptions = aromatherapy,
            FocusAreas = focusAreas,
            Services = services,
            Statuses = statuses
        };
    }

    public async Task<List<ServiceDto>> GetServicesAsync(CancellationToken ct = default)
    {
        return await _db.Services
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new ServiceDto
            {
                Id = x.Id,
                Code = x.Code,
                Title = x.Title,
                Tagline = x.Tagline,
                Description = x.Description,
                AvailableDurationsMin = x.AvailableDurationsMin,
                BasePrice = x.BasePrice,
                Badge = x.Badge,
                Icon = x.Icon,
                ImageUrl = x.ImageUrl,
                DisplayOrder = x.DisplayOrder
            })
            .ToListAsync(ct);
    }

    public async Task<List<CalgaryQuadrantDto>> GetQuadrantsAsync(CancellationToken ct = default)
    {
        return await _db.CalgaryQuadrants
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new CalgaryQuadrantDto { Id = x.Id, Code = x.Code, Name = x.Name, DisplayOrder = x.DisplayOrder })
            .ToListAsync(ct);
    }
}

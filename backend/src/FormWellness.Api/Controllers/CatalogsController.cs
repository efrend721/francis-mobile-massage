using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

public class CatalogsController(ICatalogService catalogService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<AllCatalogsDto>>> GetAllCatalogs(CancellationToken ct)
    {
        var result = await catalogService.GetAllCatalogsAsync(ct);
        return Success(result);
    }

    [HttpGet("services")]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetServices(CancellationToken ct)
    {
        var result = await catalogService.GetServicesAsync(ct);
        return Success(result);
    }

    [HttpGet("quadrants")]
    public async Task<ActionResult<ApiResponse<List<CalgaryQuadrantDto>>>> GetQuadrants(CancellationToken ct)
    {
        var result = await catalogService.GetQuadrantsAsync(ct);
        return Success(result);
    }
}

using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

[Route("api/[controller]")]
public class ServicesController : BaseApiController
{
    private readonly ICatalogService _catalogService;

    public ServicesController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    /// <summary>
    /// Retrieves all active massage services from the database.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetAllServices(CancellationToken ct)
    {
        var result = await _catalogService.GetServicesAsync(ct);
        return Success(result);
    }
}

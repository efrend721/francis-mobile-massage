using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

[Route("api/[controller]")]
public class ServicesController(ICatalogService catalogService) : BaseApiController
{
    /// <summary>
    /// Retrieves all active massage services from the database.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetAllServices(CancellationToken ct)
    {
        var result = await catalogService.GetServicesAsync(ct);
        return Success(result);
    }
}

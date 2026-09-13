using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

public class IntakeFormsController : BaseApiController
{
    private readonly IIntakeService _intakeService;

    public IntakeFormsController(IIntakeService intakeService)
    {
        _intakeService = intakeService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<IntakeFormDto>>> SaveIntakeForm([FromBody] SaveIntakeFormRequest request, CancellationToken ct)
    {
        var result = await _intakeService.SaveIntakeFormAsync(request, ct);
        return Success(result, "Clinical intake form submitted successfully");
    }

    [Authorize]
    [HttpGet("my-intake")]
    public async Task<ActionResult<ApiResponse<IntakeFormDto?>>> GetMyLatestIntake(CancellationToken ct)
    {
        var result = await _intakeService.GetMyLatestIntakeFormAsync(ct);
        return Success(result);
    }
}

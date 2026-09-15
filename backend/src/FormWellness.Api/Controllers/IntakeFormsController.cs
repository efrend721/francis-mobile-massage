using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

public class IntakeFormsController(IIntakeService intakeService) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<IntakeFormDto>>> SaveIntakeForm([FromBody] SaveIntakeFormRequest request, CancellationToken ct)
    {
        var result = await intakeService.SaveIntakeFormAsync(request, ct);
        return Success(result, "Clinical intake form submitted successfully");
    }

    [Authorize]
    [HttpGet("my-intake")]
    public async Task<ActionResult<ApiResponse<IntakeFormDto?>>> GetMyLatestIntake(CancellationToken ct)
    {
        var result = await intakeService.GetMyLatestIntakeFormAsync(ct);
        return Success(result);
    }
}

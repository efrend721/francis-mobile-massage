using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

[Authorize(Roles = "ADMIN,THERAPIST,STAFF")]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("calendar")]
    public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetCalendar([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var fromUtc = from?.ToUniversalTime() ?? DateTime.UtcNow.Date.AddDays(-7);
        var toUtc = to?.ToUniversalTime() ?? DateTime.UtcNow.Date.AddDays(30);

        var result = await _adminService.GetCalendarAppointmentsAsync(fromUtc, toUtc, ct);
        return Success(result);
    }

    [HttpPut("appointments/{id:guid}/status")]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateStatus(Guid id, [FromBody] UpdateAppointmentStatusRequest request, CancellationToken ct)
    {
        var result = await _adminService.UpdateAppointmentStatusAsync(id, request.StatusCode, ct);
        return Success(result, "Status updated");
    }

    [HttpPut("appointments/{id:guid}/clinical-notes")]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateClinicalNotes(Guid id, [FromBody] UpdateClinicalNotesRequest request, CancellationToken ct)
    {
        var result = await _adminService.UpdateClinicalNotesAsync(id, request.ClinicalNotes, ct);
        return Success(result, "Clinical notes saved");
    }

    [HttpGet("working-schedules")]
    public async Task<ActionResult<ApiResponse<List<WorkingScheduleDto>>>> GetWorkingSchedules(CancellationToken ct)
    {
        var result = await _adminService.GetWorkingSchedulesAsync(ct);
        return Success(result);
    }

    [HttpPut("working-schedules")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateWorkingSchedules([FromBody] UpdateWorkingScheduleRequest request, CancellationToken ct)
    {
        await _adminService.UpdateWorkingSchedulesAsync(request, ct);
        return Success("Schedules updated successfully");
    }

    [HttpGet("blackouts")]
    public async Task<ActionResult<ApiResponse<List<ScheduleBlackoutDto>>>> GetBlackouts([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var fromUtc = from?.ToUniversalTime() ?? DateTime.UtcNow.Date;
        var toUtc = to?.ToUniversalTime() ?? DateTime.UtcNow.Date.AddMonths(2);

        var result = await _adminService.GetBlackoutsAsync(fromUtc, toUtc, ct);
        return Success(result);
    }

    [HttpPost("blackouts")]
    public async Task<ActionResult<ApiResponse<ScheduleBlackoutDto>>> CreateBlackout([FromBody] CreateScheduleBlackoutRequest request, CancellationToken ct)
    {
        var result = await _adminService.CreateBlackoutAsync(request, ct);
        return Success(result, "Blackout period created");
    }

    [HttpDelete("blackouts/{id:guid}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteBlackout(Guid id, CancellationToken ct)
    {
        await _adminService.DeleteBlackoutAsync(id, ct);
        return Success("Blackout removed successfully");
    }

    [HttpGet("clients/{clientId}/follow-ups")]
    public async Task<ActionResult<ApiResponse<List<ClientFollowUpDto>>>> GetFollowUps(string clientId, CancellationToken ct)
    {
        var result = await _adminService.GetClientFollowUpsAsync(clientId, ct);
        return Success(result);
    }

    [HttpPost("clients/follow-ups")]
    public async Task<ActionResult<ApiResponse<ClientFollowUpDto>>> CreateFollowUp([FromBody] CreateClientFollowUpRequest request, CancellationToken ct)
    {
        var result = await _adminService.CreateClientFollowUpAsync(request, ct);
        return Success(result, "Follow-up record logged");
    }
}

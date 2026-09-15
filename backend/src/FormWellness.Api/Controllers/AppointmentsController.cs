using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

public class AppointmentsController(IAppointmentService appointmentService) : BaseApiController
{
    [HttpGet("availability")]
    public async Task<ActionResult<ApiResponse<DayAvailabilityDto>>> GetAvailability([FromQuery] string date, [FromQuery] int duration = 60, CancellationToken ct = default)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
        {
            parsedDate = DateOnly.FromDateTime(DateTime.UtcNow);
        }

        var query = new AvailabilityQuery { Date = parsedDate, DurationMinutes = duration };
        var result = await appointmentService.GetAvailabilityAsync(query, ct);
        return Success(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> CreateAppointment([FromBody] CreateAppointmentRequest request, CancellationToken ct)
    {
        var result = await appointmentService.CreateAppointmentAsync(request, ct);
        return Success(result, "Appointment booked successfully");
    }

    [Authorize]
    [HttpGet("my-bookings")]
    public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetMyAppointments(CancellationToken ct)
    {
        var result = await appointmentService.GetMyAppointmentsAsync(ct);
        return Success(result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateAppointment(Guid id, [FromBody] UpdateAppointmentRequest request, CancellationToken ct)
    {
        var result = await appointmentService.UpdateAppointmentAsync(id, request, ct);
        return Success(result, "Appointment updated successfully");
    }

    [Authorize]
    [HttpPut("{id:guid}/cancel")]
    public async Task<ActionResult<ApiResponse<AppointmentDto>>> CancelAppointment(Guid id, CancellationToken ct)
    {
        var result = await appointmentService.CancelAppointmentAsync(id, ct);
        return Success(result, "Appointment cancelled successfully");
    }
}

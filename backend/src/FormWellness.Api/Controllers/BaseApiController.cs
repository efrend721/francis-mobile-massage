using FormWellness.Application.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected ActionResult<ApiResponse<T>> Success<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.Ok(data, message));
    }
}

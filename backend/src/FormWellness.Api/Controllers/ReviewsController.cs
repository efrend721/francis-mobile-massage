using FormWellness.Application.Common.Models;
using FormWellness.Application.DTOs;
using FormWellness.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormWellness.Api.Controllers;

public class ReviewsController(IReviewService reviewService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetPublicReviews([FromQuery] int limit = 10, CancellationToken ct = default)
    {
        var result = await reviewService.GetPublicReviewsAsync(limit, ct);
        return Success(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReviewDto>>> CreateReview([FromBody] CreateReviewRequest request, CancellationToken ct)
    {
        var result = await reviewService.CreateReviewAsync(request, ct);
        return Success(result, "Review submitted successfully");
    }
}

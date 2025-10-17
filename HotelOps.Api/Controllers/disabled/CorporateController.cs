using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelOps.Api.Data;
using HotelOps.Api.Contracts;
namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/corporate")]
[Authorize(Policy = "CorporateOnly")]
public class CorporateController : ControllerBase
{
    private readonly AppDb _db;
    public CorporateController(AppDb db) => _db = db;

    // GET /api/corporate/search?checkIn=2025-10-05&checkOut=2025-10-06&adults=1&corporateId=ACME
    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] DateOnly checkIn,
        [FromQuery] DateOnly checkOut,
        [FromQuery] int adults = 1,
        [FromQuery] string? corporateId = null)
    {
        var los = checkOut.DayNumber - checkIn.DayNumber;
        if (los <= 0) return BadRequest("Invalid dates.");

        // Use BAR as the baseline plan
        var plan = await _db.RatePlans.FirstOrDefaultAsync(x => x.Code == "BAR");
        if (plan is null) return Problem("BAR plan missing. Create one in Admin > Rate Plans.");

        // Optional corporate contract
        Contract? contract = null;
        if (!string.IsNullOrWhiteSpace(corporateId))
        {
            contract = await _db.Contracts
                .FirstOrDefaultAsync(c => c.CorporateId == corporateId);
        }

        var roomTypes = await _db.RoomTypes.OrderBy(x => x.Id).ToListAsync();

        var rows = new List<object>();
        foreach (var rt in roomTypes)
        {
            var basePrice  = plan.PriceFor(rt.Code);
            var todayPrice = plan.PriceFor(rt.Code, DateOnly.FromDateTime(DateTime.Today));
            decimal final = basePrice;
            string finalPlan = plan.Code;

            if (contract is not null)
            {
                var key = checkIn.ToString("yyyy-MM-dd");
                var blackouts = (contract.BlackoutCsv ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

                var inRange = checkIn >= contract.ValidFrom && checkIn <= contract.ValidTo;
                var allowed = inRange && !blackouts.Contains(key);

                if (allowed)
                {
                    final = contract.RuleType?.ToLowerInvariant() switch
                    {
                        "fixed" => contract.RuleValue,
                        "percent" or "percentoff" => Math.Round(basePrice * (1 - (contract.RuleValue / 100m))),
                        _ => basePrice
                    };
                   finalPlan = $"CORP-{contract.CorporateId}";
                }
            }

            rows.Add(new
            {
                roomTypeId = rt.Id,
                roomTypeName = rt.Name,
                plan = finalPlan,
                basePrice,
                // simplest (no context)
                finalPrice = plan.PriceFor(),
                currency   = plan.Currency(),
            });
        }

        return Ok(rows);
    }

    public record BookReq(
        string? CorporateId,
        string RoomTypeId,
        string RatePlanCode,
        DateOnly CheckIn,
        DateOnly CheckOut,
        string GuestName,
        string? Phone,
        decimal PricePerNight);

    // POST /api/corporate/book
    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] BookReq req)
    {
        var los = req.CheckOut.DayNumber - req.CheckIn.DayNumber;
        if (los <= 0) return BadRequest("Invalid dates.");

        var total = req.PricePerNight * los;
        var r = new Reservation
        {
            CorporateId = req.CorporateId ?? "",
            RoomTypeId = req.RoomTypeId,
            RatePlanCode = req.RatePlanCode,
            CheckIn = req.CheckIn.ToDateTime(TimeOnly.MinValue),
            CheckOut = req.CheckOut.ToDateTime(TimeOnly.MinValue),
            GuestName = req.GuestName,
            Phone = req.Phone,
            PricePerNight = req.PricePerNight,
            Total = total
        };
        _db.Reservations.Add(r);
        await _db.SaveChangesAsync();
        return Ok(r);
    }

    // GET /api/corporate/bookings?corporateId=ACME
    [HttpGet("bookings")]
    public async Task<IEnumerable<Reservation>> MyBookings([FromQuery] string? corporateId = null)
    {
        var q = _db.Reservations.AsQueryable();
        if (!string.IsNullOrWhiteSpace(corporateId))
            q = q.Where(x => x.CorporateId == corporateId);

        return await q.OrderByDescending(x => x.Id).ToListAsync();
    }
}

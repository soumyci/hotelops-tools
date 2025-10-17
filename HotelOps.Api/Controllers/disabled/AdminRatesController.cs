using HotelOps.Api.Data;               // AppDb
//using HotelOps.Api.Models;  //           // Rat
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using HotelOps.Api.Contracts;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/rates")]
[Authorize(Policy = "AdminOnly")]

public class AdminRatesController : ControllerBase
{
    private readonly AppDb _db;
    public AdminRatesController(AppDb db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RatePlanDto>>> List(
        [FromQuery] DateOnly? from, [FromQuery] DateOnly? to, [FromQuery] string? roomCode)
    {
        var q = _db.Rates.AsQueryable();
        if (!string.IsNullOrWhiteSpace(roomCode)) q = q.Where(r => r.RoomCode == roomCode);
        if (from is { } f) q = q.Where(r => r.Date >= f);
        if (to   is { } t) q = q.Where(r => r.Date <= t);

        var rows = await q.OrderBy(r => r.RoomCode).ThenBy(r => r.Date)
            .Select(r => new RatePlanDto {
                Id = r.Id, TenantId = r.TenantId, RoomCode = r.RoomCode, Date = r.Date, Price = r.Price
            })
            .ToListAsync();

        return Ok(rows);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RatePlanDto>> Get(Guid id)
    {
        var r = await _db.Rates.FindAsync(id);
        return r is null
            ? NotFound()
            : new RatePlanDto { Id = r.Id, TenantId = r.TenantId, RoomCode = r.RoomCode, Date = r.Date, Price = r.Price };
    }

    [HttpPost]
    public async Task<ActionResult<RatePlanDto>> Create([FromBody] RatePlanCreateDto x)
    {
        var e = new Rate {
            TenantId = x.TenantId,      // if you set tenant server-side, replace this later
            RoomCode = x.RoomCode,
            Date = x.Date,
            Price = x.Price
        };
        _db.Rates.Add(e);
        await _db.SaveChangesAsync();

        var dto = new RatePlanDto { Id = e.Id, TenantId = e.TenantId, RoomCode = e.RoomCode, Date = e.Date, Price = e.Price };
        return CreatedAtAction(nameof(Get), new { id = e.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] RatePlanUpdateDto  x)
    {
        var r = await _db.Rates.FindAsync(id);
        if (r is null) return NotFound();

        r.Date = x.Date;
        r.Price = x.Price;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var r = await _db.Rates.FindAsync(id);
        if (r is null) return NotFound();

        _db.Rates.Remove(r);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

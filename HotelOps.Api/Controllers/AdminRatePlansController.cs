using HotelOps.Api.Contracts.RatePlans;
using HotelOps.Api.Data;
using HotelOps.Api.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/rateplans")]
public class AdminRatePlansController : ControllerBase
{
    private readonly AppDb _db;
    public AdminRatePlansController(AppDb db) => _db = db;

    // Return full details so the UI can show all columns
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RatePlanDto>>> List()
    {
        var items = await _db.RatePlans
            .OrderBy(x => x.Code)
            .Select(x => new RatePlanDto(
                x.Id,
                x.Code,
                x.Name,
                x.Description,
                x.Active,
                x.PriceModifier,
                x.IsPercent))
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RatePlanDto>> GetById(int id)
    {
        var e = await _db.RatePlans.FindAsync(id);
        if (e is null) return NotFound();

        return new RatePlanDto(
            e.Id, e.Code, e.Name, e.Description, e.Active, e.PriceModifier, e.IsPercent);
    }

    [HttpPost]
    public async Task<ActionResult<RatePlanDto>> Create([FromBody] RatePlanCreateDto dto)
    {
        var e = new RatePlan
        {
            Code = dto.Code.Trim(),
            Name = dto.Name.Trim(),
            Description = dto.Description,
            Active = dto.Active,
            PriceModifier = dto.PriceModifier,
            IsPercent = dto.IsPercent
        };
        _db.RatePlans.Add(e);
        await _db.SaveChangesAsync();

        var outDto = new RatePlanDto(
            e.Id, e.Code, e.Name, e.Description, e.Active, e.PriceModifier, e.IsPercent);

        return CreatedAtAction(nameof(GetById), new { id = e.Id }, outDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] RatePlanUpdateDto dto)
    {
        var e = await _db.RatePlans.FindAsync(id);
        if (e is null) return NotFound();

        e.Code = dto.Code.Trim();
        e.Name = dto.Name.Trim();
        e.Description = dto.Description;
        e.Active = dto.Active;
        e.PriceModifier = dto.PriceModifier;
        e.IsPercent = dto.IsPercent;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var e = await _db.RatePlans.FindAsync(id);
        if (e is null) return NotFound();

        _db.RatePlans.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

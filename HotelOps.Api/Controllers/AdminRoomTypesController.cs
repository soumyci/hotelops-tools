using HotelOps.Api.Data;
using HotelOps.Api.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/roomtypes")]
public class AdminRoomTypesController : ControllerBase
{
    private readonly AppDb _db;
    public AdminRoomTypesController(AppDb db) => _db = db;

    // LIST
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomTypeListItemDto>>> List()
    {
        var items = await _db.RoomTypes
            .OrderBy(x => x.Code)
            .Select(x => new RoomTypeListItemDto(x.Id, x.Code, x.Name, x.BasePrice, x.Active))
            .ToListAsync();
        return Ok(items);
    }

    // GET BY ID (handy for edit screens)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<RoomTypeDto>> Get(int id)
    {
        var rt = await _db.RoomTypes.FindAsync(id);
        if (rt is null) return NotFound();

        return new RoomTypeDto(rt.Id, rt.Code, rt.Name, rt.Description, rt.BasePrice, rt.Active);
    }

    // CREATE
    [HttpPost]
    public async Task<ActionResult<RoomTypeDto>> Create([FromBody] RoomTypeCreateDto dto)
    {
        var code = dto.Code?.Trim().ToUpperInvariant() ?? "";
        var name = dto.Name?.Trim() ?? "";
        if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(name))
            return BadRequest("Code and Name are required.");

        var exists = await _db.RoomTypes.AnyAsync(x => x.Code == code);
        if (exists) return Conflict("Room type code already exists.");

        var e = new RoomType
        {
            Code = code,
            Name = name,
            Description = dto.Description?.Trim(),
            BasePrice = dto.BasePrice,
            Active = dto.Active
        };

        _db.RoomTypes.Add(e);
        await _db.SaveChangesAsync();

        var outDto = new RoomTypeDto(e.Id, e.Code, e.Name, e.Description, e.BasePrice, e.Active);
        return CreatedAtAction(nameof(Get), new { id = e.Id }, outDto);
    }

    // UPDATE
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] RoomTypeUpdateDto dto)
    {
        var e = await _db.RoomTypes.FindAsync(id);
        if (e is null) return NotFound();

        var code = dto.Code?.Trim().ToUpperInvariant() ?? "";
        var name = dto.Name?.Trim() ?? "";
        if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(name))
            return BadRequest("Code and Name are required.");

        var dup = await _db.RoomTypes.AnyAsync(x => x.Id != id && x.Code == code);
        if (dup) return Conflict("Room type code already exists.");

        e.Code = code;
        e.Name = name;
        e.Description = dto.Description?.Trim();
        e.BasePrice = dto.BasePrice;
        e.Active = dto.Active;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE (block if in use by any room)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var inUse = await _db.Rooms.AnyAsync(r => r.RoomTypeId == id);
        if (inUse)
            return Conflict("Cannot delete: one or more rooms are using this room type.");

        var e = await _db.RoomTypes.FindAsync(id);
        if (e is null) return NotFound();

        _db.RoomTypes.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

#region DTOs (fallbacks if you don’t already have these in Contracts)
public record RoomTypeListItemDto(int Id, string Code, string Name, decimal BasePrice, bool Active);
public record RoomTypeDto(int Id, string Code, string Name, string? Description, decimal BasePrice, bool Active);
public record RoomTypeCreateDto(string Code, string Name, string? Description, decimal BasePrice, bool Active);
public record RoomTypeUpdateDto(string Code, string Name, string? Description, decimal BasePrice, bool Active);
#endregion

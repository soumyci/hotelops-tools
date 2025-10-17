using HotelOps.Api.Data;
using HotelOps.Api.Data.Entities;
using HotelOps.Api.Contracts.Amenities; // AmenityDto, CreateAmenityDto, UpdateAmenityDto
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/amenities")]
public sealed class AdminAmenitiesController : ControllerBase
{
    private readonly AppDb _db; // <- your DbContext class (from AppDb.cs)

    public AdminAmenitiesController(AppDb db) => _db = db;

    // GET: /api/admin/amenities
    [HttpGet]
    public async Task<IEnumerable<AmenityDto>> List()
    {
        return await _db.Amenities
            .OrderBy(a => a.Name)
            .Select(a => new AmenityDto(a.Id, a.Code, a.Name, true))
            .ToListAsync();
    }

    // GET: /api/admin/amenities/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AmenityDto>> GetById(int id)
    {
        var a = await _db.Amenities.FindAsync(id);
        if (a is null) return NotFound();

        return new AmenityDto(a.Id, a.Code, a.Name, true);
    }

    // POST: /api/admin/amenities
    [HttpPost]
    public async Task<ActionResult<AmenityDto>> Create([FromBody] CreateAmenityDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Code) || string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Code and Name are required.");

        var code = dto.Code.Trim().ToUpperInvariant();
        var name = dto.Name.Trim();

        var exists = await _db.Amenities.AnyAsync(x => x.Code == code);
        if (exists) return Conflict("Amenity code already exists.");

        var entity = new Amenity { Code = code, Name = name };
        _db.Amenities.Add(entity);
        await _db.SaveChangesAsync();

        var result = new AmenityDto(entity.Id, entity.Code, entity.Name, true);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, result);
    }

    // PUT: /api/admin/amenities/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAmenityDto dto)
    {
        var entity = await _db.Amenities.FindAsync(id);
        if (entity is null) return NotFound();

        if (string.IsNullOrWhiteSpace(dto.Code) || string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Code and Name are required.");

        var code = dto.Code.Trim().ToUpperInvariant();
        var name = dto.Name.Trim();

        var duplicate = await _db.Amenities.AnyAsync(x => x.Id != id && x.Code == code);
        if (duplicate) return Conflict("Another amenity already uses this code.");

        entity.Code = code;
        entity.Name = name;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /api/admin/amenities/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Amenities.FindAsync(id);
        if (entity is null) return NotFound();

        // If you want to block delete when in use, check RoomAmenities here.
        // var used = await _db.RoomAmenities.AnyAsync(ra => ra.AmenityId == id);
        // if (used) return Conflict("Amenity is used by rooms.");

        _db.Amenities.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

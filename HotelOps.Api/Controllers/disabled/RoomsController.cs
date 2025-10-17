using HotelOps.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelOps.Api.Contracts;
namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/rooms")]
[AllowAnonymous]
public class RoomsController : ControllerBase
{
    private readonly AppDb _db;
    public RoomsController(AppDb db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomDto>>> GetAll()
    {
        var rooms = await _db.Rooms
            .OrderBy(r => r.RoomCode)
            .Select(r => new RoomDto {
                Id = r.Id, TenantId = r.TenantId, RoomCode = r.RoomCode, Name = r.Name,
                Type = r.Type, Capacity = r.Capacity, BasePrice = r.BasePrice,
                AmenitiesCsv = r.AmenitiesCsv, ImageUrl = r.ImageUrl
            })
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoomDto>> GetById(Guid id)
    {
        var r = await _db.Rooms.FindAsync(id);
        if (r is null) return NotFound();
        return new RoomDto {
            Id = r.Id, TenantId = r.TenantId, RoomCode = r.RoomCode, Name = r.Name,
            Type = r.Type, Capacity = r.Capacity, BasePrice = r.BasePrice,
            AmenitiesCsv = r.AmenitiesCsv, ImageUrl = r.ImageUrl
        };
    }
}

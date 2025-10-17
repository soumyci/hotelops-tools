using HotelOps.Api.Contracts.Rooms;
using HotelOps.Api.Data;
using HotelOps.Api.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/rooms")]
public class AdminRoomsController : ControllerBase
{
    private readonly AppDb _db;
    public AdminRoomsController(AppDb db) => _db = db;

    [HttpGet]
    public async Task<IEnumerable<RoomDto>> List()
        => await _db.Rooms
            .OrderBy(r => r.Code)
            .Select(r => new RoomDto(
                r.Id, r.Code, r.Name, r.Capacity, r.BasePrice, r.RoomTypeId,
                r.RoomAmenities.Select(ra => ra.AmenityId).ToArray()))
            .ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RoomDto>> Get(int id)
    {
        var r = await _db.Rooms
            .Include(x => x.RoomAmenities)
            .SingleOrDefaultAsync(x => x.Id == id);

        return r is null
            ? NotFound()
            : new RoomDto(
                r.Id, r.Code, r.Name, r.Capacity, r.BasePrice, r.RoomTypeId,
                r.RoomAmenities.Select(ra => ra.AmenityId).ToArray());
    }

    [HttpPost]
    public async Task<ActionResult<RoomDto>> Create([FromBody] CreateRoomDto dto)
    {
        if (await _db.Rooms.AnyAsync(x => x.Code == dto.Code.Trim()))
            return Conflict("Room code already exists.");

        var room = new Room
        {
            Code = dto.Code.Trim(),
            Name = dto.Name.Trim(),
            Capacity = dto.Capacity,
            BasePrice = dto.BasePrice,
            RoomTypeId = dto.RoomTypeId
        };
        _db.Rooms.Add(room);
        await _db.SaveChangesAsync(); // get room.Id

        await SyncRoomAmenities(room.Id, dto.AmenityIds ?? Array.Empty<int>());
        await _db.SaveChangesAsync();

        var result = await _db.Rooms
            .Include(r => r.RoomAmenities)
            .Where(r => r.Id == room.Id)
            .Select(r => new RoomDto(
                r.Id, r.Code, r.Name, r.Capacity, r.BasePrice, r.RoomTypeId,
                r.RoomAmenities.Select(ra => ra.AmenityId).ToArray()))
            .SingleAsync();

        return CreatedAtAction(nameof(Get), new { id = room.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomDto dto)
    {
        var r = await _db.Rooms.FindAsync(id);
        if (r is null) return NotFound();

        r.Code = dto.Code.Trim();
        r.Name = dto.Name.Trim();
        r.Capacity = dto.Capacity;
        r.BasePrice = dto.BasePrice;
        r.RoomTypeId = dto.RoomTypeId;

        await SyncRoomAmenities(id, dto.AmenityIds ?? Array.Empty<int>());
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await _db.Rooms.Include(x => x.RoomAmenities).SingleOrDefaultAsync(x => x.Id == id);
        if (r is null) return NotFound();

        _db.RoomAmenities.RemoveRange(r.RoomAmenities);
        _db.Rooms.Remove(r);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private async Task SyncRoomAmenities(int roomId, int[] amenityIds)
    {
        // keep only valid amenity ids
        var valid = await _db.Amenities
            .Where(a => amenityIds.Contains(a.Id) && a.IsActive)
            .Select(a => a.Id)
            .ToListAsync();

        var existing = await _db.RoomAmenities
            .Where(ra => ra.RoomId == roomId)
            .ToListAsync();

        var toRemove = existing.Where(e => !valid.Contains(e.AmenityId)).ToList();
        var have = existing.Select(e => e.AmenityId).ToHashSet();
        var toAdd = valid.Where(id => !have.Contains(id))
                         .Select(id => new RoomAmenity { RoomId = roomId, AmenityId = id });

        _db.RoomAmenities.RemoveRange(toRemove);
        await _db.RoomAmenities.AddRangeAsync(toAdd);
    }
}

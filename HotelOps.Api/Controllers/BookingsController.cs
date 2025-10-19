using HotelOps.Api.Data;
using HotelOps.Api.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController(AppDb db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await db.Bookings.OrderByDescending(b => b.Id).Take(200).ToListAsync());

    public record CreateBookingDto(
        string GuestName, string Mobile, DateTime CheckIn, int Nights,
        int Adults, int Children, string RoomCategory,
        string? CorporateCode, string? CouponCode,
        bool PickupAirport, bool PickupRail, bool LocalCab);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        var b = new Booking
        {
            Code = $"BK-{DateTime.UtcNow:yyyyMMddHHmmss}",
            GuestName = dto.GuestName, Mobile = dto.Mobile,
            CheckIn = dto.CheckIn, Nights = dto.Nights,
            CheckOut = dto.CheckIn.Date.AddDays(dto.Nights),
            Adults = dto.Adults, Children = dto.Children,
            RoomCategory = dto.RoomCategory,
            CorporateCode = dto.CorporateCode, CouponCode = dto.CouponCode,
            PickupAirport = dto.PickupAirport, PickupRail = dto.PickupRail, LocalCab = dto.LocalCab,
            BaseAmount = 0, DiscountAmount = 0, FacilitiesAmount = 0, TotalAmount = 0 // calc later
        };
        db.Bookings.Add(b);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = b.Id }, b);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
        => await db.Bookings.FindAsync(id) is { } b ? Ok(b) : NotFound();
}

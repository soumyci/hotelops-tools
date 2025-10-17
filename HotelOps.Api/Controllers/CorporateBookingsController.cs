    // Controllers/CorporateBookingsController.cs
    using HotelOps.Api.Contracts.Bookings;
    using HotelOps.Api.Data;
    using HotelOps.Api.Data.Entities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using HotelOps.Api.Data.Auth;
    namespace HotelOps.Api.Controllers;

    [ApiController]
    [Route("api/corporate/bookings")]
    [Authorize(Policy = "CorporateOnly")] // or RequireRole("CorporateBooker")
    public class CorporateBookingsController : ControllerBase
    {
        private readonly AppDb _db;
        public CorporateBookingsController(AppDb db) => _db = db;

        [HttpGet]
        public async Task<IEnumerable<BookingListItemDto>> List()
        {
            return await _db.Reservations
                .Include(r => r.Customer).Include(r => r.RoomType)
                .OrderByDescending(r => r.Id)
                .Select(r => new BookingListItemDto(
                    r.Id, r.Code, r.Customer!.Name, r.RoomType!.Name,
                    r.CheckIn, r.CheckOut, r.Rooms, r.Total, r.Status
                ))
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<BookingListItemDto>> Create([FromBody] BookingCreateDto dto)
        {
            var customer = await _db.Customers.SingleOrDefaultAsync(c => c.Code == dto.CustomerCode && c.Active);
            if (customer is null) return BadRequest("Unknown or inactive customer");

            var rt = await _db.RoomTypes.SingleOrDefaultAsync(x => x.Id == dto.RoomTypeId && x.Active);
            if (rt is null) return BadRequest("Invalid room type");

            // compute totals (simple: nights * rooms * nightlyRate)
            var nights = dto.CheckOut.DayNumber - dto.CheckIn.DayNumber;
            if (nights <= 0) return BadRequest("Check-out must be after check-in");
            var total = nights * dto.Rooms * dto.NightlyRate;

            var res = new Reservation
            {
                Code = $"BKG-{DateTime.UtcNow:yyyyMMddHHmmss}",
                CustomerId = customer.Id,
                RoomTypeId = dto.RoomTypeId,
                RatePlanId = dto.RatePlanId,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                Rooms = dto.Rooms,
                NightlyRate = dto.NightlyRate,
                Total = total
            };

            _db.Reservations.Add(res);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = res.Id }, new BookingListItemDto(
                res.Id, res.Code, customer.Name, rt.Name, res.CheckIn, res.CheckOut, res.Rooms, res.Total, res.Status
            ));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<BookingListItemDto>> Get(int id)
        {
            var r = await _db.Reservations.Include(x => x.Customer).Include(x => x.RoomType)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (r is null) return NotFound();

            return new BookingListItemDto(
                r.Id, r.Code, r.Customer!.Name, r.RoomType!.Name, r.CheckIn, r.CheckOut, r.Rooms, r.Total, r.Status
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r is null) return NotFound();
            r.Status = "Cancelled";
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

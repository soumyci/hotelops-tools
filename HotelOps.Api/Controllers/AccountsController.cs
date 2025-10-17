// Controllers/AccountsController.cs
using HotelOps.Api.Data;
using HotelOps.Api.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/accounts")]
[Authorize(Policy = "AdminOnly")] // or HotelOnly; up to you
public class AccountsController : ControllerBase
{
    private readonly AppDb _db;
    public AccountsController(AppDb db) => _db = db;

    // record a payment
    public record PaymentCreateDto(int ReservationId, decimal Amount, string Method, string? Reference);
    [HttpPost("payments")]
    public async Task<IActionResult> CreatePayment([FromBody] PaymentCreateDto dto)
    {
        var res = await _db.Reservations.FindAsync(dto.ReservationId);
        if (res is null) return NotFound("Reservation not found");

        _db.Payments.Add(new Payment {
            ReservationId = dto.ReservationId,
            Amount = dto.Amount,
            Method = dto.Method,
            Reference = dto.Reference
        });
        await _db.SaveChangesAsync();
        return Ok();
    }

    // pending bills (customer-wise)
    public record PendingItem(string Customer, decimal Billed, decimal Paid, decimal Pending);
    [HttpGet("reports/pending")]
    public async Task<IEnumerable<PendingItem>> Pending()
    {
        // Billed = Sum(res.Total), Paid = Sum(payments)
        var billed = await _db.Reservations
            .Include(r => r.Customer)
            .GroupBy(r => r.Customer!.Name)
            .Select(g => new { Customer = g.Key, Billed = g.Sum(x => x.Total) })
            .ToListAsync();

        var paid = await _db.Payments
            .Include(p => p.Reservation!).ThenInclude(r => r.Customer)
            .GroupBy(p => p.Reservation!.Customer!.Name)
            .Select(g => new { Customer = g.Key, Paid = g.Sum(x => x.Amount) })
            .ToListAsync();

        var result = from b in billed
                     join p in paid on b.Customer equals p.Customer into gj
                     from p in gj.DefaultIfEmpty()
                     select new PendingItem(b.Customer, b.Billed, p?.Paid ?? 0m, b.Billed - (p?.Paid ?? 0m));

        return result.OrderByDescending(x => x.Pending);
    }
}

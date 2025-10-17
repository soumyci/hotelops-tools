using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelOps.Api.Data;
using Microsoft.AspNetCore.Authorization;
using HotelOps.Api.Contracts;
namespace HotelOps.Api.Controllers;
using System.ComponentModel.DataAnnotations;

[ApiController]
[Route("api/admin/corporates")]
[AllowAnonymous] // TEMP
public class AdminCorporatesController : ControllerBase
{
    private readonly AppDb _db;
    public AdminCorporatesController(AppDb db) => _db = db;

    [HttpGet] public Task<List<Corporate>> List() => _db.Corporates.OrderBy(c => c.Id).ToListAsync();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Corporate c)
    {
        _db.Corporates.Add(c);
        await _db.SaveChangesAsync();
        return Ok(c);
    }
}

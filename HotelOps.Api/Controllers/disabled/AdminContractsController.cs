using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelOps.Api.Data;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using HotelOps.Api.Contracts;
//using HotelOps.Api.global
namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/contracts")]
[Authorize(Policy = "AdminOnly")]
public class AdminContractsController : ControllerBase
{
    private readonly AppDb _db;
    public AdminContractsController(AppDb db) => _db = db;

    [HttpGet] public Task<List<Contract>> List() => _db.Contracts.OrderBy(c => c.CorporateId).ToListAsync();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Contract c)
    {
        _db.Contracts.Add(c);
        await _db.SaveChangesAsync();
        return Ok(c);
    }
}

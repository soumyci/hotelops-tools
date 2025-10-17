// File: Controllers/FilesController.cs
using Microsoft.AspNetCore.Mvc;
using HotelOps.Api.Contracts;
namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    public FilesController(IWebHostEnvironment env) => _env = env;

    [HttpPost("upload")]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file");

        var webRoot  = _env.WebRootPath ?? "wwwroot";
        var uploads  = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploads);

        var ext = Path.GetExtension(file.FileName);
        var name = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{Guid.NewGuid():N}{ext}";
        var dest = Path.Combine(uploads, name);

        await using (var fs = System.IO.File.Create(dest))
            await file.CopyToAsync(fs);

        return Ok(new { url = $"/uploads/{name}" });
    }
}

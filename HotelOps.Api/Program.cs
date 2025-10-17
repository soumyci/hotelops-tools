using HotelOps.Api.Data;
using HotelOps.Api.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using HotelOps.Api.Data.Entities;

// Postgres timestamp behavior (optional, helps with older Npgsql models)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<AppDb>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Controllers (keep your JSON settings if you like)
builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});



builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = ctx =>
    {
        var env = ctx.HttpContext.RequestServices
            .GetRequiredService<IHostEnvironment>();

        if (env.IsDevelopment() && ctx.Exception is not null)
        {
            // include the exception text in the response for debugging
            ctx.ProblemDetails.Extensions["exception"] =
                ctx.Exception.ToString();
        }
    };
});
// Auth
builder.Services.AddAuthentication(DemoAuthHandler.Scheme)
    .AddScheme<AuthenticationSchemeOptions, DemoAuthHandler>(DemoAuthHandler.Scheme, null);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("CorporateOnly", p => p.RequireRole("Corporate"));
    options.AddPolicy("HotelOnly", p => p.RequireRole("Hotel"));
    options.AddPolicy("CorporateOnly", p => p.RequireRole("Corporate", "CorporateBooker"));
    options.AddPolicy("CorporateOnly", p => p.RequireRole("Corporate", "CorporateBooker"));
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
});

// AutoMapper//
//builder.Services.AddAutoMapper(typeof(Program));


// ── CORS ─────────────────────────────────────────────────────────────
const string Frontend = "Frontend";
builder.Services.AddCors(o => o.AddPolicy("open", p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));
builder.Services.AddCors(o => o.AddPolicy("dev", p =>
    p.WithOrigins("http://localhost:5173")
     .AllowAnyHeader()
     .AllowAnyMethod()
));
// ── Swagger (unchanged) ─────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HotelOps.Api", Version = "v1" });
    c.AddSecurityDefinition("DemoOrBearer", new OpenApiSecurityScheme
    {
        Description = "Put either:\n" +
                      "Demo role=Admin; name=Admin User; email=admin@example.com\n" +
                      "or\n" +
                      "Bearer Demo role=Admin; name=Admin User; email=admin@example.com",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "DemoOrBearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "DemoOrBearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();
// ---- seed data (runs once) ----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    await db.Database.MigrateAsync();
    var mustHave = new[]{ ("WIFI","Wi-Fi"), ("AC","Air Conditioning"), ("TV","Television") };
    foreach (var (code,name) in mustHave)
    {
        if (!await db.Amenities.AnyAsync(a => a.Code == code))
            db.Amenities.Add(new Amenity { Code = code, Name = name, IsActive = true });
    }
    await db.SaveChangesAsync();
    var dlx = await db.RoomTypes.SingleOrDefaultAsync(rt => rt.Code == "DLX");
    if (dlx is null)
    {
        dlx = db.RoomTypes.Add(new RoomType { Code = "DLX", Name = "Deluxe" }).Entity;
        await db.SaveChangesAsync();
    }

    if (!await db.Rooms.AnyAsync())
    {
        db.Rooms.Add(new Room
        {
            Code = "DLX-1301",
            Name = "Deluxe Room 101",
            Capacity = 2,
            BasePrice = 21500m,
            RoomTypeId = dlx.Id
        });
        await db.SaveChangesAsync();
    }
}



// Order matters from here down  ⬇️

// (optional) HTTPS redirect
app.UseHttpsRedirection();

// CORS **must** be before auth and before MapControllers
app.UseCors("dev");

// Swagger UI is fine anywhere
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles(); 
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // you can also do: .RequireCors(Frontend)

app.MapGet("/api/ping", () => Results.Ok(new { ok = true }));

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseStatusCodePages();
}

// Ensure /wwwroot/uploads exists at runtime (optional helper)
var uploadsPath = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsPath);
// using (var scope = app.Services.CreateScope())
// {
//     var db = scope.ServiceProvider.GetRequiredService<AppDb>();
//     db.Database.Migrate();         // creates DB/tables or updates schema
// }
app.Run();

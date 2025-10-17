using System.Text;
using HotelOps.Api.Data;
using HotelOps.Api.Data.Auth;   
using HotelOps.Api.Auth;               
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ---------- DB ----------
builder.Services.AddDbContext<AppDb>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ---------- MVC / JSON ----------
builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// ---------- ProblemDetails (dev helper) ----------
builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = ctx =>
    {
        var env = ctx.HttpContext.RequestServices.GetRequiredService<IHostEnvironment>();
        if (env.IsDevelopment() && ctx.Exception is not null)
            ctx.ProblemDetails.Extensions["exception"] = ctx.Exception.ToString();
    };
});

// ---------- Identity + Roles ----------
builder.Services
    .AddIdentityCore<AppUser>(opt => { opt.User.RequireUniqueEmail = true; })
    .AddRoles<IdentityRole>()                    // RoleManager<IdentityRole>
    .AddEntityFrameworkStores<AppDb>()           // uses AppDb : IdentityDbContext<AppUser>
    .AddDefaultTokenProviders();

// ---------- Auth (JWT + DemoAuth for dev) ----------
var jwt = builder.Configuration.GetSection("Jwt");
// Use a policy scheme that forwards based on the Authorization header
builder.Services.AddAuthentication("Smart")
    .AddPolicyScheme("Smart", "BearerOrDemo", options =>
    {
        options.ForwardDefaultSelector = ctx =>
        {
            var auth = ctx.Request.Headers["Authorization"].ToString();
            if (auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                return JwtBearerDefaults.AuthenticationScheme;
            if (auth.StartsWith(DemoAuthHandler.Scheme, StringComparison.OrdinalIgnoreCase)) // "Demo"
                return DemoAuthHandler.Scheme;
            // default to JWT if nothing specified
            return JwtBearerDefaults.AuthenticationScheme;
        };
    })
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!))
        };
    })
    .AddScheme<AuthenticationSchemeOptions, DemoAuthHandler>(DemoAuthHandler.Scheme, _ => { });

// ---------- Authorization ----------
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",     p => p.RequireRole("Admin"));
    options.AddPolicy("StaffOnly",     p => p.RequireRole("Staff","Admin"));
    options.AddPolicy("CorporateOnly", p => p.RequireRole("CorporateBooker","CorporateAdmin"));
});

// ---------- CORS ----------
builder.Services.AddCors(o =>
{
    o.AddPolicy("open", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
    o.AddPolicy("dev",  p => p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

// ---------- Swagger ----------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HotelOps.Api", Version = "v1" });

    // JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT: Bearer {token}",
        Name = "Authorization", In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey, Scheme = "Bearer"
    });

    // Demo
    c.AddSecurityDefinition("Demo", new OpenApiSecurityScheme
    {
        Description = "Demo role=Admin; name=Admin User; email=admin@example.com",
        Name = "Authorization", In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey, Scheme = "Demo"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference{ Type=ReferenceType.SecurityScheme, Id="Bearer"} }, Array.Empty<string>() },
        { new OpenApiSecurityScheme { Reference = new OpenApiReference{ Type=ReferenceType.SecurityScheme, Id="Demo"} },   Array.Empty<string>() }
    });
});

var app = builder.Build();

// ---------- Seed Roles + Admin + DB data ----------
using (var scope = app.Services.CreateScope())
{
    await HotelOps.Api.Data.Auth.IdentitySeed.RunAsync(scope.ServiceProvider);

    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    await db.Database.MigrateAsync();

    // sample seed
    var mustHave = new[] { ("WIFI","Wi-Fi"), ("AC","Air Conditioning"), ("TV","Television") };
    foreach (var (code,name) in mustHave)
        if (!await db.Amenities.AnyAsync(a => a.Code == code))
            db.Amenities.Add(new HotelOps.Api.Data.Entities.Amenity { Code = code, Name = name, IsActive = true });

    await db.SaveChangesAsync();

    var dlx = await db.RoomTypes.SingleOrDefaultAsync(rt => rt.Code == "DLX")
              ?? db.RoomTypes.Add(new HotelOps.Api.Data.Entities.RoomType { Code = "DLX", Name = "Deluxe" }).Entity;
    await db.SaveChangesAsync();

    if (!await db.Rooms.AnyAsync())
    {
        db.Rooms.Add(new HotelOps.Api.Data.Entities.Room
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

// ---------- Pipeline ----------
app.UseHttpsRedirection();
app.UseCors("dev");
app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/api/ping", () => Results.Ok(new { ok = true }));

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseStatusCodePages();
}

// ensure wwwroot/uploads exists
var uploadsPath = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsPath);

app.Run();

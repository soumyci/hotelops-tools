using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotelOps.Api.Data;
using HotelOps.Api.Data.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer; // <-- add
using Microsoft.OpenApi.Models;                       // <-- add
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
// Identity
builder.Services
    .AddIdentityCore<AppUser>(o =>
    {
        o.User.RequireUniqueEmail = false;
        o.Password.RequiredLength = 6;
        o.Password.RequireNonAlphanumeric = false;
        o.Password.RequireUppercase = false;
        o.Password.RequireLowercase = false;
        o.Password.RequireDigit = false;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDb>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

var jwtKey     = builder.Configuration["Jwt:Key"]      ?? throw new InvalidOperationException("Jwt:Key missing");
var jwtIssuer  = builder.Configuration["Jwt:Issuer"]   ?? throw new InvalidOperationException("Jwt:Issuer missing");
var jwtAudience= builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience missing");
var signingKey  = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // dev only
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = jwtAudience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
        options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = ctx =>
        {
            Console.WriteLine("JWT auth failed: " + ctx.Exception.Message);
            return Task.CompletedTask;
        },
        OnChallenge = ctx =>
        {
            // prints e.g. error="invalid_token"
            Console.WriteLine($"JWT challenge: {ctx.Error} {ctx.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("CorporateOnly", p => p.RequireRole("Corporate"));
    options.AddPolicy("HotelOnly", p => p.RequireRole("Hotel"));
    // options.AddPolicy("CorporateOnly", p => p.RequireRole("Corporate", "CorporateBooker"));
    // options.AddPolicy("CorporateOnly", p => p.RequireRole("Corporate", "CorporateBooker"));
    // options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
});

// AutoMapper//
//builder.Services.AddAutoMapper(typeof(Program));


// ── CORS ─────────────────────────────────────────────────────────────
const string Frontend = "Frontend";
builder.Services.AddCors(o => o.AddPolicy("open", p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ui", p => p
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});
// ── Swagger (unchanged) ─────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HotelOps.Api", Version = "v1" });

    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Type: Bearer {your JWT}"
    };

    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme{ Reference = new OpenApiReference{ Type = ReferenceType.SecurityScheme, Id = "Bearer"}}, Array.Empty<string>() }
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
app.UseCors("ui");

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
using (var scope = app.Services.CreateScope())
{
    await HotelOps.Api.Data.IdentitySeed.EnsureAdminAsync(app.Services);
}
app.Run();

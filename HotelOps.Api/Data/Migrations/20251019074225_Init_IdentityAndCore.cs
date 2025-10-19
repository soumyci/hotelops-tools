using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelOps.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Init_IdentityAndCore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoomId = table.Column<Guid>(type: "uuid", nullable: true),
                    RoomCode = table.Column<string>(type: "text", nullable: false),
                    GuestName = table.Column<string>(type: "text", nullable: false),
                    CheckIn = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CheckOut = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Rooms = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");
        }
    }
}

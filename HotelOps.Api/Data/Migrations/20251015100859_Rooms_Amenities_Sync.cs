using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelOps.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Rooms_Amenities_Sync : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Keep your shape changes
            migrationBuilder.AlterColumn<decimal>(
                name: "BasePrice",
                table: "RoomTypes",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Rooms",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            // Idempotent DDL (Postgres)
            migrationBuilder.Sql("""
            DO $$
            BEGIN
                -- 1) Ensure Amenities.IsActive exists (so Down can remove it)
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Amenities' AND column_name='IsActive'
                ) THEN
                    ALTER TABLE "Amenities" ADD COLUMN "IsActive" boolean NOT NULL DEFAULT true;
                END IF;

                -- 2) Add RoomTypeId if missing
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Rooms' AND column_name='RoomTypeId'
                ) THEN
                    ALTER TABLE "Rooms" ADD COLUMN "RoomTypeId" integer;
                END IF;

                -- 3) Backfill RoomTypeId from legacy "Type" code where possible
                UPDATE "Rooms" r
                SET "RoomTypeId" = rt."Id"
                FROM "RoomTypes" rt
                WHERE r."RoomTypeId" IS NULL
                  AND r."Type" = rt."Code";

                -- 4) Make NOT NULL (assumes either backfilled or data is valid)
                ALTER TABLE "Rooms" ALTER COLUMN "RoomTypeId" SET NOT NULL;

                -- 5) Helpful indexes (only if missing)
                CREATE UNIQUE INDEX IF NOT EXISTS "IX_Rooms_Code" ON "Rooms" ("Code");
                CREATE INDEX IF NOT EXISTS "IX_Rooms_RoomTypeId" ON "Rooms" ("RoomTypeId");

                -- 6) FK only if missing
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'FK_Rooms_RoomTypes_RoomTypeId'
                ) THEN
                    ALTER TABLE "Rooms"
                    ADD CONSTRAINT "FK_Rooms_RoomTypes_RoomTypeId"
                    FOREIGN KEY ("RoomTypeId") REFERENCES "RoomTypes" ("Id") ON DELETE CASCADE;
                END IF;

                -- 7) Drop legacy columns only if they still exist
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Rooms' AND column_name='Type') THEN
                    ALTER TABLE "Rooms" DROP COLUMN "Type";
                END IF;
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Rooms' AND column_name='AmenitiesCsv') THEN
                    ALTER TABLE "Rooms" DROP COLUMN "AmenitiesCsv";
                END IF;
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Rooms' AND column_name='ImageUrl') THEN
                    ALTER TABLE "Rooms" DROP COLUMN "ImageUrl";
                END IF;
            END $$;
            """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Make all drops conditional so a revert is safe even if
            // someone has already removed items.

            migrationBuilder.Sql("""
            DO $$
            BEGIN
                -- Drop FK if it exists
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_Rooms_RoomTypes_RoomTypeId') THEN
                    ALTER TABLE "Rooms" DROP CONSTRAINT "FK_Rooms_RoomTypes_RoomTypeId";
                END IF;

                -- Drop indexes if they exist
                IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Rooms_Code') THEN
                    DROP INDEX "IX_Rooms_Code";
                END IF;
                IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_Rooms_RoomTypeId') THEN
                    DROP INDEX "IX_Rooms_RoomTypeId";
                END IF;

                -- Drop RoomTypeId if it exists
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Rooms' AND column_name='RoomTypeId'
                ) THEN
                    ALTER TABLE "Rooms" DROP COLUMN "RoomTypeId";
                END IF;

                -- Drop Amenities.IsActive if it exists
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Amenities' AND column_name='IsActive'
                ) THEN
                    ALTER TABLE "Amenities" DROP COLUMN "IsActive";
                END IF;

                -- Recreate legacy columns if they don't exist
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Rooms' AND column_name='AmenitiesCsv'
                ) THEN
                    ALTER TABLE "Rooms" ADD COLUMN "AmenitiesCsv" text NULL;
                END IF;
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Rooms' AND column_name='ImageUrl'
                ) THEN
                    ALTER TABLE "Rooms" ADD COLUMN "ImageUrl" text NULL;
                END IF;
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='Rooms' AND column_name='Type'
                ) THEN
                    ALTER TABLE "Rooms" ADD COLUMN "Type" character varying(32) NOT NULL DEFAULT '';
                END IF;
            END $$;
            """);

            // Revert the type/precision changes
            migrationBuilder.AlterColumn<decimal>(
                name: "BasePrice",
                table: "RoomTypes",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Rooms",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelOps.Api.Data.Entities
{
    public class Payment
    {
        public long Id { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [MaxLength(64)]
        public string? InvoiceNumber { get; set; }

        // e.g. corporate code or guest code typed by staff
        [MaxLength(64)]
        public string? CustomerCode { get; set; }

        // optional convenience copy so reports don’t need a join
        [MaxLength(160)]
        public string? CustomerName { get; set; }

        // store as numeric(12,2) via fluent mapping in AppDb
        public decimal Amount { get; set; }

        // 👉 compatibility alias for older code that uses "Method"
        [NotMapped]
        public string Method { get => Mode; set => Mode = value; }

        // Cash/Card/UPI/BankTransfer/Cheque/Other
        [MaxLength(32)]
        public string Mode { get; set; } = "Cash";

        [MaxLength(512)]
        public string? Details { get; set; }

        // who entered this payment (staff user id / username)
        [MaxLength(64)]
        public string EnteredByStaffId { get; set; } = default!;

        // audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // optional link used by legacy reports; kept nullable and not-mapped nav
        public long? ReservationId { get; set; }

        [NotMapped]
        public Reservation? Reservation { get; set; }
    }
}

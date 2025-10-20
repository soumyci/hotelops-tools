using System;

namespace HotelOps.Api.Contracts.Payments
{
    public class PaymentCreateDto
    {
        public DateTime PaymentDate { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; } // fill after lookup if you want
        public decimal Amount { get; set; }
        public string Mode { get; set; } = "Cash";
        public string? Details { get; set; }
        public string EnteredByStaffId { get; set; } = default!;
    }

    public class PaymentDto
    {
        public long Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; }
        public decimal Amount { get; set; }
        public string Mode { get; set; } = "Cash";
        public string? Details { get; set; }
        public string EnteredByStaffId { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string Reference {get;set;}
    }
}

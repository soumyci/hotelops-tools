using AutoMapper;
using HotelOps.Api.Data.Entities;                // <-- entities
using HotelOps.Api.Contracts.RatePlans;          // <-- DTOs

namespace HotelOps.Api.Mappings;

public class RatePlanProfile : Profile
{
    public RatePlanProfile()
    {
        // Entity -> DTOs
        CreateMap<RatePlan, RatePlanDto>();
        CreateMap<RatePlan, RatePlanListItemDto>();

        // DTOs -> Entity
        CreateMap<RatePlanCreateDto, RatePlan>()
            .ForMember(d => d.Code,  opt => opt.MapFrom(s => s.Code.Trim()))
            .ForMember(d => d.Name,  opt => opt.MapFrom(s => s.Name.Trim()));
    }
}

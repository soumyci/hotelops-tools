using AutoMapper;
using HotelOps.Api.Data.Entities;                 // <-- entities
using HotelOps.Api.Contracts.RoomTypes;           // <-- DTOs

namespace HotelOps.Api.Mappings;

public class RoomTypeProfile : Profile
{
    public RoomTypeProfile()
    {
        // Entity -> DTOs
        CreateMap<RoomType, RoomTypeDto>();
        CreateMap<RoomType, RoomTypeListItemDto>();

        // DTOs -> Entity
        CreateMap<RoomTypeCreateDto, RoomType>()
            .ForMember(d => d.Code,  opt => opt.MapFrom(s => s.Code.Trim()))
            .ForMember(d => d.Name,  opt => opt.MapFrom(s => s.Name.Trim()))
            .ForMember(d => d.Active,opt => opt.MapFrom(s => s.Active));
    }
}

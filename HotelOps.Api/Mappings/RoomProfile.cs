using AutoMapper;
using HotelOps.Api.Data.Entities;
using HotelOps.Api.Contracts.Rooms;              // <-- Contracts

namespace HotelOps.Api.Data.Mappings
{
    public class RoomProfile : Profile
    {
        public RoomProfile()
        {
            CreateMap<Room, RoomDto>().ReverseMap();
        }
    }
}

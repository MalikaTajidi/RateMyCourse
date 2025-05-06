
using FormationService.dto;
using FormationService.Models;
using AutoMapper;

namespace FormationService.Mapper
{
    public class FormationProfile : Profile
    {
        public FormationProfile()
        {
            CreateMap<ModuleDTO, Module>()
             .ForMember(dest => dest.ModuleId, opt => opt.Ignore())
             .ForMember(dest => dest.ModuleFormations, opt => opt.Ignore());

            CreateMap<FormationCreateDTO, Formation>()
                .ForMember(dest => dest.FormationId, opt => opt.Ignore())
                .ForMember(dest => dest.SchoolName, opt => opt.MapFrom(src => src.SchoolName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.ModuleFormations, opt => opt.Ignore());
        }
    }
}


using FormationService.dto;
using FormationService.Models;
using AutoMapper;

namespace FormationService.Mapper
{
    public class FormationProfile : Profile
    {
        public FormationProfile()
        {
            // Module mappings
            CreateMap<ModuleDTO, Module>()
                .ForMember(dest => dest.ModuleId, opt => opt.Ignore())
                .ForMember(dest => dest.ModuleFormations, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<Module, ModuleResponse>()
                .ForMember(dest => dest.ModuleId, opt => opt.MapFrom(src => src.ModuleId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            // Formation mappings
            CreateMap<FormationCreateDTO, Formation>()
                .ForMember(dest => dest.FormationId, opt => opt.Ignore())
                .ForMember(dest => dest.SchoolName, opt => opt.MapFrom(src => src.SchoolName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.FormationName, opt => opt.MapFrom(src => src.FormationName))
                .ForMember(dest => dest.ModuleFormations, opt => opt.Ignore());

            CreateMap<FormationUpdateDTO, Formation>()
                .ForMember(dest => dest.FormationId, opt => opt.Ignore())
                .ForMember(dest => dest.SchoolName, opt => opt.MapFrom(src => src.SchoolName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.FormationName, opt => opt.MapFrom(src => src.FormationName))
                .ForMember(dest => dest.ModuleFormations, opt => opt.Ignore());

            CreateMap<Formation, FormationResponseDTO>()
                .ForMember(dest => dest.FormationId, opt => opt.MapFrom(src => src.FormationId))
                .ForMember(dest => dest.SchoolName, opt => opt.MapFrom(src => src.SchoolName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.FormationName, opt => opt.MapFrom(src => src.FormationName))
                .ForMember(dest => dest.Modules, opt => opt.MapFrom(src => src.ModuleFormations
                    .Select(mf => mf.Module)
                    .Distinct()
                    .Select(m => new ModuleResponse
                    {
                        ModuleId = m.ModuleId,
                        Name = m.Name
                    })));
        }
    }
}

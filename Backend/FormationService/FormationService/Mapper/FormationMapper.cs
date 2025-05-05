
using FormationService.dto;
using FormationService.Models;
using AutoMapper;

namespace FormationService.Mapper
{
    public class FormationProfile : Profile
    {
        public FormationProfile()
        {
            CreateMap<Formation, FormationReadDTO>();
            CreateMap<FormationCreateDTO, Formation>();
            CreateMap<FormationUpdateDTO, Formation>();
        }
    }
}

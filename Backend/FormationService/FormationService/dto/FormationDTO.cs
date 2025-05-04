using System.ComponentModel.DataAnnotations;

namespace FormationService.dto
{
    public class FormationDTO
    {
        public class FormationDto
        {
            [Required(ErrorMessage = "Le nom de la formation est obligatoire")]
            public string FormationName { get; set; }

            [Required(ErrorMessage = "Le nom de l'école est obligatoire")]
            public string SchoolName { get; set; }

            public string Description { get; set; }

            [Required(ErrorMessage = "Au moins un module est requis")]
            public List<ModuleDTO> Modules { get; set; } = new List<ModuleDTO>();
        }

    }
}

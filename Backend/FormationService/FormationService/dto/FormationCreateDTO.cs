using System.ComponentModel.DataAnnotations;

namespace FormationService.dto
{
    public class FormationCreateDTO
    {
        [Required]
        public string FormationName { get; set; } 

        [Required]
        public string SchoolName { get; set; }   

        public string Description { get; set; }   

        public List<ModuleDTO> Modules { get; set; }
    }
}

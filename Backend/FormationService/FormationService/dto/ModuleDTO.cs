using System.ComponentModel.DataAnnotations;

namespace FormationService.dto
{
    public class ModuleDTO
    {
        [Required(ErrorMessage = "Le nom du module est obligatoire")]
        public string ModuleName { get; set; }
    }
}

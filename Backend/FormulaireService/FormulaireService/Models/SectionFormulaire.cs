using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FormulaireService.Models
{
    public class SectionFormulaire
    {
        [Key]
        public int SecFormId { get; set; }  // Clé primaire de la section
        [Required] 
        public string Description { get; set; } // Description de la section

        public int FormulaireId { get; set; }  // Clé étrangère vers Formulaire (relation N:1)

        [JsonIgnore] // Ignorer la propriété Formulaire pour éviter la boucle circulaire
        public Formulaire? Formulaire { get; set; }

        public ICollection<Question> Questions { get; set; } // Relation 1:N avec Question
    }
}

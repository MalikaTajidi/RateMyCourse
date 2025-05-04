namespace FormationService.Models
{
    public class Niveau
    {
        public int NiveauId { get; set; }
        public required string Name { get; set; }

        public required ICollection<ModuleFormation> ModuleFormations { get; set; }
    }
}

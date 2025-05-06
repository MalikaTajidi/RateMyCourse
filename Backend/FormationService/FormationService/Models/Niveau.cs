namespace FormationService.Models
{
    public class Niveau
    {
        public int NiveauId { get; set; }
        public string Name { get; set; }

        public ICollection<ModuleFormation> ModuleFormations { get; set; }
    }
}

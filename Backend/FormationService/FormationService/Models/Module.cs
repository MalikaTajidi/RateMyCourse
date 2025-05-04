namespace FormationService.Models
{
    public class Module
    {
        public int ModuleId { get; set; }
        public required string Name { get; set; }

        public required ICollection<ModuleFormation> ModuleFormations { get; set; }
    }
}

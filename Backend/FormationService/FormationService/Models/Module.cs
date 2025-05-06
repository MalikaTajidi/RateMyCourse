namespace FormationService.Models
{
    public class Module
    {
        public int ModuleId { get; set; }
        public string Name { get; set; }

        public ICollection<ModuleFormation> ModuleFormations { get; set; }
    }
}

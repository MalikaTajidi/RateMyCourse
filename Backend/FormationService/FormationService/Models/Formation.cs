namespace FormationService.Models
{
    public class Formation
    {
        public int FormationId { get; set; }
        public string FormationName { get; set; }
        public required string SchoolName { get; set; }

        public required string Description { get; set; }
        public required ICollection<ModuleFormation> ModuleFormations { get; set; }
    }
}

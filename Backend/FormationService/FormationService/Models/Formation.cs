namespace FormationService.Models
{
    public class Formation
    {
        public int FormationId { get; set; }
        public string FormationName { get; set; }
        public string SchoolName { get; set; }

        public string Description { get; set; }
        public ICollection<ModuleFormation> ModuleFormations { get; set; }

        public Formation()
        {
           
            ModuleFormations = new List<ModuleFormation>();
        }

        public Formation(int formationId, string formationName, string schoolName, string description)
        {
            FormationId = formationId;
            FormationName = formationName;
            SchoolName = schoolName;
            Description = description;
            ModuleFormations = new List<ModuleFormation>(); 
        }
    }
}

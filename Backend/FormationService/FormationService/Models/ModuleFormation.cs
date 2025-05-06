namespace FormationService.Models
{
    public class ModuleFormation
    {
        public int ModuleFormationId { get; set; }
        public int FormationId { get; set; }
        public Formation Formation { get; set; }

        public int NiveauId { get; set; }
        public Niveau Niveau { get; set; }

        public int ModuleId { get; set; }
        public required Module Module { get; set; }

        public ModuleFormation()
        {
            
        }

      
        public ModuleFormation(Formation formation, Module module, Niveau niveau)
        {
            Formation = formation;
            FormationId = formation.FormationId;

            Module = module;
            ModuleId = module.ModuleId;

            Niveau = niveau;
            NiveauId = niveau.NiveauId;
        }
    }
}

namespace FormationService.Models
{
    public class ModuleFormation
    {
        public required int FormationId { get; set; }
        public required Formation Formation { get; set; }

        public required int NiveauId { get; set; }
        public required Niveau Niveau { get; set; }

        public required int ModuleId { get; set; }
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

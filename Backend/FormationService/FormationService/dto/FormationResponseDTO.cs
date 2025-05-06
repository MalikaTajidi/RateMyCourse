namespace FormationService.dto
{
    public class FormationResponseDTO
    {
        public int FormationId { get; set; }

        public string FormationName { get; set; } //Niveau.Name
        public string SchoolName { get; set; }
        public string Description { get; set; }
        public List<ModuleResponse> Modules { get; set; } = new List<ModuleResponse>();
     
    }
}

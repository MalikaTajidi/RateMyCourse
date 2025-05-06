namespace FormationService.dto
{
    public class FormationUpdateDTO
    {
        public string FormationName { get; set; }
        public string SchoolName { get; set; }
        public string Description { get; set; }
        public List<ModuleUpdateDTO> Modules { get; set; } = new List<ModuleUpdateDTO>();
    }
}

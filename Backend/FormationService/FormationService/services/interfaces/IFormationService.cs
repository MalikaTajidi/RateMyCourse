using FormationService.dto;

namespace FormationService.services.interfaces
{
    public interface IFormationService
    {
        Task<IEnumerable<FormationReadDTO>> GetAllAsync();
        Task<FormationReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<FormationReadDTO>> SearchAsync(string? name, string? school);
        Task<FormationReadDTO> CreateAsync(FormationCreateDTO dto);
        Task<bool> UpdateAsync(int id, FormationUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}

using FormationService.dto;
using FormationService.Models;

namespace FormationService.services.interfaces
{
    public interface IFormationService
    {
        Task<FormationResponseDTO> CreateFormationAsync(FormationCreateDTO formationCreateDto);
        Task<IEnumerable<FormationResponseDTO>> GetAllFormationsAsync();
        Task<FormationResponseDTO> GetFormationByIdAsync(int id);
        Task<bool> DeleteFormationAsync(int id);
        Task<FormationResponseDTO> UpdateFormationAsync(int id, FormationCreateDTO formationCreateDto);
    }
}

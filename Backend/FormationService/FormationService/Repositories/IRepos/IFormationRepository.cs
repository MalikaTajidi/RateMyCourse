using FormationService.dto;
using FormationService.Models;

namespace FormationService.Repositories.IRepos
{
    public interface IFormationRepository
    {
        Task<Formation> CreateFormationAsync(Formation formation, List<string> niveauNames, List<string> moduleNames);
        Task<IEnumerable<Formation>> GetAllFormationsAsync();
        Task<Formation?> GetFormationByIdAsync(int id);
        Task<bool> DeleteFormationAsync(int id);
        //Task<Formation?> UpdateFormationAsync(int id, Formation formation, List<string> moduleNames);
        Task<Formation> GetFormationWithModulesByIdAsync(int id);
        //Task<Module> GetModuleByNameAsync(string name);
        Task<Formation?> UpdateFormationAsync(int id, Formation formation, List<ModuleUpdateDTO> moduleNames, bool updateNiveauNames);

        Task<IEnumerable<Formation>> SearchFormationsAsync(string? keyword);

    }
}

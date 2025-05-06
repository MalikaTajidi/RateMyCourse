using FormationService.Models;

namespace FormationService.Repositories.IRepos
{
    public interface IFormationRepository
    {
        Task<Formation> CreateFormationAsync(Formation formation, string formationName, List<string> moduleNames);
        Task<IEnumerable<Formation>> GetAllFormationsAsync();
        Task<Formation?> GetFormationByIdAsync(int id);
        Task<bool> DeleteFormationAsync(int id);
        Task<Formation?> UpdateFormationAsync(int id, Formation formation);
    }
}

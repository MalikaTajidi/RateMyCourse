using FormationService.Models;

namespace FormationService.Repositories.IRepos
{
    public interface IFormationRepository
    {
        Task<Formation> AddFormationAsync(Formation formation);
        Task<Formation> GetFormationByIdAsync(int id);
    }
}

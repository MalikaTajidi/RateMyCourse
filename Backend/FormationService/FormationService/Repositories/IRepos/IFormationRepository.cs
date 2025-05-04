using FormationService.Models;

namespace FormationService.Repositories.IRepos
{
    public interface IFormationRepository
    {
        Task<IEnumerable<Formation>> GetAllAsync();
        Task<Formation?> GetByIdAsync(int id);
        Task<IEnumerable<Formation>> SearchAsync(string? name, string? school);
        Task CreateAsync(Formation formation);
        Task UpdateAsync(Formation formation);
        Task DeleteAsync(Formation formation);
        Task<bool> SaveChangesAsync();
    }
}

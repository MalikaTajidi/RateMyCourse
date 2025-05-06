using FormulaireService;
using FormulaireService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly FormulaireDbContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(FormulaireDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<T> GetByIdAsync(object id) => await _dbSet.FindAsync(id);

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await SaveAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await SaveAsync();
    }

    public async Task DeleteAsync(object id)
    {
        var entity = await GetByIdAsync(id);
        _dbSet.Remove(entity);
        await SaveAsync();
    }

    public async Task SaveAsync() => await _context.SaveChangesAsync();
}

using System;
using FormationService.Models;
using FormationService.Repositories.IRepos;
using Microsoft.EntityFrameworkCore;

namespace FormationService.Repositories.ImplRepos
{
    public class FormationRepository : IFormationRepository
    {
        private readonly FormationDbContext _context;

        public FormationRepository(FormationDbContext context)
        {
            _context = context;
        }

        public async Task<Formation> CreateFormationAsync(Formation formation, List<string> niveauNames, List<string> moduleNames)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                
                if (formation.ModuleFormations == null)
                {
                    formation.ModuleFormations = new List<ModuleFormation>();
                }

                // Step 1: Save the Formation with FormationName
                await _context.Formations.AddAsync(formation);
                await _context.SaveChangesAsync();

                // Step 2: Create or get modules
                var modules = new List<Module>();
                foreach (var moduleName in moduleNames)
                {
                    var module = await _context.Modules.FirstOrDefaultAsync(m => m.Name == moduleName);
                    if (module == null)
                    {
                        module = new Module
                        {
                            Name = moduleName,
                            ModuleFormations = new List<ModuleFormation>() // Initialiser la collection ModuleFormations
                        };
                        await _context.Modules.AddAsync(module);
                        await _context.SaveChangesAsync();
                    }
                    modules.Add(module);
                }

                // Step 3: Create the three niveaux from the FormationName
                var niveaux = new List<Niveau>();
                foreach (var niveauName in niveauNames)
                {
                    var niveau = new Niveau
                    {
                        Name = niveauName,
                        ModuleFormations = new List<ModuleFormation>() // Initialiser la collection ModuleFormations
                    };
                    await _context.Niveaux.AddAsync(niveau);
                    await _context.SaveChangesAsync();
                    niveaux.Add(niveau);
                }

                // Step 4: Create the relationships in ModuleFormation table
                foreach (var module in modules)
                {
                    foreach (var niveau in niveaux)
                    {
                        var moduleFormation = new ModuleFormation
                        {
                            FormationId = formation.FormationId,
                            Formation = formation,
                            ModuleId = module.ModuleId,
                            Module = module,
                            NiveauId = niveau.NiveauId,
                            Niveau = niveau
                        };

                        // Ajout aux collections de navigation
                        formation.ModuleFormations.Add(moduleFormation);
                        module.ModuleFormations.Add(moduleFormation);
                        niveau.ModuleFormations.Add(moduleFormation);

                        await _context.ModuleFormations.AddAsync(moduleFormation);
                    }
                }
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                // Return the formation with relationships loaded
                return await GetFormationByIdAsync(formation.FormationId);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<Formation>> GetAllFormationsAsync()
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Module)
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Niveau)
                .ToListAsync();
        }

        public async Task<Formation?> GetFormationByIdAsync(int id)
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Module)
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Niveau)
                .FirstOrDefaultAsync(f => f.FormationId == id);
        }

        public async Task<bool> DeleteFormationAsync(int id)
        {
            var formation = await _context.Formations
                .Include(f => f.ModuleFormations)
                .FirstOrDefaultAsync(f => f.FormationId == id);

            if (formation == null)
                return false;

            // Remove ModuleFormation relationships
            _context.ModuleFormations.RemoveRange(formation.ModuleFormations);

            // Remove Formation
            _context.Formations.Remove(formation);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Formation?> UpdateFormationAsync(int id, Formation formation)
        {
            var existingFormation = await _context.Formations
                .FirstOrDefaultAsync(f => f.FormationId == id);

            if (existingFormation == null)
                return null;

            existingFormation.SchoolName = formation.SchoolName;
            existingFormation.Description = formation.Description;

            await _context.SaveChangesAsync();
            return existingFormation;
        }
    }
}



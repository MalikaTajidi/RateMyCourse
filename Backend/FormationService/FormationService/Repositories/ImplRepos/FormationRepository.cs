using System;
using FormationService.dto;
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
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Charger la formation avec TOUTES ses relations
                var formation = await _context.Formations
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Module)
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Niveau)
                    .FirstOrDefaultAsync(f => f.FormationId == id);

                if (formation == null)
                    return false;

                // 2. Collecter tous les éléments à supprimer
                var moduleFormations = formation.ModuleFormations.ToList();
                var modules = moduleFormations.Select(mf => mf.Module).Distinct().ToList();
                var niveaux = moduleFormations.Select(mf => mf.Niveau).Distinct().ToList();

                // 3. Supprimer les relations ModuleFormation
                _context.ModuleFormations.RemoveRange(moduleFormations);

                // 4. Supprimer la formation
                _context.Formations.Remove(formation);

                // 5. Supprimer les niveaux spécifiques à cette formation
                foreach (var niveau in niveaux)
                {
                    // Vérifier si le niveau appartient exclusivement à cette formation
                    var isNiveauUsedElsewhere = await _context.ModuleFormations
                        .AnyAsync(mf => mf.NiveauId == niveau.NiveauId && mf.FormationId != id);

                    if (!isNiveauUsedElsewhere && niveau.Name.StartsWith(formation.FormationName))
                    {
                        _context.Niveaux.Remove(niveau);
                    }
                }

                // 6. Supprimer les modules orphelins
                foreach (var module in modules)
                {
                        _context.Modules.Remove(module);
                    
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Loguer l'erreur (ex)
                throw;
            }
        }

        public async Task<Formation?> UpdateFormationAsync(int id, Formation formation, List<dto.ModuleUpdateDTO> moduleUpdates, bool updateNiveauNames)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingFormation = await _context.Formations
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Module)
                    .Include(f => f.ModuleFormations)
                        .ThenInclude(mf => mf.Niveau)
                    .FirstOrDefaultAsync(f => f.FormationId == id);

                if (existingFormation == null)
                    return null;

                // Mise à jour des propriétés de base de la formation
                existingFormation.FormationName = formation.FormationName;
                existingFormation.SchoolName = formation.SchoolName;
                existingFormation.Description = formation.Description;

                // Obtenir les niveaux existants pour cette formation
                var existingNiveaux = existingFormation.ModuleFormations
                    .Select(mf => mf.Niveau)
                    .DistinctBy(n => n.NiveauId)
                    .ToList();

                // Si le nom de formation a changé, mettre à jour les noms des niveaux
                if (updateNiveauNames)
                {
                    // Trouver les noms de niveau avec le format "Ancien Nom Formation X"
                    var oldFormationName = existingFormation.FormationName;

                    foreach (var niveau in existingNiveaux)
                    {
                        // Vérifier si le nom du niveau commence par l'ancien nom de formation
                        // OU si le niveau suit le format de nom standard "NomFormation X"
                        if (niveau.Name.StartsWith(oldFormationName) ||
                            (niveau.Name.Contains("1") || niveau.Name.Contains("2") || niveau.Name.Contains("3")))
                        {
                            // Extraire le suffixe (comme " 1", " 2", " 3")
                            string suffix = "";
                            if (niveau.Name.EndsWith("1")) suffix = " 1";
                            else if (niveau.Name.EndsWith("2")) suffix = " 2";
                            else if (niveau.Name.EndsWith("3")) suffix = " 3";

                            // Mettre à jour le nom de niveau avec le nouveau nom de formation
                            niveau.Name = formation.FormationName + suffix;
                        }
                    }
                }

                // Get all existing modules for this formation
                var existingModules = existingFormation.ModuleFormations
                    .Select(mf => mf.Module)
                    .DistinctBy(m => m.ModuleId)
                    .ToList();

                // Validate module updates
                if (moduleUpdates.Count != existingModules.Count)
                {
                    throw new InvalidOperationException("Number of modules must remain the same. Only name updates are allowed.");
                }

                // Update module names
                foreach (var moduleUpdate in moduleUpdates)
                {
                    var moduleToUpdate = existingModules.FirstOrDefault(m => m.ModuleId == moduleUpdate.ModuleId);
                    if (moduleToUpdate == null)
                    {
                        throw new KeyNotFoundException($"Module with ID {moduleUpdate.ModuleId} not found in this formation");
                    }

                    // Update the module name
                    moduleToUpdate.Name = moduleUpdate.Name;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetFormationByIdAsync(id);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<Formation> GetFormationWithModulesByIdAsync(int id)
        {
            return await _context.Formations
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Module)
                .Include(f => f.ModuleFormations)
                    .ThenInclude(mf => mf.Niveau)
                .FirstOrDefaultAsync(f => f.FormationId == id);
        }

        public async Task<Module> GetModuleByNameAsync(string name)
        {
            return await _context.Modules
                .FirstOrDefaultAsync(m => m.Name == name);
        }

        public async Task<IEnumerable<Formation>> SearchFormationsAsync(string? keyword)
        {
            return await _context.Formations
                .Where(f =>
                    string.IsNullOrEmpty(keyword) ||
                    f.SchoolName.Contains(keyword) ||
                    f.FormationName.Contains(keyword) ||
                    f.Description.Contains(keyword)
                )
                .ToListAsync();
        }

        public async Task<IEnumerable<ModuleByNiveauResponse>> GetModulesByNiveauIdAsync(int niveauId)
        {
           return await _context.ModuleFormations
        .Where(mf => mf.NiveauId == niveauId)
        .Select(mf => new ModuleByNiveauResponse
        {
            ModuleId = mf.Module.ModuleId,
            ModuleName = mf.Module.Name,
            //ModuleDescription = mf.Module.Description,
            Filiere = mf.Formation.FormationName 
        })
        .Distinct()
        .ToListAsync();
        }
    }
}



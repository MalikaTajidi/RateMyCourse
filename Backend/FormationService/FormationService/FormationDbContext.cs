using FormationService.Models;
using Microsoft.EntityFrameworkCore;

namespace FormationService
{
    public class FormationDbContext : DbContext
    {
        public FormationDbContext(DbContextOptions<FormationDbContext> options)
    : base(options)
        {
        }

        public DbSet<Formation> Formations { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Niveau> Niveaux { get; set; }
        public DbSet<ModuleFormation> ModuleFormations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ModuleFormation>()
                .HasKey(mf => new { mf.FormationId, mf.ModuleId, mf.NiveauId });

            modelBuilder.Entity<ModuleFormation>()
                .HasOne(mf => mf.Formation)
                .WithMany(f => f.ModuleFormations)
                .HasForeignKey(mf => mf.FormationId);

            modelBuilder.Entity<ModuleFormation>()
                .HasOne(mf => mf.Module)
                .WithMany(m => m.ModuleFormations)
                .HasForeignKey(mf => mf.ModuleId);

            modelBuilder.Entity<ModuleFormation>()
                .HasOne(mf => mf.Niveau)
                .WithMany(n => n.ModuleFormations)
                .HasForeignKey(mf => mf.NiveauId);
        }
    }
}


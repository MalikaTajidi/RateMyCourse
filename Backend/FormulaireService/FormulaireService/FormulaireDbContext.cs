using FormulaireService.Models;
using Microsoft.EntityFrameworkCore;

namespace FormulaireService
{
    public class FormulaireDbContext : DbContext
    {
        public FormulaireDbContext(DbContextOptions<FormulaireDbContext> options)
            : base(options) { }

        public DbSet<Formulaire> Formulaires { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<SectionFormulaire> SectionFormulaires { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurer la relation entre Formulaire et SectionFormulaire avec suppression en cascade
            modelBuilder.Entity<SectionFormulaire>()
                .HasOne(s => s.Formulaire)  // Chaque SectionFormulaire appartient à un Formulaire
                .WithMany(f => f.Sections)  // Un Formulaire contient plusieurs SectionFormulaires
                .HasForeignKey(s => s.FormulaireId)
                .OnDelete(DeleteBehavior.Cascade);  // Suppression en cascade

            // Configurer la relation entre SectionFormulaire et Question avec suppression en cascade
            modelBuilder.Entity<Question>()
                .HasOne<SectionFormulaire>()  // Chaque Question appartient à une SectionFormulaire
                .WithMany(s => s.Questions)  // Une SectionFormulaire contient plusieurs Questions
                .HasForeignKey(q => q.SectionFormId)  // Utilise la clé étrangère SectionFormId
                .OnDelete(DeleteBehavior.Cascade);  // Suppression en cascade
        }
    }
}

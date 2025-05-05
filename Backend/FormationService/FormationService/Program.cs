using FormationService;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Formation Service API", Version = "v1" });
});

// Add DbContext configuration 
builder.Services.AddDbContext<FormationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddScoped<FormationService.services.interfaces.IFormationService, FormationService.services.Impl.FormationService>();

builder.Services.AddScoped<FormationService.Repositories.IRepos.IFormationRepository, FormationService.Repositories.ImplRepos.FormationRepository>();

var app = builder.Build();

// Enable Swagger middleware (in all environments)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Formation Service API v1");
    c.RoutePrefix = "swagger"; // Default, but you can change it
});

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();

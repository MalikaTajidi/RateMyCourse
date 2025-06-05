using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Charger le fichier de configuration Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Ajouter les services Ocelot
builder.Services.AddOcelot();

var app = builder.Build();

// Utiliser Ocelot comme middleware
await app.UseOcelot();

app.Run();

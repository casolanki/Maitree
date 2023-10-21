using API.Extensions;


var builder = WebApplication.CreateBuilder(args);

//Add builder.services to container
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddCors();
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddSignalR(); // For chat 

var connString= "";
if (builder.Environment.IsDevelopment()) 
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
else 
{
// Use connection string provided at runtime by Flyio.
        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        // Parse connection URL to connection string for Npgsql
        connUrl = connUrl.Replace("postgres://", string.Empty);
        var pgUserPass = connUrl.Split("@")[0];
        var pgHostPortDb = connUrl.Split("@")[1];
        var pgHostPort = pgHostPortDb.Split("/")[0];
        var pgDb = pgHostPortDb.Split("/")[1];
        var pgUser = pgUserPass.Split(":")[0];
        var pgPass = pgUserPass.Split(":")[1];
        var pgHost = pgHostPort.Split(":")[0];
        var pgPort = pgHostPort.Split(":")[1];
	var updatedHost = pgHost.Replace("flycast", "internal");

        connString = $"Server={updatedHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseNpgsql(connString);
});

///Configure the HTTP Request Pipline
///
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors(policy => policy
.AllowAnyHeader()
.AllowCredentials() // For SigleR Chat
.AllowAnyMethod()
.WithOrigins("https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence"); // For Online Presence 
app.MapHub<MessageHub>("hubs/message"); // For Message Chat 
app.MapFallbackToController("Index", "Fallback");

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.ClearConnectoin(context);
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

await app.RunAsync();  












// namespace API
// {
//     public class Program
//     {
//         public static async Task Main(string[] args)
//         {
//             //Below bunch of code for generatepending migration and update database
//             //on Start of dotnet application

//             AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior",true);
//             var host = CreateHostBuilder(args).Build();
//             using var scope = host.Services.CreateScope();
//             var builder.services = scope.ServiceProvider;
//             try
//             {
//                 var context = builder.services.GetRequiredService<DataContext>();
//                 var userManager = builder.services.GetRequiredService<UserManager<AppUser>>();
//                 var roleManager = builder.services.GetRequiredService<RoleManager<AppRole>>();
//                 await context.Database.MigrateAsync();
//                 await Seed.SeedUsers(userManager,roleManager);
//             }
//             catch (Exception ex)
//             {
//                 var logger = builder.services.GetRequiredService<ILogger<Program>>();
//                 logger.LogError(ex, "An error occurred during migration");
//             }

//             //this method run the host and start dotnet application
//             await host.RunAsync();
//         }

//         public static IHostBuilder CreateHostBuilder(string[] args) =>
//             Host.CreateDefaultBuilder(args)
//                 .ConfigureWebHostDefaults(webBuilder =>
//                 {
//                     webBuilder.UseStartup<Startup>();
//                 });
//     }
// }

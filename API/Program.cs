using API.Extensions;


var builder = WebApplication.CreateBuilder(args);

//Add builder.services to container
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddCors();
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddSignalR(); // For chat 

///Configure the HTTP Request Pipline

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

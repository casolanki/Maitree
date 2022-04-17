using System;
using System.Threading.Tasks;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    /*   IAsyncActionFilter : Used to filter action result/API result
     befor or after excution of request whereby context is used to filter before 
     and next used for apply filter on result after execution    */
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();
            var uow = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();            
            var user = await uow.UserRepository.GetUserByIdAsync(userId);           
            user.LastActive = DateTime.UtcNow;
            await uow.Complete();
        }
    }
}
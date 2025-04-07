using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ASP.NETCoreWebApp.Pages.Authentication
{
    public class LogoutModel : PageModel
    {
        public async void OnGet()
        {
            HttpContext.Session.Remove("Username");
            HttpContext.Session.Remove("TwoFactorEmail");
            await HttpContext.SignOutAsync("MyCookieAuth");
        }
    }
}

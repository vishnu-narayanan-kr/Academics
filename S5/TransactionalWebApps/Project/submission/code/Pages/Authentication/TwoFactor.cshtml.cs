using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;

namespace ASP.NETCoreWebApp.Pages.Authentication
{
    public class TwoFactorModel : PageModel
    {
        [BindProperty]
        public string TwoFactorCode { get; set; }

        public string ErrorMessage { get; set; }

        public IActionResult OnGet()
        {
            // Ensure that the session contains the 2FA details.
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("TwoFactorCode")) ||
                string.IsNullOrEmpty(HttpContext.Session.GetString("TwoFactorEmail")))
            {
                // If not, redirect back to login.
                return RedirectToPage("Login");
            }
            return Page();
        }

        public async void OnPost()
        {
            var storedCode = HttpContext.Session.GetString("TwoFactorCode");
            var storedExpiryStr = HttpContext.Session.GetString("TwoFactorExpiry");

            if (string.IsNullOrEmpty(storedCode) || string.IsNullOrEmpty(storedExpiryStr))
            {
                ErrorMessage = "Session expired. Please log in again.";
                Response.Redirect("/Authentication/Login");
            }

            // Check if the code has expired
            if (DateTime.TryParse(storedExpiryStr, out DateTime expiryTime))
            {
                if (DateTime.UtcNow > expiryTime)
                {
                    ErrorMessage = "The verification code has expired. Please log in again.";
                    Response.Redirect("/Authentication/Login");
                }
            }

            // Compare the entered code with the stored code
            if (TwoFactorCode == storedCode)
            {
                // 2FA successful - clear the 2FA session data and mark the user as authenticated.
                HttpContext.Session.Remove("TwoFactorCode");
                HttpContext.Session.Remove("TwoFactorExpiry");
                string? username = HttpContext.Session.GetString("Username");
                // You can now create an authentication cookie or set a session variable to represent a logged-in user.
                // Create a list of claims
                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, username)
                                // You can add additional claims as needed.
                            };

                // Create a ClaimsIdentity with the specified authentication scheme.
                var claimsIdentity = new ClaimsIdentity(claims, "MyCookieAuth");

                // Create the principal
                var principal = new ClaimsPrincipal(claimsIdentity);

                // Sign in the user with the authentication scheme
                await HttpContext.SignInAsync("MyCookieAuth", principal);

                Response.Redirect("/Clients/Index");
            }
            else
            {
                ErrorMessage = "Invalid verification code. Please try again.";
                Response.Redirect("/Authentication/TwoFactor");
            }
        }
    }
}

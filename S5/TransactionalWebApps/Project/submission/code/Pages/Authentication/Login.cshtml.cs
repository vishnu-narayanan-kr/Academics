using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace ASP.NETCoreWebApp.Pages.Authentication
{
    public class LoginModel : PageModel
    {
        public String username = "";
        public String password = "";
        public String errorMessage = "";

        private readonly EmailService _emailService;

        public LoginModel()
        {
            _emailService = new EmailService();
        }
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                username = Request.Form["username"];
                password = Request.Form["password"];

                // save to DB
                string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    String sql = "SELECT TOP (1) * FROM users " +
                        "WHERE username = '" + username + "';";

                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        SqlDataReader reader = cmd.ExecuteReader();

                        if (reader.Read() && BCrypt.Net.BCrypt.Verify(password, ((string)reader["password"]).Trim()))
                        {
                            // Generate a 6-digit 2FA code
                            var random = new Random();
                            var twoFactorCode = random.Next(100000, 999999).ToString();
                            string email = (string)reader["email"];

                            // Store the code and expiry time in session
                            HttpContext.Session.SetString("TwoFactorCode", twoFactorCode);
                            HttpContext.Session.SetString("TwoFactorEmail", email);
                            HttpContext.Session.SetString("Username", username);
                            HttpContext.Session.SetString("TwoFactorExpiry", DateTime.UtcNow.AddMinutes(5).ToString());

                            // Send the code via email
                            await _emailService.SendEmailAsync(email, "Your 2FA Code", $"Your verification code is: {twoFactorCode}");

                            // Redirect to the 2FA verification page
                            return RedirectToPage("/Authentication/TwoFactor");
                        }
                        else {
                            errorMessage = "Username or Password ERROR";
                        }
                    }
                }

                username = "";
                password = "";
            }
            catch (Exception ex)
            {
                // errorMessage = ex.Message;
                errorMessage = "something went wrong";
            }
            return RedirectToPage();
        }
    }
}

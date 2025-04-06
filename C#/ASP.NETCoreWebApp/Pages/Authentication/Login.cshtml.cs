using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using System.Security.Claims;

namespace ASP.NETCoreWebApp.Pages.Authentication
{
    public class LoginModel : PageModel
    {
        public String username = "";
        public String password = "";
        public String errorMessage = "";
        public async void OnPost()
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
                errorMessage = ex.Message;
            }
        }
    }
}

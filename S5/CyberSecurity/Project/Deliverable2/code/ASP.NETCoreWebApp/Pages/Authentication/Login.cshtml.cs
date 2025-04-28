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
        public void OnPost()
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

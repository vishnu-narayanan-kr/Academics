using ASP.NETCoreWebApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace ASP.NETCoreWebApp.Pages.Authentication
{
    public class RegisterModel : PageModel
    {
        public String username = "";
        public String password = "";
        public String email = "";
        public void OnPost()
        {
            try
            {

                username = Request.Form["username"];
                password = Request.Form["password"];
                email = Request.Form["email"];


                // save to DB
                string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    String sql = "INSERT INTO users" +
                        "(username, email, password)" +
                        " VALUES" +
                        "(@username, @email, @password);";

                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.Parameters.AddWithValue("@username", username);
                        cmd.Parameters.AddWithValue("@email", email);
                        cmd.Parameters.AddWithValue("@password", password);

                        cmd.ExecuteNonQuery();
                    }
                }

                username = "";
                email = "";
                password = "";

                Response.Redirect("/Clients/Index");
            }
            catch (Exception ex)
            {
            }
        }
    }
}

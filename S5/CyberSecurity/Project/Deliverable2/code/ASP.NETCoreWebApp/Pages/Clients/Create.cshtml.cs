using ASP.NETCoreWebApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace ASP.NETCoreWebApp.Pages.Clients
{
    public class CreateModel : PageModel
    {
        public Student student = new Student();
        public String errorMessage = "";
        public String successMessage = "";
        public void OnPost() {
            try
            {

                student.name = Request.Form["name"];
                student.course = Request.Form["course"];
                student.email = Request.Form["email"];
                student.year = Convert.ToInt32(Request.Form["year"]);

                if (student.name.Length == 0 || student.course.Length == 0
                    || student.email.Length == 0 || student.year.Value < 2000)
                {
                    errorMessage = "Values can't be empty or invalid";
                    return;
                }

                // save to DB
                string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

                using(SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    String sql = "INSERT INTO STUDENTS" +
                        "(name, course, year, email)" +
                        " VALUES" +
                        "(@name, @course, @year, @email);";

                    using(SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.Parameters.AddWithValue("@name", student.name);
                        cmd.Parameters.AddWithValue("@course", student.course);
                        cmd.Parameters.AddWithValue("@year", student.year);
                        cmd.Parameters.AddWithValue("@email", student.email);

                        cmd.ExecuteNonQuery();
                    }
                }

                student.name = "";
                student.course = "";
                student.email = "";
                student.year = 2024;

                successMessage = "Student added succesfully!";
                Response.Redirect("/Clients/Index");
            } catch (Exception ex)
            {
                errorMessage = ex.Message;
            }
        }
    }
}

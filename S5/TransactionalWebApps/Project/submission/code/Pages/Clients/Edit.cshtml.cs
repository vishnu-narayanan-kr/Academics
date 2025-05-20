using ASP.NETCoreWebApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace ASP.NETCoreWebApp.Pages.Clients
{
    public class EditModel : PageModel
    {
        public Student student = new Student();
        public String successMessage = "";
        public String errorMessage = "";
        string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

        public void OnGet()
        {
            String id = Request.Query["id"];

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    String sql = "SELECT * FROM students WHERE id=@id";

                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.Parameters.AddWithValue("@id", id);

                        using(SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if(reader.Read())
                            {
                                student.id = reader.GetInt32(0);
                                student.name = reader.GetString(1);
                                student.course = reader.GetString(2);
                                student.year = reader.GetInt32(3);
                                student.email = reader.GetString(4);
                            }
                        }
                    }
                }
            } catch (Exception ex) {
                errorMessage = ex.Message;
            }
        }

        public void OnPost() {
            try
            {
                student.name = Request.Form["name"];
                student.course = Request.Form["course"];
                student.email = Request.Form["email"];
                student.year = Convert.ToInt32(Request.Form["year"]);
                student.id = Convert.ToInt32(Request.Form["id"]);

                if (student.name.Length == 0 || student.course.Length == 0
                    || student.email.Length == 0 || student.year.Value < 2000)
                {
                    errorMessage = "Values can't be empty or invalid";
                    return;
                }

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    String sql = "UPDATE STUDENTS " +
                        "SET " +
                        "name=@name, email=@email, year=@year, course=@course " +
                        "WHERE " +
                        "id=@id";

                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.Parameters.AddWithValue("@name", student.name);
                        cmd.Parameters.AddWithValue("@course", student.course);
                        cmd.Parameters.AddWithValue("@year", student.year);
                        cmd.Parameters.AddWithValue("@email", student.email);
                        cmd.Parameters.AddWithValue("@id", student.id);

                        cmd.ExecuteNonQuery();
                    }
                }

                Response.Redirect("/Clients/Index");
            }
            catch (Exception ex) {
                errorMessage = ex.Message;
            }
        }
    }
}

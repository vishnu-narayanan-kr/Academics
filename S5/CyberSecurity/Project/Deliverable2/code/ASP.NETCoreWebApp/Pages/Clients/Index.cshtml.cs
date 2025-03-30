using ASP.NETCoreWebApp.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace ASP.NETCoreWebApp.Pages.Clients
{
    public class IndexModel : PageModel
    {
        public List<Student> students = new List<Student>();

        public string yearFilter = "0";
        public void OnGet()
        {
            try
            {
                string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string sql = "SELECT * FROM STUDENTS";

                    yearFilter = Request.Query["year"].ToString();

                    if (!yearFilter.IsNullOrEmpty())
                    {
                        sql = "SELECT * FROM STUDENTS WHERE year = '" + yearFilter +"';";
                    }

                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                students.Add(new Student
                                {
                                    id = Convert.ToInt32(reader["id"]),
                                    name = reader["name"].ToString(),
                                    course = reader["course"].ToString(),
                                    year = Convert.ToInt32(reader["year"]),
                                    email = reader["email"].ToString()
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

    }
}

using JayFirstProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace JayFirstProject.Views.Home
{
    public class StudentListModel : PageModel
    {
        List<Student> students = new List<Student>();
        public void OnGet()
        {

            try
            {
                string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string sql = "SELECT * FROM STUDENTS";

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

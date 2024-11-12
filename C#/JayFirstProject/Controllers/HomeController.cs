using JayFirstProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Diagnostics;

namespace JayFirstProject.Controllers
{
    public class HomeController : Controller
    {
        private string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            List<Student> students = new List<Student>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string sqlQuery = "SELECT * FROM Students";
                SqlCommand cmd = new SqlCommand(sqlQuery, con);
                SqlDataReader reader = cmd.ExecuteReader();

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

                reader.Close();
            }

            return View(students);
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

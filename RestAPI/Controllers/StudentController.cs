using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using RestAPI.Models;

namespace RestAPI.Controllers
{
    // need to give the path of the API and define API Controller
    [Route("api/[controller]")] // this will put the controller name in the api path
    // API path
    [ApiController]
    public class StudentController : ControllerBase
    {
        // integration configuration
        private readonly IConfiguration _configuration;

        // Sql Connection ADD initialization
        private SqlConnection con;

        // Perform database query and operation
        private DatabaseApp app;

        public StudentController(IConfiguration configuration) {
            this._configuration = configuration;

            app = new DatabaseApp();
            con = new SqlConnection(this._configuration
                .GetConnectionString("studentConnection"));
        }


        // Add Student API
        [HttpPost]
        [Route("AddStudent")] // this is API name
        // create the API body

        public Response AddStudent(Student std)
        {
            return app.AddStudent(con, std);
        }

        // Retrieve list of students
        [HttpGet]
        [Route("GetAllStudents")]
        
        public Response GetAllStudents()
        {
            return app.GetAllStudents(con);
        }
    }
}

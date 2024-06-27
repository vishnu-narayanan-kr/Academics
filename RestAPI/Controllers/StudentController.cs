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
        public StudentController(IConfiguration configuration) {
            this._configuration = configuration;
        }

        // Add Student API
        [HttpPost]
        [Route("AddStudent")] // this is API name
        // create the API body

        public Response AddStudent(Student std)
        {
            // Sql Connection ADD initialization
            SqlConnection con = new SqlConnection(this._configuration
                .GetConnectionString("studentConnection"));

            // Perform database query and operation
            DatabaseApp app = new DatabaseApp();

            return app.AddStudent(con, std);
        }
    }
}

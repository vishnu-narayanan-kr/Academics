package webHelloREST;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("HiHi") // specify the URL path
public class HelloResource {
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String sayHello() {
		return "Hello, Everyone!  ";
	}
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String sayHTMLHello() {
		return "<html>Hello REST</html>";
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public University sayJSONHello() {
		return new University("Montréal", 2024, 5);
	}
	
	@Path("/specify/{Name}")
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String sayParameterHello(@PathParam("Name") String name) {
		return "Hello from " + name;
	}
	
	@Path("/specifyParameter")
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String sayHTMLClientParameterHello(@QueryParam("empId") String id, @QueryParam("empName") String name, @QueryParam("empSalary") String salary) {
		return "Employee Details, ID: " + id + ", Name: " + name + ", Salary: " + salary;
	}
}

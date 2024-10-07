package facultyProject;

import java.io.IOException;
import java.io.PrintStream;
import java.util.HashMap;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class WebFacultyServlet
 */
@WebServlet("/WebFacultyServlet")
public class WebFacultyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private HashMap<Integer, Faculty> facultyHashMap = new HashMap<Integer, Faculty>();
	
    /**
     * Default constructor. 
     */
    public WebFacultyServlet() {
    	facultyHashMap.put(370, new Faculty(370, "Denkan", "Anais", 95000.0, 1.5));
    	facultyHashMap.put(212, new Faculty(212, "Smith", "Neal", 40000.0, 3.0));
    	facultyHashMap.put(101, new Faculty(101, "Robertson", "Myra", 60000.0, 2.5));
    	facultyHashMap.put(857, new Faculty(857, "Fillipo", "Paul", 30000.0, 5.0));
    	facultyHashMap.put(315, new Faculty(315, "Arlec", "Lisa", 55000.0, 1.5));
    	facultyHashMap.put(365, new Faculty(365, "Kirach", "Sarah", 90000.0, 1.5));
    }
    
    /*
     * 		out.println("<>");
	 *	    out.println("</>");
     * 
     * */

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		PrintStream out = new PrintStream(response.getOutputStream());
		
		out.println("Print Faculty Keys collection using Lambda expression");
		out.println("<table border=\"1\">");
			out.println("<thead>");
				out.println("<th>Faculty ID</th>");
			out.println("</thead>");
			out.println("<tbody>");
				facultyHashMap.forEach((k, v) -> out.println("<tr><td>" + k + "</td></tr>"));
			out.println("</tbody>");
		out.println("</table>");
		out.println("<br/>");
		
		out.println("Print Faculty Records");
		out.println("<table border=\"1\">");
			out.println("<thead>");
				out.println("<th>Faculty ID</th>");
				out.println("<th>Faculty LName</th>");
				out.println("<th>Faculty FName</th>");
				out.println("<th>Faculty Salary</th>");
				out.println("<th>Faculty Bonus Rate</th>");
				out.println("<th>Faculty Total Bonus</th>");
			out.println("</thead>");
			out.println("<tbody>");
				facultyHashMap.forEach((k, v) -> {
					out.println("<tr>");
						out.print("<td>" + k + "</td>");
						out.print("<td>" + v.getF_Lname() + "</td>");
						out.print("<td>" + v.getF_Fname() + "</td>");
						out.print("<td>" + v.getF_Salary() + "$</td>");
						out.print("<td>" + v.getf_Bonus() + "%</td>");
						out.print("<td>" + v.calculate_Bonus() + "$</td>");
					out.println("</tr>");
				});
			out.println("</tbody>");
		out.println("</table>");
		out.println("<br/>");
		
		out.println("<b>The total Faculty Bonus: </b>" + facultyHashMap.values().stream().mapToDouble(Faculty::calculate_Bonus).sum());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

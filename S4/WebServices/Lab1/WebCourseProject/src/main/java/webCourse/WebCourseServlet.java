package webCourse;

import java.io.IOException;
import java.io.PrintStream;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class WebCourseServlet
 */
@WebServlet("/WebCourseServlet")
public class WebCourseServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public WebCourseServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Course[] CourseRecords = new Course[7];
		
		for(int i = 0; i < 7; i++) {
			CourseRecords[i] = new Course();
		}
		
		CourseRecords[0].setCourse_no("MIS 101");
		CourseRecords[0].setCourse_name("Intro. to Info. Systems");
		CourseRecords[0].setMax_enrl(140);
		
		CourseRecords[1].setCourse_no("MIS 301");
		CourseRecords[1].setCourse_name("Systems Analysis");
		CourseRecords[1].setMax_enrl(35);
		
		CourseRecords[2].setCourse_no("MIS 441");
		CourseRecords[2].setCourse_name("Database Management");
		CourseRecords[2].setMax_enrl(12);
		
		CourseRecords[3].setCourse_no("CS 155");
		CourseRecords[3].setCourse_name("Programming in C++");
		CourseRecords[3].setMax_enrl(90);
		
		CourseRecords[4].setCourse_no("MIS 451");
		CourseRecords[4].setCourse_name("Web-Based Systems");
		CourseRecords[4].setMax_enrl(30);
		
		CourseRecords[5].setCourse_no("MIS 551");
		CourseRecords[5].setCourse_name("Advanced Web");
		CourseRecords[5].setMax_enrl(30);
		
		CourseRecords[6].setCourse_no("MIS 651");
		CourseRecords[6].setCourse_name("Advanced Java");
		CourseRecords[6].setMax_enrl(30);
		
		response.setContentType("text/html");
		PrintStream out = new PrintStream(response.getOutputStream());
		
		out.print("<table border=\"1\">");
		
		out.print("<thead>");
			out.print("<th>Course Number</th>");
			out.print("<th>Course Name</th>");
			out.print("<th>Max Enrolment</th>");
			out.print("<th>Credits</th>");
			out.print("<th>Total Course Fees</th>");
		out.print("</thead>");
		
		double totalCourseFees = 0.00;
		
		out.print("<tbody>");
		for(int i = 0; i < CourseRecords.length; i++) {
			double fees = CourseRecords[i].CalculateTotalFees();
			totalCourseFees += fees;
			
			out.print("<tr>");
				out.print("<td>" + CourseRecords[i].getCourse_no() + "</td>");
				out.print("<td>" + CourseRecords[i].getCourse_name() + "</td>");
				out.print("<td>" + CourseRecords[i].getMax_enrl() + "</td>");
				out.print("<td>" + Course.credits + "</td>");
				out.print("<td>" + Math.round(fees * 100) / 100.00 + "$</td>");
			out.print("</tr>");
		} 
		out.print("</tbody>");
		
		out.println("</table>");
		
		out.println("<b>The Total of Billing is: " + Math.round(totalCourseFees * 100) / 100.00 + "$</b>");
		
		out.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

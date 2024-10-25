package webCourseREST;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.stream.Collectors;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("WebCourse")
public class WebCourseResource {
		ArrayList<Course> courseList = new ArrayList<Course>();
		
		WebCourseResource() {
			try {
				Scanner inFile = new Scanner(new File("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/Lab3/WebCourseRESTProject/src/main/java/webCourseREST/Course.in"));
			
				inFile.useDelimiter("[\t\r\n]+");
				
				while(inFile.hasNext()) {
					String number = inFile.next();
					String name = inFile.next();
					inFile.nextInt();
					int maxEnrolled = inFile.nextInt();
					
					Course course = new Course(number, name, maxEnrolled);
					courseList.add(course);
				}
				
				inFile.close();
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}
		}

		@GET
		@Produces(MediaType.TEXT_HTML)
		public String displayHTMLCourseInfo() {
			String outputHTML = "";
			
			outputHTML += "<html>";
			outputHTML += "<body>";

				
			outputHTML += "<h2>Print Course Elements of the ArrayList</h2>";
			outputHTML += "<table border=\"1\">";
			outputHTML += "<thead>";
				outputHTML += "<th>Course ID</th>";
				outputHTML += "<th>Course Name</th>";
				outputHTML += "<th>Max Enrollement</th>";
				outputHTML += "<th>Credits</th>";
				outputHTML += "<th>Total Course Fees</th>";
			outputHTML += "</thead>";
			outputHTML += "<tbody>";
				outputHTML += courseList.stream().map(v -> "<tr><td>"+ v.getCourse_no() + "</td><td>"+ v.getCourse_name()+ "</td><td>"+ v.getMax_enrl() + "</td><td>"+ Course.credits + "</td><td>"+ v.CalculateTotalFees() + "</td></tr>").collect(Collectors.joining("\n"));
			outputHTML += "</tbody>";
			outputHTML += "</table>";
			outputHTML += "<h3>The Total Course Fees is: " + courseList.stream().mapToDouble(Course::CalculateTotalFees).sum() + "$</h3>";
				
			outputHTML += "</body>";
			outputHTML += "</html>";
			
			return outputHTML;
		}

		@GET
		@Produces(MediaType.TEXT_PLAIN)
		public String displayTEXTCourseInfo() {
			String outputText = "";
			
			outputText += courseList.stream().map(Course::toString).collect(Collectors.joining("\n"));
			
			outputText += "\n\nThe Total Course Fees is: " + courseList.stream().mapToDouble(Course::CalculateTotalFees).sum();
			
			return outputText;
		}

		@Path("/searchCourse/{course_id}")
		@GET
		@Produces(MediaType.APPLICATION_JSON)
		public Course displayJSONCourseInfo(@PathParam("course_id") String id) {
			for(int i = 0; i < courseList.size(); i++) {
				if(courseList.get(i).getCourse_no().equals(id)) {
					return courseList.get(i);
				}
			}
			
			return null;
		}
		
		@Path("/totalCourseFees/{course_id}")
		@GET
		@Produces(MediaType.TEXT_PLAIN)
		public Double calculateTotalCourseFees(@PathParam("course_id") String id) {
			for(int i = 0; i < courseList.size(); i++) {
				if(courseList.get(i).getCourse_no().equals(id)) {
					return Double.parseDouble(courseList.get(i).CalculateTotalFees() + "");
				}
			}
			
			return 0.0;
		}
}

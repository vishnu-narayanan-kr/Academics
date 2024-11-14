package webCourseService;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.jws.soap.SOAPBinding.Style;

@WebService
@SOAPBinding(style = Style.RPC)
public class WebCourse {
	ArrayList<Course> courseList = new ArrayList<Course>();
	
	public WebCourse() {
		try {
			Scanner inFile = new Scanner(new File("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/_resources/Course.in"));
		
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
	
	@WebMethod(operationName = "DisplayCourseInfo")
	public String DisplayCourseInfo() {
		return courseList.toString();
	}
	
	@WebMethod(operationName = "SearchCourseInfo")
	public Course SearchCourseInfo(@WebParam(name = "id") String id) {
		for(int i = 0; i < courseList.size(); i++) {
			if(courseList.get(i).getCourse_no().equals(id)) {
				return courseList.get(i);
			}
		}
		
		return null;
	}
}

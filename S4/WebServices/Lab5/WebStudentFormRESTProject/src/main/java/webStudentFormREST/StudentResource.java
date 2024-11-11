package webStudentFormREST;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("WebStudent")
public class StudentResource {
	List<Student> students;
	
	public StudentResource() {
		students = new ArrayList<Student>();
		
		String filePath = "C:\\Users\\Dell\\Documents\\GitHub\\Academics\\S4\\WebServices\\Lab5\\WebStudentFormRESTProject\\Student.in";
		
		try {
			Scanner inFile = new Scanner(new FileReader(filePath));
			
			inFile.useDelimiter("[\t\r\n]+");
			
			while(inFile.hasNext()) {
				int id = inFile.nextInt();
				String lName = inFile.next();
				String fName = inFile.next();
				int gA1 = inFile.nextInt();
				int gA2 = inFile.nextInt();
				int gA3 = inFile.nextInt();
				int gMid = inFile.nextInt();
				int gFin = inFile.nextInt();
				int fId = inFile.nextInt();
				
				Student student = new Student(
							id,
							lName,
							fName,
							gA1,
							gA2,
							gA3,
							gMid,
							gFin,
							fId
						);
				
				students.add(student);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	@Path("AddNewStudent")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Student addNewStudent(
				@FormParam("id") int id,
				@FormParam("lname") String lname,
				@FormParam("fname") String fname,
				@FormParam("ga1") int ga1,
				@FormParam("ga2") int ga2,
				@FormParam("ga3") int ga3,
				@FormParam("gm") int gm,
				@FormParam("gf") int gf,
				@FormParam("fid") int fid
			) {
		
		Student student = new Student(
					id,
					lname,
					fname,
					ga1,
					ga2,
					ga3,
					gm,
					gf,
					fid
				);
		
		students.add(student);
		
		return student;
	}

	@Path("UpdateStudent")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Student updateStudent(
				@FormParam("id") int id,
				@FormParam("lname") String lname,
				@FormParam("fname") String fname,
				@FormParam("ga1") int ga1,
				@FormParam("ga2") int ga2,
				@FormParam("ga3") int ga3,
				@FormParam("gm") int gm,
				@FormParam("gf") int gf,
				@FormParam("fid") int fid
			) {
		
		Student student = new Student(
					id,
					lname,
					fname,
					ga1,
					ga2,
					ga3,
					gm,
					gf,
					fid
				);
		
		for(int i = 0; i < students.size(); i++) {
			if(students.get(i).getStudent_id() == id) {
				students.set(i, student);
				break;
			}
		}
		
		students.add(student);
		
		return student;
	}
	
	@Path("DeleteStudent")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String deleteStudent(
			@FormParam("id") int id
		) {
	
	for(int i = 0; i < students.size(); i++) {
		if(students.get(i).getStudent_id() == id) {
			students.remove(i);
			break;
		}
	}
	
	return "Student with id: " + id + " removed";
	}

	@Path("ListStudent")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String listStudent(@QueryParam("fid") int fid) {
		return students.stream().filter(s -> s.getFaculty_id() == fid).map(s -> s.toString()).collect(Collectors.joining("\n"));
	}
	
	@Path("SearchStudent")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String searchAsQPStudentInfo(@QueryParam("sid")  int sid) {
		for(Student s: students) {
			if(s.getStudent_id() == sid) {
				return s.toString();
			}
		}
		return "No Student Found";
	}
}

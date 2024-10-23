package webFacultyREST;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

@Path("WebFaculty")
public class WebFacultyResource {
	Map<Integer, Faculty> facultyHashMap;
	
	String url;
	
	ClientConfig config;
	Client client;
	WebTarget target;
	
	public WebFacultyResource() throws FileNotFoundException {
        Scanner inFile = new Scanner(new FileReader("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/Lab4/WebFacultyRESTProject/Faculty.in"));

        inFile.useDelimiter("[\t\r\n]+");

        facultyHashMap =new HashMap<Integer, Faculty>();

        while (inFile.hasNextLine()) {
            int id = inFile.nextInt();
            String lname = inFile.next();
            String fname = inFile.next();
            String fZipCode = inFile.next();
            double salary = inFile.nextDouble();
            double bonusRate = inFile.nextDouble();

            Faculty newFaculty = new Faculty(id, lname, fname, fZipCode, salary, bonusRate);
            facultyHashMap.put(id, newFaculty);
        }

        inFile.close();
        
        url = "http://api.zippopotam.us/us/";
		
		config = new ClientConfig();
		client = ClientBuilder.newClient(config);
	}
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String dispalyHTMLFacultyInfo() {
		String output = "";
		
		output += "<html>";
		output += "<body>";
			
			output += "<h2>Faculty Info HashMap consuming public REST apis</h2>";
			output += createTable(getTableHeader() + getFacultyTableBodyPublicREST());
		
			output += "<h2>Faculty Info HashMap unsorted</h2>";
			output += createTable(getTableHeader() + getFacultyTableBodyUnsorted());
			
			output += "<h2>Faculty Info HashMap sorted by bonus</h2>";
			output += createTable(getTableHeader() + getFacultyTableBodySorted());
			
			output += "<h2>The total Faculty Bonus is: " + getTotalFacultyBonus() + "$</h2>";
		
		output += "</body>";
		output += "</html>";
		
		return output;
	}
	
	private String createTable(String content) {
		String table = "";
		
		table += "<table border=\"1\">";
			table += content;
		table += "</table>";
		
		return table;
	}
	
	private String getTableHeader() {
		String header = "";
		
		header += "<thead>";
			header += "<th>ID</th>";
			header += "<th>LName</th>";
			header += "<th>FName</th>";
			header += "<th>ZipCode</th>";
			header += "<th>Salary</th>";
			header += "<th>BonusRate</th>";
			header += "<th>TotalBonus</th>";
		header += "</thead>";
		
		return header;
	}
	
	private String getFacultyTableBodyUnsorted() {
		String output = "";
		
		output += "<tbody>";
		
		output += facultyHashMap.values().stream()
				.map(f -> {
					String row = "";
					
					row += "<tr>";
						row += "<td>" + f.getF_id() + "</td>" ;
						row += "<td>" + f.getF_Lname() + "</td>" ;
						row += "<td>" + f.getF_Fname() + "</td>" ;
						row += "<td>" + f.getF_ZipCodeBirth() + "</td>" ;
						row += "<td>" + f.getF_Salary() + "</td>" ;
						row += "<td>" + f.getF_BonusRate() + "</td>" ;
						row += "<td>" + f.doCalc_Bonus() + "</td>" ;
					row += "</tr>";
					
					return row;
				}).collect(Collectors.joining("\n"));
		
		output += "</tbody>";
		
		return output;
	}

	private String getFacultyTableBodySorted() {
		String output = "";
		
		output += "<tbody>";
		
		output += facultyHashMap.values().stream()
				.sorted(Comparator.comparingDouble(Faculty::doCalc_Bonus))
				.map(f -> {
					String row = "";
					
					row += "<tr>";
						row += "<td>" + f.getF_id() + "</td>" ;
						row += "<td>" + f.getF_Lname() + "</td>" ;
						row += "<td>" + f.getF_Fname() + "</td>" ;
						row += "<td>" + f.getF_ZipCodeBirth() + "</td>" ;
						row += "<td>" + f.getF_Salary() + "</td>" ;
						row += "<td>" + f.getF_BonusRate() + "</td>" ;
						row += "<td>" + f.doCalc_Bonus() + "</td>" ;
					row += "</tr>";
					
					return row;
				}).collect(Collectors.joining("\n"));
		
		output += "</tbody>";
		
		return output;
	}

	private String getFacultyTableBodyPublicREST() {
		String output = "";
		
		output += "<tbody>";
		
		output += facultyHashMap.values().stream()
				.map(f -> {
					String row = "";
					
					target = client.target(url + f.getF_ZipCodeBirth());
					
					String zipCodeExtended = target.request().accept(MediaType.APPLICATION_JSON).get(String.class);
					
					row += "<tr>";
						row += "<td>" + f.getF_id() + "</td>" ;
						row += "<td>" + f.getF_Lname() + "</td>" ;
						row += "<td>" + f.getF_Fname() + "</td>" ;
						row += "<td>" + zipCodeExtended + "</td>" ;
						row += "<td>" + f.getF_Salary() + "</td>" ;
						row += "<td>" + f.getF_BonusRate() + "</td>" ;
						row += "<td>" + f.doCalc_Bonus() + "</td>" ;
					row += "</tr>";
					
					return row;
				}).collect(Collectors.joining("\n"));
		
		output += "</tbody>";
		
		return output;
	}
	
	
	private Double getTotalFacultyBonus() {
		return facultyHashMap.values().stream().mapToDouble(Faculty::doCalc_Bonus).sum();
	}
}

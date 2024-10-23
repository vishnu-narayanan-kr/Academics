package webArtistREST;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("ArtistList")
public class WebArtistResource {
	Map<Integer, Artist> artistHashMap;
	
	WebArtistResource(){
		artistHashMap = new HashMap<Integer, Artist>();
		
		try {
			Scanner inFile = new Scanner(new File("C:\\Users\\Dell\\Documents\\GitHub\\Academics\\S4\\WebServices\\MidTerm\\WebArtistRESTProject\\Artist.in"));
		
			inFile.useDelimiter("[\t\r\n]+");
			
			while(inFile.hasNext()) {
				Integer id = inFile.nextInt();
				String name = inFile.next();
				Integer num = inFile.nextInt();
				Double total = inFile.nextDouble();
				
				Artist artist = new Artist(id, name, num, total);
				artistHashMap.put(id, artist);
			}
			
			inFile.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
	}
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String displayHTMLArtistInfo() {
		String output = "";
		
		output += "<html>";
		output += "<body>";
			
			output += "<h2>Print Artists elements of HashMap collection</h2>";
			output += createTable(getTableHeader() + getArtistTableBodyUnsorted());
		
			output += "<h2>Total Number or Art Painting is :"+ getArtistTotalNum() + "</h2>";
			
			output += "<h2>Total Artist Tax is: "+ getArtistTotalTax() + "$</h2>";
		
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
			header += "<th>Artist ID</th>";
			header += "<th>Artist Name</th>";
			header += "<th>Number of Art Paintings</th>";
			header += "<th>Artist Total Art Painting</th>";
			header += "<th>Artist Total Tax</th>";
		header += "</thead>";
		
		return header;
	}
	
	private String getArtistTableBodyUnsorted() {
		String output = "";
		
		output += "<tbody>";
		
		output += artistHashMap.values().stream()
				.map(a -> {
					String row = "";
					
					row += "<tr>";
						row += "<td>" + a.getArt_id() + "</td>" ;
						row += "<td>" + a.getArt_name() + "</td>" ;
						row += "<td>" + a.getNum_art_paint() + "</td>" ;
						row += "<td>" + a.getTot_art_paint() + "$</td>" ;
						row += "<td>" + a.calculateTotalTax() + "$</td>" ;
					row += "</tr>";
					
					return row;
				}).collect(Collectors.joining("\n"));
		
		output += "</tbody>";
		
		return output;
	}
	
	private Integer getArtistTotalNum() {
		return artistHashMap.values().stream().mapToInt(Artist::getNum_art_paint).sum();
	}
	
	private Double getArtistTotalTax() {
		return artistHashMap.values().stream().mapToDouble(Artist::calculateTotalTax).sum();
	}
}

package webHelloFormREST;

import java.util.ArrayList;
import java.util.List;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("WebHelloForm")
public class HelloFormResource {
	
	List<String> nameList = new ArrayList<String>();
	
	public void initializeList() {
		nameList.add("Bob");
		nameList.add("Sarah");
		nameList.add("Bamboo");
	}
	
	@GET
	@Path("/HelloParameters")
	@Produces(MediaType.TEXT_HTML)
	public String displayHelloAsParameter(@QueryParam("Name") String name, @QueryParam("Year") String year) {
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>Hello Everyrone from " + name + ", My year is " + year + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	@POST
	@Path("/HelloBody")
	@Produces(MediaType.TEXT_HTML)
	public String displayHelloAsBody(@FormParam("Name") String name, @FormParam("Year") String year) {
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>Hello Everyrone from " + name + ", My year is " + year + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	@GET
	@Path("/AddName")
	@Produces(MediaType.TEXT_HTML)
	public String displayAddNameAsParameters(@QueryParam("Name") String name) {
		initializeList();
		
		nameList.add(name);
		
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>The List names are " + nameList.toString() + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	// updateName
	@PUT
	@Path("/UpdateName")
	@Produces(MediaType.TEXT_HTML)
	public String displayUpdateNameAsParameters(@QueryParam("Name") String name) {
		initializeList();
		
		for(int i = 0; i < nameList.size(); i++) {
			if(nameList.get(i).equals(name)) {
				nameList.set(i, name.toUpperCase());
			}
		}
		
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>The List names are " + nameList.toString() + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	// deleteName
	@DELETE
	@Path("/RemoveName")
	@Produces(MediaType.TEXT_HTML)
	public String displayRemoveNameAsParameters(@QueryParam("Name") String name) {
		initializeList(); // we need to re-initialize it because it's state less
		
		for(int i = 0; i < nameList.size(); i++) {
			if(nameList.get(i).equals(name) ) {
				nameList.remove(i);
			}
		}
		
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>The List names are " + nameList.toString() + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
}

package webHelloFormREST;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("WebHelloForm")
public class HelloFormResource {
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
}

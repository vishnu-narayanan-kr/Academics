package webMathOperationsREST;

import java.util.ArrayList;
import java.util.HashMap;

import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("MathOp")
public class WebMathResource {
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String calculateHTMLOp(@QueryParam("x") int x, @QueryParam("y") int y, @QueryParam("z") int z) {
		MathOp mathOp = new MathOp(x, y, z);
		
		String output = "";
		
		output += "<html>";
			output += "<h1>";
				output += "Calculate (x+2*y+3*z) Output is: " + mathOp.CalculateSum();
			output += "</h1>";
			output += "<h1>";
				output += "Calculate (x*2*y*3*z) Output is: " + mathOp.CalculatePrd();
			output += "</h1>";
		output += "</html>";
		
		return output;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public MathOp displayXYZJSON() {
		return new MathOp(1, 2, 3);
	}
	
	@Path("/listArray")
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String displayListXYZ() {
		ArrayList<MathOp> listXYZ = new ArrayList<MathOp>();
		
		listXYZ.add(new MathOp(1, 2, 3));
		listXYZ.add(new MathOp(4, 5, 6));
		listXYZ.add(new MathOp(7, 8, 9));
		
		String output = "";
		
		output += "<html>";
			output += "<h1>listXYZ Array List: </h1>";
			
			for(int i = 0; i < listXYZ.size(); i++) {
				output += "<h1>Array List Element: " + i + ": " + listXYZ.get(i) + "</h1>";
			}
			
		output += "</html>";
		
		return output;
	}
	
	@Path("/OpHashMap/{x}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public MathOp searchHashMapListXYZ(@PathParam("x") int x) {
		HashMap<Integer, MathOp> opHashMap = new HashMap<Integer, MathOp>();
		
		opHashMap.put(1, new MathOp(1, 2, 3));
		opHashMap.put(4, new MathOp(4, 5, 6));
		opHashMap.put(7, new MathOp(7, 8, 9));
		
		return opHashMap.get(x);
	}
	
	@Path("/OpFormHashMap")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public MathOp searchFormHashMapListXYZ(@FormParam("x") int x) {
		HashMap<Integer, MathOp> opHashMap = new HashMap<Integer, MathOp>();
		
		opHashMap.put(1, new MathOp(1, 2, 3));
		opHashMap.put(4, new MathOp(4, 5, 6));
		opHashMap.put(7, new MathOp(7, 8, 9));
		
		return opHashMap.get(x);
	}
}

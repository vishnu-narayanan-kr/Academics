package webBillingREST;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.stream.Collectors;

import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("WebBilling")
public class WebBillingResource {
	ArrayList<Billing> billingList = new ArrayList<Billing>();
	
	WebBillingResource() {
		try {
			Scanner inFile = new Scanner(new File("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/Lab3/WebBillingRESTProject/src/main/java/webBillingREST/Billing.in"));
		
			inFile.useDelimiter("[\t\r\n]+");
			
			while(inFile.hasNext()) {
				int id = inFile.nextInt();
				String lName = inFile.next();
				String fName = inFile.next();
				String pName = inFile.next();
				double price = inFile.nextDouble();
				int qty = inFile.nextInt();
				
				Billing billing = new Billing(id, lName, fName, pName, price, qty);
				billingList.add(billing);
			}
			
			inFile.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
	}
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String displayHTMLBillingInfo() {
		String outputHTML = "";
		
		outputHTML += "<html>";
		outputHTML += "<body>";

			
		outputHTML += "<h2>Print Billing Elements of the ArrayList</h2>";
		outputHTML += "<table border=\"1\">";
		outputHTML += "<thead>";
			outputHTML += "<th>client_id</th>";
			outputHTML += "<th>client_lName</th>";
			outputHTML += "<th>client_fName</th>";
			outputHTML += "<th>product_Name</th>";
			outputHTML += "<th>prd_price</th>";
			outputHTML += "<th>prd_qty</th>";
			outputHTML += "<th>Total Billing</th>";
		outputHTML += "</thead>";
		outputHTML += "<tbody>";
			outputHTML += billingList.stream().map(v -> "<tr><td>"+ v.getClient_ID() + "</td><td>"+ v.getClient_LName() + "</td><td>"+ v.getClient_FName() + "</td><td>"+ v.getProduct_Name() + "</td><td>"+ v.getPrd_Price() + "</td><td>"+ v.getPrd_Qty() + "</td><td>"+ v.CalculateBilling() + "</td></tr>").collect(Collectors.joining("\n"));
		outputHTML += "</tbody>";
		outputHTML += "</table>";
		outputHTML += "<h3>The Total Billing is: " + billingList.stream().mapToDouble(Billing::CalculateBilling).sum() + "$</h3>";
			
		outputHTML += "</body>";
		outputHTML += "</html>";
		
		return outputHTML;
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String displayTextBillingInfo() {
		String outputText = "";
		
		outputText += billingList.stream().map(Billing::toString).collect(Collectors.joining("\n"));
		
		outputText += "\n\nThe Total Billing is: " + billingList.stream().mapToDouble(Billing::CalculateBilling).sum();
		
		return outputText;
	}

	@Path("/searchBilling/{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Billing searchJSONBillingInfo(@PathParam("id") int id) {
		for(int i = 0; i < billingList.size(); i++) {
			if(billingList.get(i).getClient_ID() == id) {
				return billingList.get(i);
			}
		}
		
		return null;
	}
	
	@Path("/searchBilling")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Billing searchAsQPBillingInfo(@QueryParam("id") int id) {
		for(int i = 0; i < billingList.size(); i++) {
			if(billingList.get(i).getClient_ID() == id) {
				return billingList.get(i);
			}
		}
		
		return null;
	}
	
	@Path("/addNewBilling")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Billing> addNewBillingInfo(
			@FormParam("id") int id,
			@FormParam("lName") String lName,
			@FormParam("fName") String fName,
			@FormParam("pName") String pName,
			@FormParam("price") double price,
			@FormParam("qty") int qty
			) {
		
		Billing newBilling = new Billing(
					id,
					lName,
					fName,
					pName,
					price,
					qty
				);
		
		billingList.add(newBilling);
		
		return billingList;
	}
}

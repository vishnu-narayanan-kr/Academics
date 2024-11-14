package webBillingService;

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
public class WebBilling {
	ArrayList<Billing> billingList = new ArrayList<Billing>();
	
	public WebBilling() {
		try {
			Scanner inFile = new Scanner(new File("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/_resources/Billing.in"));
		
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
	
	@WebMethod(operationName = "DisplayInfo")
	public String displayInfo() {
		return billingList.toString();
	}
	
	@WebMethod(operationName = "SearchBillingInfo")
	public Billing searchBillingInfo(@WebParam(name = "id") int id) {
		for(int i = 0; i < billingList.size(); i++) {
			if(billingList.get(i).getClient_ID() == id) {
				return billingList.get(i);
			}
		}
		
		return null;
	}
}

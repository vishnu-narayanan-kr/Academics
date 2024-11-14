package webHelloService;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.jws.soap.SOAPBinding.Style;

@WebService
@SOAPBinding(style = Style.RPC) // Remote Procedure Call
public class Hello {
	@WebMethod(operationName = "DisplayHello")
	public String displayHello(@WebParam(name="Name") String name) {
		String display = "";
			
			display += "Hello Every one from " + name;
		
		return display;
	}
	
	@WebMethod(operationName = "CalculateTax")
	public double calculateTax() {
		double taxAmount = 199;
		return taxAmount;
	}
}

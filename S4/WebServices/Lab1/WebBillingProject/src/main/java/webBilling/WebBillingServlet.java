package webBilling;

import java.io.IOException;
import java.io.PrintStream;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class WebBillingServlet
 */
@WebServlet("/WebBillingServlet")
public class WebBillingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public WebBillingServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Billing[] BillingRecords = new Billing[3];
		
		BillingRecords[0] = new Billing();
		BillingRecords[1] = new Billing();
		BillingRecords[2] = new Billing();
		
		BillingRecords[0].setClient_LName("Johnston");
		BillingRecords[0].setClient_FName("Jane");
		BillingRecords[0].setProduct_Name("Chair");
		BillingRecords[0].setPrd_Price(99.99);
		BillingRecords[0].setPrd_Qty(2);
		
		BillingRecords[1].setClient_LName("Fikhali");
		BillingRecords[1].setClient_FName("Samuel");
		BillingRecords[1].setProduct_Name("Table");
		BillingRecords[1].setPrd_Price(139.99);
		BillingRecords[1].setPrd_Qty(1);
		
		BillingRecords[2].setClient_LName("Samson");
		BillingRecords[2].setClient_FName("Amina");
		BillingRecords[2].setProduct_Name("KeyUSB");
		BillingRecords[2].setPrd_Price(14.99);
		BillingRecords[2].setPrd_Qty(2);
		
		response.setContentType("text/html");
		PrintStream out = new PrintStream(response.getOutputStream());
		
		out.print("<table border=\"1\">");
		
		out.print("<thead>");
			out.print("<th>client_LName</th>");
			out.print("<th>client_FName</th>");
			out.print("<th>product_Name</th>");
			out.print("<th>prd_Price</th>");
			out.print("<th>prd_Qty</th>");
			out.print("<th>Total Billing</th>");
		out.print("</thead>");
		
		double totalBilling = 0.00;
		
		out.print("<tbody>");
		for(int i = 0; i < 3; i++) {
			double billing = BillingRecords[i].CalculateBilling();
			totalBilling += billing;
			
			out.print("<tr>");
				out.print("<td>" + BillingRecords[i].getClient_LName() + "</td>");
				out.print("<td>" + BillingRecords[i].getClient_FName() + "</td>");
				out.print("<td>" + BillingRecords[i].getProduct_Name() + "</td>");
				out.print("<td>" + Math.round(BillingRecords[i].getPrd_Price() * 100) / 100.00 + "$</td>");
				out.print("<td>" + BillingRecords[i].getPrd_Qty() + "</td>");
				out.print("<td>" + Math.round(billing * 100) / 100.00 + "$</td>");
			out.print("</tr>");
		} 
		out.print("</tbody>");
		
		out.println("</table>");
		
		out.println("<b>The Total of Billing is: " + Math.round(totalBilling * 100) / 100.00 + "$</b>");
		
		out.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

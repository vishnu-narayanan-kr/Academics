package webHelloServlet;

import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class WebHelloWorld
 */
@WebServlet("/WebHelloWorld")
public class WebHelloWorld extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public WebHelloWorld() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("text/html");
		PrintStream out = new PrintStream(response.getOutputStream());
		out.println("Hello World, so cool to develop Web Services");
		
		double productPrice = 5.99;
		double productQuantity = 6;
		double totalBilling = productPrice * productQuantity;
		
		
		out.println("<html>"
				+ "<head>"
					+ "<title>"
					+ "Servlet Technology Lab1"
					+ "</title>"
				+ "</head>"
				+ "<body>"
					+ "<h1>"
						+ "Vanier College"
					+ "</h1>"
					+ "<p>"
						+ "test"
					+ "</p>"
					+ "<table border=\"1\">"
						+ "<thead>"
							+ "<th>"
								+ "Price"
							+ "</th>"
							+ "<th>"
								+ "Quantity"
							+ "</th>"
							+ "<th>"
								+ "Total"
							+ "</th>"
						+ "</thead>"
						+ "<tbody>"
							+ "<tr>"
								+ "<td>" 
									+ productPrice 
								+ "</td>"
								+ "<td>" 
									+ productQuantity 
								+ "</td>"
								+ "<td>" 
									+ totalBilling 
								+ "</td>"
							+ "</tr>"
						+ "</tbody>"
					+ "</table>");

		
		// web pattern MVC
		University myUni = new University("Montreal Uni", 2024, 3);
		
		out.println("<br/>" + myUni.getName());
		out.println("<br/>" + myUni.getYearOfEstablishment());
		out.println("<br/>" + myUni.getNumOfPrograms());
		out.println("<br/>");
		
		// use array of two records and print using for loop
		University[] myUniArray = new University[2];
		
		myUniArray[0] = new University("Toronto", 2025, 4);
		myUniArray[1] = new University("Sherbrooke", 2026, 2);
		
		for(int i = 0; i < 2; i++) {
			out.println("<br/>" + myUniArray[i].toString());
		}
		out.println("<br/>");
		
		// use array list of two records
		ArrayList<University> myUniArrList = new ArrayList<University>();
		
		myUniArrList.add(new University("UCLA", 2025, 2));
		myUniArrList.add(new University("New York", 2026, 3));
		// use hash map of two records where name is key
		HashMap<String, University> myUniHashMap = new HashMap<String, University>();
		
		myUniHashMap.put("Winnipeg", new University("Winnipeg", 2024, 3));
		myUniHashMap.put("Winchester", new University("Winchester", 2025, 1));
		
		// use lambda expression to print array list and hash map
		myUniArrList.stream().forEach(uni -> out.println("<br/>" + uni));
		out.println("<br/>");
		out.println("<br/>");
		myUniHashMap.forEach((k, v) -> { out.print(k); out.print(v); out.println("<br/>");});
		
		out.println(
		"</body>"
		+ "</html>"
		);
		
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

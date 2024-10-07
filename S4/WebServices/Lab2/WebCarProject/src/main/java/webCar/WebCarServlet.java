package webCar;

import java.io.IOException;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.stream.Collectors;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class WebCarServlet
 */
@WebServlet("/WebCarServlet")
public class WebCarServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public WebCarServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		PrintStream out = new PrintStream(response.getOutputStream());
		
		HashMap<String, Car> carHashMap = new HashMap<String, Car>();
		
		carHashMap.put("K1245", new Car("K1245", "Ford", 35000));
		carHashMap.put("M198754", new Car("M198754", "Honda", 40000));
		carHashMap.put("M98524M4", new Car("M98524M4", "Hyundai", 25000));
		carHashMap.put("S741582", new Car("S741582", "Nissan", 30000));
		
		String output = "";
		
		output += "<html>";
		output += "<body>";
		output += "<h1>Web Car Project</h1>";
		output += "<table border=\"1\">";
		output += "<tbody>";
		output += carHashMap.values().stream().map(v -> "<tr><td>" + v.getVin() + "</td><td>" + v.getDesc() + "</td><td>" + v.getPrice() + "</td></tr>").collect(Collectors.joining(""));
		output += "<tbody>";
		output += "</table>";
		output += "</body>";
		output += "</html>";
		
		out.print(output);
		
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

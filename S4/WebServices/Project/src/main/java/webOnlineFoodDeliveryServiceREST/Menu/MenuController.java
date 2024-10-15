package webOnlineFoodDeliveryServiceREST.Menu;

import java.util.Map;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("Menu")
public class MenuController {
	@GET
	@Path("View")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<Integer, Menu> viewMenus() {
		Map<Integer, Menu> menuMap = RegisteredMenus.getInstance().getRegisteredMenus();
		return menuMap;
	}
}

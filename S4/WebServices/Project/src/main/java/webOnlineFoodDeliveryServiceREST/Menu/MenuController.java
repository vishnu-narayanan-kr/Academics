package webOnlineFoodDeliveryServiceREST.Menu;

import java.util.Map;
import java.util.stream.Collectors;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("Menu")
public class MenuController {
	@GET
	@Path("View")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<Integer, Menu> viewMenus(@QueryParam("keyword") String keyword) {
		Map<Integer, Menu> menuMap = RegisteredMenus.getInstance().getRegisteredMenus();
		
		if(keyword.trim().length() != 0) {
			return menuMap.values().stream().filter(m -> (m.getMealName() + m.getDescription()).toLowerCase().contains(keyword.toLowerCase()))
			.collect(Collectors.toMap(m -> m.getMealId(), m -> m));
		}
		
		return menuMap;
	}
}

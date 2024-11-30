package webOnlineFoodDeliveryServiceREST.Menu;

import java.util.Map;
import java.util.stream.Collectors;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import webOnlineFoodDeliveryServiceREST.Utility;

@Path("Menu")
public class MenuController {
	Utility utility = new Utility();
	
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
	
	@POST
	@Path("Add")
	@Produces(MediaType.APPLICATION_JSON)
	public String addMenu(Menu menu) {
		RegisteredMenus.getInstance().addMenu(menu);
		return "Menu Added Successfully";
	}
	
	@PUT
	@Path("Update")
	@Produces(MediaType.APPLICATION_JSON)
	public String updateMenu(Menu menu) {
		RegisteredMenus.getInstance().updateMenu(menu);
		return "Menu updated Successfully";
	}
	
	@DELETE
	@Path("Delete")
	@Produces(MediaType.APPLICATION_JSON)
	public String updateMenu(@QueryParam("id") int id) {
		RegisteredMenus.getInstance().delete(id);
		return "Menu deleted Successfully";
	}
}

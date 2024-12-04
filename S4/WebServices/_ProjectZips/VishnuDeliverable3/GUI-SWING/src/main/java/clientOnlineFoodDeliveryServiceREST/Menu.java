package clientOnlineFoodDeliveryServiceREST;

public class Menu {
	private Integer restaurantId;
	private String restaurantName;
	private Integer mealId;
	private String mealName;
	private String description;
	private Double price;
	private String category;
	
	public String toString() {
		String output = "";
		
		output += restaurantId + "\t";
		output += restaurantName + "\t";
		output += mealId + "\t";
		output += mealName + "\t";
		output += description + "\t";
		output += price + "\t";
		output += category;
		
		return output;
	}
	
	public Menu() {
		this.restaurantId = 0;
		this.restaurantName = "";
		this.mealId = 0;
		this.mealName = "";
		this.description = "";
		this.price = 0.0;
		this.category = "";
	}
	
	public Menu(Integer restaurantId, String restaurantName, Integer mealId, String mealName, String description,
			Double price, String category) {
		this.restaurantId = restaurantId;
		this.restaurantName = restaurantName;
		this.mealId = mealId;
		this.mealName = mealName;
		this.description = description;
		this.price = price;
		this.category = category;
	}

	public Integer getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(Integer restaurantId) {
		this.restaurantId = restaurantId;
	}

	public String getRestaurantName() {
		return restaurantName;
	}

	public void setRestaurantName(String restaurantName) {
		this.restaurantName = restaurantName;
	}

	public Integer getMealId() {
		return mealId;
	}

	public void setMealId(Integer mealId) {
		this.mealId = mealId;
	}

	public String getMealName() {
		return mealName;
	}

	public void setMealName(String mealName) {
		this.mealName = mealName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
}
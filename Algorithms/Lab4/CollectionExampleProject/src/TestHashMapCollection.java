
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestHashMapCollection {
    public static void main(String[] args) {
        Map<String, Car> carHashMap = new HashMap();
        
        /*
        if database table is used, the purpose is to complete
        search (by vin key), and generate reports (of car values(desc, price))
        */
        
        Car car1 = new Car("K1245", "Ford", 35000);
        Car car2 = new Car("M198745", "Honda", 40000);
        Car car3 = new Car("M98547", "Hyndai", 25000);
        Car car4 = new Car("S74582", "Nissan", 30000);
        
        carHashMap.put(car1.getVin(), car1);
        carHashMap.put(car2.getVin(), car2);
        carHashMap.put(car3.getVin(), car3);
        carHashMap.put(car4.getVin(), car4);
        
        System.out.println("Searching by vin of Car");
        
        Car foundCar = carHashMap.get(car3.getVin());
        
        if(foundCar != null) {
            System.out.println(foundCar.toString());
        } else {
            System.out.println("No car found");
        }
        
        System.out.println("Display all keys of Map Collection");
        Set<String> carKeys = carHashMap.keySet();
        
        for(String key: carKeys) {
            System.out.print(key + ", ");
        }
        
        System.out.println("");
        
        System.out.println("Display all values of Map Collection");
        Collection<Car> carValues = carHashMap.values();
        
        for(Car value: carValues) {
            System.out.print(value + ", ");
        }
        
        System.out.println("");
    }
}

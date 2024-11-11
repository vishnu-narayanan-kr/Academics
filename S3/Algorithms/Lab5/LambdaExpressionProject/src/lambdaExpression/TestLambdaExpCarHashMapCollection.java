/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Dell
 */
public class TestLambdaExpCarHashMapCollection {
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
        
        System.out.println("\nPrinting carHashMap keys using Lamda Expression: ");
        carHashMap.forEach((k, v) -> System.out.println(k));
        
        System.out.println("\nPrinting carHashMap values using Lamda Expression: ");
        carHashMap.forEach((k, v) -> System.out.println(v));
    }
}

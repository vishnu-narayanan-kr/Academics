/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author Dell
 */
public class TestOptionalClass {
    public static void main(String[] args) {
        List<Car> listCar = new ArrayList<>();
        
        Car car1 = new Car("K1245", "Ford", 35000);
        Car car2 = new Car("M198745", "Honda", 40000);
        Car car3 = null;
        
        listCar.add(car1);
        listCar.add(car2);
        listCar.add(car3);
        
        /*
        System.out.println("Abnormal Termination of program since null");
        String carkey1 = listCar.get(2).getVin().toLowerCase();
        System.out.println(carkey1);
        */
        
        System.out.println("Using Optional");
        Optional<Car> car2Null = Optional
                .ofNullable(listCar.get(2));
        
        if(car2Null.isPresent()) {
            String carKey2 = listCar.get(2).getVin().toLowerCase();
            System.out.println(carKey2);
        } else {
            System.out.println("Car2 is null");
        }
    }
}

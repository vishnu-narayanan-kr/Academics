
import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestLambdaTripProject {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new File("Trip.in"));

        inFile.useDelimiter("[\t\r\n]+");

        Set<Trip> myTrip = new HashSet<Trip>();

        while (inFile.hasNext()) {
            int emp_id = inFile.nextInt();
            String emp_name = inFile.next();
            String emp_address = inFile.next();
            double emp_gasprice = inFile.nextDouble();
            int emp_distance = inFile.nextInt();
            double emp_costhotel = inFile.nextDouble();
            double emp_costfood = inFile.nextDouble();

            Trip newTrip = new Trip(
                    emp_id,
                    emp_name,
                    emp_address,
                    emp_gasprice,
                    emp_distance,
                    emp_costhotel,
                    emp_costfood);

            myTrip.add(newTrip);
        }

        inFile.close();

        System.out.println("The size of HashSet is: " + myTrip.size());
        
        System.out.println("\nThe Employee Trip information using Lambda Expression");
        myTrip.forEach(System.out::println);
        
        System.out.println("\nInvoking printCostTrip using Lambda Expression");
        myTrip.forEach(t -> lambda_printCostTrip(t));
        
        System.out.println("\nInvoking printCostTrip using :: operator within foreach");
        myTrip.forEach(Trip::printCostTrip);
        
        System.out.println("\nApplying discount function to trip set using Lambda Expresssion");
        Function<Double, Double> tripDiscount = (c) -> Math.round(c * 0.9 * 100) / 100.00;
        myTrip.forEach((t) -> System.out.println("Cost Trip after Discount for " + t.getEmp_id() + ", " + t.getEmp_name() + " is " + tripDiscount.apply(t.CalculateCostTrip()) + "$"));
    
        System.out.println("\nApplying tripAdvanceFee function to trip set using andThen after using discount with Lambda Expresssion");
        Function<Double, Double> tripAdvanceFee  = tripDiscount.andThen((d) -> Math.round(d * 0.3 * 100) / 100.00);
        myTrip.forEach((t) -> System.out.println("Cost Trip Advance fee for " + t.getEmp_id() + ", " + t.getEmp_name() + " is " + tripAdvanceFee.apply(t.CalculateCostTrip()) + "$"));
        
        System.out.println("\nUsing Consumer Functional interface");
        Consumer<Trip> totaltripCostMethod = t -> t.printCostTrip();
        totaltripCostMethod.accept(new Trip(2,"Amine Khan", "Paris France", 1.11, 50, 75.00, 50.00));
        
        // Stream Processing
        System.out.println("\nUsing stream processing filter method");
        long employeeCount = myTrip.stream().filter(t -> t.CalculateCostTrip() > 400).count();
        System.out.println("Number of Employees in the HashSet whose total trip cost > $400 is: " + employeeCount);
        
        System.out.println("\nUsing stream processing sorted method(emp_id)");
        myTrip.stream().sorted((t1, t2) -> Integer.compare(t1.getEmp_id(),t2.getEmp_id())).forEach(System.out::println);
        
        System.out.println("\nUsing stream processing sorted method(CalculateTripCost)");
        myTrip.stream().sorted((t1, t2) -> Double.compare(t1.CalculateCostTrip(),t2.CalculateCostTrip())).forEach(System.out::println);
        
        System.out.println("\nUsing stream processing max method(Max cost employe)");
        myTrip.stream().max((t1, t2) -> Double.compare(t1.CalculateCostTrip(), t2.CalculateCostTrip())).get().printCostTrip();
        
        System.out.println("\nUsing stream processing min method(Min cost employe)");
        myTrip.stream().min((t1, t2) -> Double.compare(t1.CalculateCostTrip(), t2.CalculateCostTrip())).get().printCostTrip();
        
        System.out.println("\nUsing stream processing anyMethod");
        Boolean isEdwardPresent = myTrip.stream().anyMatch(t -> t.getEmp_name().contains("Eduard"));
        System.out.println("Display if Employee Trip info matching emp_name \"Eduard\" is in the HashSet: " + isEdwardPresent);
        
        System.out.println("\nDisplay all Employee Trip info all matching emp_name \"Paul\" in the HashSet");
        myTrip.stream().filter(t1 -> t1.getEmp_name().contains("Paul")).forEach(System.out::println);
    }
    
    public static void lambda_printCostTrip(Trip t) {
        t.printCostTrip();
    }
}

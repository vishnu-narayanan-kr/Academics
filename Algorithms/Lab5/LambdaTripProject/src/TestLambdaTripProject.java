
import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

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
        
        
    }
}


import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
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
public class TestHashSetCollectionTrip {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new File("Trip.in"));

        inFile.useDelimiter("[\t\r\n]+");

        Set<Trip> myTrip = new HashSet();

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

        System.out.println("The employee trip information you entered are: " + myTrip.size());

        System.out.println("\nPrinting all the elements of the HashSet");
        for (Trip trip : myTrip) {
            System.out.println(trip);
        }

        System.out.println("\nPrinting all the elements of the HashSet using .next() of Iterator");

        Iterator<Trip> it = myTrip.iterator();

        while (it.hasNext()) {
            System.out.println(it.next());
        }

        Trip newTrip = new Trip(2, "Amine Khan", "Paris France", 1.11, 50, 75.00, 50.00);
        myTrip.add(newTrip);

        System.out.println("\nAfter adding new Client");
        for (Trip trip : myTrip) {
            System.out.println(trip);
        }

        System.out.println("\nPrinting using LinkedHashSet to preserve order");

        myTrip = new LinkedHashSet();
        inFile = new Scanner(new File("Trip.in"));
        inFile.useDelimiter("[\t\r\n]+");

        while (inFile.hasNext()) {
            int emp_id = inFile.nextInt();
            String emp_name = inFile.next();
            String emp_address = inFile.next();
            double emp_gasprice = inFile.nextDouble();
            int emp_distance = inFile.nextInt();
            double emp_costhotel = inFile.nextDouble();
            double emp_costfood = inFile.nextDouble();

            newTrip = new Trip(
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

        for (Trip trip : myTrip) {
            System.out.println(trip);
        }
    }
}

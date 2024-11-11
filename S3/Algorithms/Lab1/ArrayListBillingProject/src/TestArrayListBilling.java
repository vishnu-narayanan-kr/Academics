
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestArrayListBilling {

    public static void main(String[] args) throws FileNotFoundException {
        List<Billing> BillingArrList = new ArrayList();

        Scanner inFile = new Scanner(new File("Billing.in"));

        // Read file and Initialize ArrayList
        System.out.println("Reading from Billing.in input file");
        while (inFile.hasNextLine()) {
            double price = inFile.nextDouble();
            double quantity = inFile.nextInt();

            inFile.nextDouble();
            inFile.nextDouble();

            Billing current = new Billing();
            current.setPrd_Price(price);
            current.setPrd_Qty(quantity);

            BillingArrList.add(current);
        }

        // Printing from ArrayList while caluclating total and subtotal;
        System.out.println("Printing ArrayList BillingArrList, and perfrom Processing");
        double total = 0.0;

        for (int i = 0; i < BillingArrList.size(); i++) {
            Billing current = BillingArrList.get(i);
            System.out.println("BillingArrList[" + i + "] Object: " + current.toString());
            double subtotal = current.CalculateBilling();
            System.out.println("The total billing of BillingArrList[" + i + "] Object is: " + subtotal + "\n");
            total += subtotal;
        }

        System.out.println("All total of Billing is: " + total);
        System.out.println("Thank you for doing business with us");
    }
}

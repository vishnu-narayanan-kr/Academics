
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestStackClientProject {
    public static void main(String[] args) throws FileNotFoundException {
        System.out.println("Storing the recores of Client.in into end-user defined Stack.");
        System.out.println("___________________________________________________");
        
        Scanner inFile = new Scanner(new File("Client.in"));
        inFile.useDelimiter("[\t\r\n]+");
        
        LinkedStackClass stack = new LinkedStackClass();
        
        while(inFile.hasNextLine()) {
            int id = inFile.nextInt();
            String name = inFile.next();
            int qty = inFile.nextInt();
            double price = inFile.nextDouble();
            
            Client newClient = new Client(id, name, qty, price);
            stack.push(newClient);
        }
        
        inFile.close();
        
        stack.print();
    }
}


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
public class TestEmployeeProject1 {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new File("Employee.in"));
        
        inFile.useDelimiter("[\t\r\n]+");
        
        // reading and displaying
        while(inFile.hasNextLine()) {
            System.out.print("ID: " + inFile.next()+ ", ");
            System.out.print("First Name: " + inFile.next()+ ", ");
            System.out.print("Last Name: " + inFile.next()+ ", ");
            System.out.print("Salary: " + inFile.nextDouble()+ ", ");
            System.out.print("Dept ID: " + inFile.next()+ ", ");
            System.out.print("Position: " + inFile.next()+ ", ");
            
            System.out.print("\nBonus: ");
            
            while(inFile.hasNextInt()) {
                int bonus = inFile.nextInt();
                
                if(bonus == -999) {
                    break;
                } else {
                    System.out.print(bonus + ", ");
                }
            }
            
            System.out.println("\n");
        }
        
        inFile.close();
    }
}

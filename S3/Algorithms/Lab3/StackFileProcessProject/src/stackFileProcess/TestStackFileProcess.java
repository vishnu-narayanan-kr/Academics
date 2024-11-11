/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package stackFileProcess;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

/**
 *
 * @author Dell
 */
public class TestStackFileProcess {
    public static void main(String[] args) throws FileNotFoundException {
        LinkedDivideStack myStack = new LinkedDivideStack();
        
        Scanner scanner = new Scanner(new File("divide.in"));
        
        while(scanner.hasNextLine()) {
            double x = scanner.nextDouble();
            double y = scanner.nextDouble();
            
            Divide divide = new Divide(x, y);
            myStack.push(divide);
        }
        
        scanner.close();
        
        myStack.print();
    }
}

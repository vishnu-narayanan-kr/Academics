/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package fileprocessproject;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Scanner;

/**
 *
 * @author Dell
 */
public class TestFileProcess1{
    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new FileReader("divide.in"));
        
        double x, y;
        
        while(inFile.hasNextLine()) {
            x = inFile.nextDouble();
            y = inFile.nextDouble();
            
            System.out.println("x: " + x + ", y: " + y + ", Division: " + x / y);
        }
    }
}

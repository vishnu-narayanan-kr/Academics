/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package arraylistprocessproject;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 *
 * @author Dell
 */
public class TestFileArrayList2 {
        public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new FileReader("divide.in"));
        PrintWriter outFile = new PrintWriter("divide.out");
        
        double x, y;
        
        
        List<Divide> inFileArrayList = new ArrayList<>();
        
        // Read from input file divide.in
        // and load it into data structure
        while(inFile.hasNextLine()) {
            x = inFile.nextDouble();
            y = inFile.nextDouble();
            
            inFileArrayList.add(new Divide(x, y));
        }
        inFile.close();
        
        // read from data struture
        for(int i = 0; i < inFileArrayList.size(); i++) {
            Divide outObj = inFileArrayList.get(i);
            
            System.out.println("x: " + outObj.getX() + ", y: " + outObj.getY() + ", Division: " + outObj.getDivision());
        }
        
        // write to file from data structure
        for(int i = 0; i < inFileArrayList.size(); i++) {
            Divide outObj = inFileArrayList.get(i);
            
            outFile.println("x: " + outObj.getX() + ", y: " + outObj.getY() + ", Division: " + outObj.getDivision());
        }
        
        outFile.close(); // if not closed it will not work
    }
}

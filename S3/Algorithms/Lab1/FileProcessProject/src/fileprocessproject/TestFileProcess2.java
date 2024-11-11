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
public class TestFileProcess2 {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new FileReader("divide.in"));

        double[] x = new double[4];
        double[] y = new double[4];

        short index = 0;

        // populating parallel array
        while (inFile.hasNextLine()) {
            x[index] = inFile.nextDouble();
            y[index] = inFile.nextDouble();

            index++;
        }
        
        inFile.close();
        
        // read prallel array and print
        for(int i = 0; i < 4; i++) {
            System.out.println("x: " + x[i] + ", y: " + y[i] + ", Division: " + x[i] / y[i]);
        }
    }
}

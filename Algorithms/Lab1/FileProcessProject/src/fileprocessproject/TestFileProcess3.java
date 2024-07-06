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
public class TestFileProcess3 {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new FileReader("divide.in"));

        Divide[] divideArray = new Divide[4];

        short index = 0;

        // populating parallel array
        while (inFile.hasNextLine()) {
            Divide obj = new Divide();
            obj.setX(inFile.nextDouble());
            obj.setY(inFile.nextDouble());

            divideArray[index] = obj;

            index++;
        }

        inFile.close();

        // read prallel array and print
        for (int i = 0; i < 4; i++) {
            System.out.println("x: " + divideArray[i].getX() + ", y: " + divideArray[i].getY() + ", Division: " + divideArray[i].getDivision());
        }

        // Searching
        double x_input, y_input;
        System.out.println("Enter values of x and y to search: ");
        Scanner scanner = new Scanner(System.in);
        x_input = scanner.nextDouble();
        y_input = scanner.nextDouble();

        Divide.searchX(x_input, divideArray);
        Divide.searchY(y_input, divideArray);

    }
}

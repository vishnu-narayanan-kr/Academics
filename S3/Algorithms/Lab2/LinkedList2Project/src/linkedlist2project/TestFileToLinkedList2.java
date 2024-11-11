/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedlist2project;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

public class TestFileToLinkedList2 {

    public static void main(String[] args) throws FileNotFoundException {
        List<Divide> divideFileLinkedList = new LinkedList<>();
        
        Scanner inFile = new Scanner(new FileReader("divide.in"));
        
        double x, y;
        while (inFile.hasNextLine()) {
            x = inFile.nextDouble();
            y = inFile.nextDouble();
            Divide divide = new Divide(x, y);
            divideFileLinkedList.add(divide);

        }
        
        inFile.close();

        for (int i = 0; i < divideFileLinkedList.size(); i++) {

            System.out.println("X: " + divideFileLinkedList.get(i).getX() + ", Y: " + divideFileLinkedList.get(i).getY());

        }

    }
}

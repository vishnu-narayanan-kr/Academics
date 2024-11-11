/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedStack;

import java.util.Scanner;

/**
 *
 * @author Dell
 */
public class TestLinkedListClass {
    public static void main(String[] args) {
        LinkedListClass myList = new LinkedListClass();
        
        myList.add(10);
        myList.add(15);
        myList.add(20);
        myList.add(25);
        
        myList.print();
        
        LinkedStackClass myStack = new LinkedStackClass();
        
        myStack.push(40);
        myStack.push(50);
        myStack.push(60);
        myStack.push(70);
        
        myStack.print();
        
        // Scanner scanner = new Scanner(System.in);
        // System.out.println("Enter a value to search: ");
        // myList.search(scanner.nextInt());
        // scanner.close();
    }
}

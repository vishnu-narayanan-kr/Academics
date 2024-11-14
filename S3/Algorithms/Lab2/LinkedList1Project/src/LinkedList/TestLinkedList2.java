/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package LinkedList;

import java.util.Scanner;

/**
 *
 * @author Dell
 */
public class TestLinkedList2 {
    public static void main(String[] args) {
        LinkedListNode headNode = null, newNode, current = null;
        // inserting values into the LinkedList until -999
        Scanner scanner = new Scanner(System.in);
        
        int inputNumber;
        
        while(true) {
            System.out.println("Enter the data for processing(-999 to stop): ");
            inputNumber = scanner.nextInt();
            
            if(inputNumber == -999) break;
            
            newNode = new LinkedListNode();
            newNode.info = inputNumber;
            newNode.link = null;
            
            if (current == null) {
                headNode = newNode;
            }
            else {         
                current.link = newNode;
            }
            
            current = newNode;
        }
        
        // reading from the LinkedList
        System.out.println("Displaying the components of the Linked List stored from the user input: ");
        
        current = headNode;
        
        while(current != null) {
            System.out.println("Value: " + current.info);
            current = current.link;
        }
    }
}


import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestThreeLinkedList {

    public static void main(String[] args) {
        LinkedListNode headNode1 = null, headNode2 = null, headNode3 = null;
        LinkedListNode currentNode1 = null, currentNode2 = null, currentNode3 = null;

        System.out.println("Enter the data for processing(-999 to stop): ");
        Scanner scanner = new Scanner(System.in);

        while (true) {
            int inputNumber = scanner.nextInt();

            if (inputNumber == -999) {
                break;
            }

            LinkedListNode newNode1 = new LinkedListNode(inputNumber, null);

            if (headNode1 == null) {
                headNode1 = newNode1;
                currentNode1 = newNode1;
            } else {
                currentNode1.link = newNode1;
                currentNode1 = newNode1;
            }

            LinkedListNode newNode2 = new LinkedListNode(inputNumber * 2, null);
            
            if (headNode2 == null) {
                headNode2 = newNode2;
            } else {
                newNode2.link = headNode2;
                headNode2 = newNode2;
            }
        }
        
        System.out.println("Displaying the components of the First and Second Linked Lists");
        System.out.println("Stored from the user input in forward and backward manners\n\n");
        
        currentNode1 = headNode1;
        currentNode2 = headNode2;
        
        while(currentNode1 != null && currentNode2 != null) {
            System.out.print("The value in First Linked List is: " + currentNode1.info);
            System.out.println(" ,The value in Second Linked List is: " + currentNode2.info);
            
            currentNode1 = currentNode1.link;
            currentNode2 = currentNode2.link;
        }
        
        System.out.println("\n\nDisplaying the components of the First Linked list \n\n");
        
        currentNode1 = headNode1;
        
        while(currentNode1 != null) {
            System.out.println("Value: " + currentNode1.info);
            currentNode1 = currentNode1.link;
        }
        
        System.out.println("\n\nDisplaying the components of the Second Linked list \n\n");
        
        currentNode2 = headNode2;
        
        while(currentNode2 != null) {
            System.out.println("Value: " + currentNode2.info);
            currentNode2 = currentNode2.link;
        }
        
        // Create the third Linked List from the difference between values in the first two
        currentNode1 = headNode1;
        currentNode2 = headNode2;
        
        while(currentNode1 != null && currentNode2 != null) {
            int value = currentNode1.info - currentNode2.info;
            
            LinkedListNode newNode = new LinkedListNode(value, null);
            
            if(headNode3 == null) {
                headNode3 = newNode;
                currentNode3 = newNode;
            } else {
                currentNode3.link = newNode;
                currentNode3 = newNode;
            }
            
            currentNode1 = currentNode1.link;
            currentNode2 = currentNode2.link;
        }
        
        System.out.println("\n\nDisplaying the components of the Third Linked list \n\n");
        
        currentNode3 = headNode3;
        
        while(currentNode3 != null) {
            System.out.println("Value: " + currentNode3.info);
            currentNode3 = currentNode3.link;
        }
    }
}

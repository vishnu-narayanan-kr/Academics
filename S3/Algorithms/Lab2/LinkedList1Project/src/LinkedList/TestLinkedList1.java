/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package LinkedList;

/**
 *
 * @author Dell
 */
public class TestLinkedList1 {
    // create a linkedlist to store integers
    public static void main(String[] args) {
        LinkedListNode headNode, newNode;
        
        headNode = new LinkedListNode();
        headNode.info = 24;
        headNode.link = null;
        
        newNode = new LinkedListNode();
        newNode.info = 56;
        newNode.link = null;
        headNode.link = newNode;

        newNode = new LinkedListNode();
        newNode.info = 285;
        newNode.link = null;
        headNode.link.link = newNode;
        
        newNode = new LinkedListNode();
        newNode.info = 3;
        newNode.link = null;
        headNode.link.link.link = newNode;
        
        newNode = new LinkedListNode();
        newNode.info = 9;
        newNode.link = null;
        headNode.link.link.link.link = newNode;
        
        newNode = new LinkedListNode();
        newNode.info = 77;
        newNode.link = null;
        headNode.link.link.link.link.link = newNode;
        
        // reading from the LinkedList
        System.out.println("Displaying the contents of the linked list: ");
        LinkedListNode current;
        
        current = headNode;
        
        while(current != null) {
            System.out.println(current.info);
            current = current.link;
        }
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedStack;

/**
 *
 * @author Dell
 */
public class LinkedListClass {

    public LinkedListNode first;
    public LinkedListNode last;

    public LinkedListClass() {
        this.first = null;
        this.last = null;
    }

    public void add(int number) {
        LinkedListNode node = new LinkedListNode(number, null);

        if (first == null) {
            this.first = node;
            this.last = node;
        } else {
            this.last.setLink(node);
            this.last = node;
        }
    }

    public void print() {
        if (first == null) {
            System.out.println("The list is empty!");
            return;
        }

        LinkedListNode current = first;

        System.out.println("List Items: ");

        while (current != null) {
            System.out.print(current.getInfo() + ", ");
            current = current.getLink();
        }

        System.out.println("");
    }
    
    public boolean search(int number) {
        LinkedListNode current = first;
        
        while(current != null) {
            if (current.getInfo() == number) {
                System.out.println("Value found!");
                return true;
            }
            
            current = current.getLink();
        }
        
        System.out.println("Value NOT found!");
        return false;
    }
}

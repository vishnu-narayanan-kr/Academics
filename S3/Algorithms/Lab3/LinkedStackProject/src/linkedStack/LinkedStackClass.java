/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedStack;

/**
 *
 * @author Dell
 */
public class LinkedStackClass {

    LinkedListNode stackTop;

    public void push(int number) {
        LinkedListNode node = new LinkedListNode(number, stackTop);
        
        stackTop = node;
    }
    
    public void print() {
        LinkedListNode currentNode = stackTop;
        System.out.println("Stack values: ");
        while(currentNode != null) {
            System.out.print(currentNode.getInfo() + ", ");
            currentNode = currentNode.getLink();
        }
    }
}

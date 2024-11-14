/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package stackFileProcess;

/**
 *
 * @author Dell
 */
public class LinkedDivideStack {

    LinkedListNode stackTop;

    public void push(Divide divide) {
        LinkedListNode node = new LinkedListNode(divide, stackTop);
        
        stackTop = node;
    }
    
    public void print() {
        LinkedListNode currentNode = stackTop;
        
        while(currentNode != null) {
            System.out.println("Value: " + currentNode.info);
            currentNode = currentNode.link;
        }
    }
}

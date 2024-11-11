/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class LinkedStackClass {
    public ClientNode stackTop = null;
    
    public void push(Client clientObj) {
        ClientNode newNode = new ClientNode();
        
        newNode.info = clientObj;
        newNode.link = null;
        
        if(this.stackTop == null) {
            this.stackTop = newNode;
        } else {
            newNode.link = this.stackTop;
            this.stackTop = newNode;
        }
    }
    
    public void print() {
        ClientNode current = this.stackTop;
        
        int size = 0;
        
        while(current != null) {
            size++;
            System.out.println(current.info);
            current = current.link;
        }
        
        System.out.println("\nThe size of the stack is: " + size);
        System.out.println("\nStackTop is: " + this.stackTop.info);
    }
}

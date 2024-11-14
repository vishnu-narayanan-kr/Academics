/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestMultipleQueue {
    public static void main(String[] args) {
        MultipleQueueClass myQueue = new MultipleQueueClass();
        
        myQueue.addQueue(6);
        myQueue.addQueue(17);
        myQueue.addQueue(5);
        myQueue.addQueue(20);
        myQueue.addQueue(15);
        
        myQueue.printQueueStatus();
        
        myQueue.deleteQueue();
        System.out.println("\nAfter dequeue:");
        myQueue.printQueueStatus();
        
        myQueue.addQueue(30);
        System.out.println("\nAfter adding in the queue:");
        myQueue.printQueueStatus();
        
        myQueue.deleteQueue();
        System.out.println("\nAfter dequeue:");
        myQueue.printQueueStatus();
        
        myQueue.deleteQueue();
        System.out.println("\nAfter dequeue:");
        myQueue.printQueueStatus();
    }
}

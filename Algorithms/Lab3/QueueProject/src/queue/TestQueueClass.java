/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package queue;

/**
 *
 * @author Dell
 */
public class TestQueueClass {
    public static void main(String[] args) {
        QueueClass myQueueList = new QueueClass();
        
        myQueueList.addQueue(6);
        myQueueList.addQueue(16);
        myQueueList.addQueue(63);
        myQueueList.addQueue(61);
        myQueueList.addQueue(18);
        
        System.out.println("Queue at 1");
        System.out.println("number of elements: " + myQueueList.count);
        System.out.println("front index: " + myQueueList.queueFront);
        System.out.println("rear index: " + myQueueList.queueRear);
        System.out.println("value at front index: " + myQueueList.list[myQueueList.queueFront]);
        System.out.println("value at rear index: " + myQueueList.list[myQueueList.queueRear]);
        
        myQueueList.deleteQueue();
        
        System.out.println("\nQueue at 2");
        System.out.println("number of elements: " + myQueueList.count);
        System.out.println("front index: " + myQueueList.queueFront);
        System.out.println("rear index: " + myQueueList.queueRear);
        System.out.println("value at front index: " + myQueueList.list[myQueueList.queueFront]);
        System.out.println("value at rear index: " + myQueueList.list[myQueueList.queueRear]);
        
        myQueueList.addQueue(19);
        
        System.out.println("\nQueue at 3");
        System.out.println("number of elements: " + myQueueList.count);
        System.out.println("front index: " + myQueueList.queueFront);
        System.out.println("rear index: " + myQueueList.queueRear);
        System.out.println("value at front index: " + myQueueList.list[myQueueList.queueFront]);
        System.out.println("value at rear index: " + myQueueList.list[myQueueList.queueRear]);
        
    }
}

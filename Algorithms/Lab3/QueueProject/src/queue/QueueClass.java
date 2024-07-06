/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package queue;

/**
 *
 * @author Dell
 */
public class QueueClass {
    public int queueFront;          // keeps track of the front index of the queue
    public int queueRear;           // keeps track of the rear index of the queue
    public int count;               // number of elements in the queue
    public int maxQueueSize;        // specifiy the max number in the queue
    public Integer[] list;          // Integer class used to use null
    
    public QueueClass() {
        count = 0;
        queueFront = 0;
        maxQueueSize = 10;
        queueRear = maxQueueSize - 1;
        list = new Integer[maxQueueSize];
    }
    
    public void addQueue(Integer number) {
        count++;
        queueRear = (queueRear + 1) % maxQueueSize;
        list[queueRear] = number;
    }
    
    public void deleteQueue() {
        count--;
        list[queueFront] = null;
        queueFront = (queueFront + 1) % maxQueueSize;
    }
}

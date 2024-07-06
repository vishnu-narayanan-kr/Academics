/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class MultipleQueueClass {
    public int queueFrontA;
    public int queueRearA;
    public int queueFrontB;
    public int queueRearB;
    public int maxQueueSize;
    public int countA;
    public int countB;
    public Integer[][] list;
    
    MultipleQueueClass() {
        this.countA = 0;
        this.countB = 0;
        
        this.queueFrontA = 0;
        this.queueFrontB = 0;
        
        this.maxQueueSize = 10;
        
        this.queueRearA = this.maxQueueSize - 1;
        this.queueRearB = this.maxQueueSize - 1;
        
        this.list = new Integer[2][this.maxQueueSize];
    }
    
    public void addQueue(int num) {
        if(this.countA <= this.countB) {
            this.addQueueA(num);
        } else {
            this.addQueueB(num);
        }
    }
    
    public void deleteQueue() {
        if(this.countA >= this.countB) {
            this.deleteQueueA();
        } else {
            this.deleteQueueB();
        }
    }
    
    private void addQueueA(int num) {
        this.countA++;
        this.queueRearA = (this.queueRearA + 1) % this.maxQueueSize;
        list[0][this.queueRearA] = num;
        
        System.out.println("The Element named " + num + " is queued in queueA system");
    }
    
    private void deleteQueueA() {
        System.out.println(list[0][this.queueFrontA] + " has withdrawn from queueA");
        
        this.countA--;
        list[0][this.queueFrontA] = null;
        this.queueFrontA = (this.queueFrontA + 1) % this.maxQueueSize;
    }
    
    private void addQueueB(int num) {
        this.countB++;
        this.queueRearB = (this.queueRearB + 1) % this.maxQueueSize;
        list[1][this.queueRearB] = num;
        
        System.out.println("The Element named " + num + " is queued in queueB system");
    }
    
    private void deleteQueueB() {
        System.out.println(list[1][this.queueFrontB] + " has withdrawn from queueB");
        
        this.countB--;
        list[1][this.queueFrontB] = null;
        this.queueFrontB = (this.queueFrontB + 1) % this.maxQueueSize;
    }
    
    public void printQueueStatus() {
        System.out.println("The front of the queue A is: " + this.list[0][this.queueFrontA]);
        System.out.println("The back of the queue A is: " + this.list[0][this.queueRearA]);
        System.out.println("The number of elements in the Queue A is: " + this.countA);
        
        System.out.println("\nThe front of the queue B is: " + this.list[1][this.queueFrontB]);
        System.out.println("The back of the queue B is: " + this.list[1][this.queueRearB]);
        System.out.println("The number of elements in the Queue B is: " + this.countB + "\n");
    }
}

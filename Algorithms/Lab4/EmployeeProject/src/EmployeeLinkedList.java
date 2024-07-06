/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class EmployeeLinkedList {
    private EmployeeLinkedListNode headNode;
    private EmployeeLinkedListNode currentNode;
    
    public int getSum() {
        EmployeeLinkedListNode sumNode = headNode;
        int sum = 0;
        
        while(sumNode != null) {
            sum += sumNode.info.getEmp_bonus();
            sumNode = sumNode.link;
        }
        
        return sum;
    }
    
    public void add(Employee employee) {
        EmployeeLinkedListNode newNode = new EmployeeLinkedListNode(null, employee);
        
        if(headNode == null) {
            headNode = newNode;
            currentNode = newNode;
        } else {
            currentNode.link = newNode;
            currentNode = newNode;
        }
    }
    
    @Override
    public String toString() {
        EmployeeLinkedListNode currentDisplayNode = headNode;
        
        String display = "key: " + headNode.info.getEmp_id() + ", sum: " + this.getSum() + "[";
        
        while(currentDisplayNode != null) {
            display += (currentDisplayNode.info + ", ");
            currentDisplayNode = currentDisplayNode.link;
        }
        
        return display + " ]";
    }

    public EmployeeLinkedListNode getHeadNode() {
        return headNode;
    }

    public EmployeeLinkedListNode getCurrentNode() {
        return currentNode;
    }
}

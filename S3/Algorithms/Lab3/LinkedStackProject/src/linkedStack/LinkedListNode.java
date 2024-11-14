/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedStack;

/**
 *
 * @author Dell
 */
public class LinkedListNode {
    private int info;
    private LinkedListNode link;
    
    LinkedListNode(int info, LinkedListNode link) {
        this.info = info;
        this.link = link;
    }

    public int getInfo() {
        return info;
    }

    public void setInfo(int info) {
        this.info = info;
    }

    public LinkedListNode getLink() {
        return link;
    }

    public void setLink(LinkedListNode link) {
        this.link = link;
    }
    
    
}

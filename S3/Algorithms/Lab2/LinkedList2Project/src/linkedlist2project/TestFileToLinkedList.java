/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedlist2project;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Scanner;


public class TestFileToLinkedList {

    public static void main(String[] args) throws FileNotFoundException {
        LinkedListNode headNode = null, newNode, currentNode = null;

        Scanner inFile = new Scanner(new FileReader("divide.in"));

        while (inFile.hasNextLine()) {
            newNode = new LinkedListNode();

            newNode.info = new Divide();
            newNode.info.setX(inFile.nextDouble());
            newNode.info.setY(inFile.nextDouble());

            newNode.link = null;
            if (headNode == null) {
                headNode = newNode;
               
            } else {
                currentNode.link = newNode;
               
            }
            currentNode = newNode;
        }
        inFile.close();
        
        currentNode = headNode;
        while (currentNode != null) {
            System.out.println(currentNode.info.getX() + " " + currentNode.info.getY()+  " " +currentNode.info.divisionOp());
            currentNode = currentNode.link;
        }
    }
}



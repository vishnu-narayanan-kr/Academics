/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class LinkedStackClass {

    BookNode stackTop;

    public void push(Book book) {
        BookNode node = new BookNode(book, stackTop);
        stackTop = node;
    }

    public void print() {
        BookNode current = this.stackTop;
        int size = 0;

        while (current != null) {
            System.out.println(current.info.toString());
            System.out.print("-> Book CAN Price: " + current.info.getB_price() + "$");
            System.out.println("-> Book EUR Price: " + current.info.calculate_Price_Euro() + "$");

            size++;
            current = current.link;
        }

        System.out.println("\nThe size of stack is: " + size);

        System.out.println("StackTop: ");
        System.out.println(this.stackTop.info.toString());
    }
}

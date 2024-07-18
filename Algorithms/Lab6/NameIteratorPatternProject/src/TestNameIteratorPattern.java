/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author 2301623
 */
public class TestNameIteratorPattern {

    public static void main(String[] args) {
        System.out.println("Without using Iterator pattern");
        NameIterator myNameIterator = new NameIterator();

        for (int i = 0; i < myNameIterator.names.length; i++) {
            System.out.println("Name: " + myNameIterator.names[i]);
        }

        System.out.println("With using Iterator Pattern");
        System.out.println("Works with every collection, no exposing"
                + " of collection from testing code client");

        NameRepository myNameRepository = new NameRepository();

        System.out.println("Simple Traversal using");
        
        for(Iterator it = myNameRepository.getIterator(); it.hasNext(); ) {
            System.out.println("Name: " + (String) it.next());
        }
        
        System.out.println("Odd Traversal using");
        for(Iterator it = myNameRepository.getOddIterator(); it.hasNext(); ) {
            System.out.println("Name: " + (String) it.next());
        }
    }
}

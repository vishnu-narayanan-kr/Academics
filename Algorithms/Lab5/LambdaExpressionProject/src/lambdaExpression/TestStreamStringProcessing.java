/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author Dell
 */
public class TestStreamStringProcessing {

    public static void main(String[] args) {
        Set<String> myFruitSet = new HashSet<String>();
        

        myFruitSet.add("Pear");
        myFruitSet.add("Apple");
        myFruitSet.add("Strawberry");
        myFruitSet.add("Banana");
        myFruitSet.add("orange");
        myFruitSet.add("blackberry");

        System.out.println("Printing myFruitSet");
        myFruitSet.forEach(System.out::println);
        
        System.out.println("\nSorted");
        myFruitSet.stream().sorted().forEach(System.out::println);
        
        
        System.out.println("\nReverse Sorted");
        myFruitSet.stream().sorted(Comparator.reverseOrder()).forEach(System.out::println);
    }
}

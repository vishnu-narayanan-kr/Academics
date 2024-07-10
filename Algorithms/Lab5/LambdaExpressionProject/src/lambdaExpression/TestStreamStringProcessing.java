/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 *
 * @author Dell
 */
public class TestStreamStringProcessing {

    public static void main(String[] args) {
        Set<String> myFruitSet = new HashSet<>();
        

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
        
        System.out.println("\nUsing filter() myFruitSet Predicate length > 5: ");
        myFruitSet.stream().filter(s -> s.length() > 5)
                .forEach(System.out::println);
        
        System.out.println("\nUsing anyMatch() myFruitSet Predicate contains Banana");
        System.out.println(myFruitSet.stream().anyMatch(s -> s.equals("Banana")));
        
        System.out.println("\nUsing anyMatch() myFruitSet Predicate contains Banana case insensitive");
        System.out.println(myFruitSet.stream().anyMatch(s -> s.equalsIgnoreCase("banana")));
        
        System.out.println("\nUsing anyMatch() myFruitSet Predicate element starts with st");
        System.out.println(myFruitSet.stream().anyMatch(s -> s.startsWith("St")));
        
        System.out.println("\nUsing noneMatch() myFruitSet Predicate element doesn't starts with st");
        System.out.println(myFruitSet.stream().noneMatch(s -> s.startsWith("St")));
        
        System.out.println("\nUsing .map() to convert each element myFruitSet to Uppercase");
        List<String> myFruitList = myFruitSet.stream().map(s -> s.toUpperCase()).collect(Collectors.toList());
        myFruitList.forEach(System.out::println);
        
        Predicate<String> p1 = s -> s.contains("Banana") || s.startsWith("St");
        System.out.println("Using anyMatch() myFruit Predicate p1: " + myFruitSet.stream().anyMatch(p1));
        System.out.println("testing p1 using test() with Stpeters, BananaMan, SolongQ " 
                + p1.test("Stpeters") 
                + p1.test("Bananaman") 
                + p1.test("SolongQ"));
    }
}

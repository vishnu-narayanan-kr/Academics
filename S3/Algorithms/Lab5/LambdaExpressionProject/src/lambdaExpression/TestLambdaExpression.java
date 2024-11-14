/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author Dell
 */
public class TestLambdaExpression {

    public static void main(String[] args) {
        Set<String> myFruitSet = new HashSet<>();

        myFruitSet.add("Pear");
        myFruitSet.add("Apple");
        myFruitSet.add("Strawberry");
        myFruitSet.add("Banana");

        System.out.println("Print Elements from HashSet"
                + " using for loop");
        
        for(String str: myFruitSet) {
            System.out.println(str + ", ");
        }
        
        System.out.println("Print Elements from HashSet"
                + " using Lambda Expression");
        
        myFruitSet.forEach(n -> { System.out.println(n + ", ");});
        
        System.out.println("Print elements from HashSet using reference operator");
        
        myFruitSet.forEach(System.out::println);
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 *
 * @author Dell
 */
public class TestLambdaExpressionFunction {
    public static void main(String[] args) {
        // half references method that returns double
        Function<Integer, Double> half = (n) -> { return (n / 2.0);};
        
        double ans = half.apply(10);
        System.out.println("half as ans is " + ans);
        
        // chaining two lambdas
        Function<Integer, Double> half2 = half.andThen(b -> b*3);
        ans = half2.apply(10);
        System.out.println("half2 ans as is " + ans);
        
        List<Integer> numberList = new ArrayList<>();

        numberList.add(10);
        numberList.add(15);
        numberList.add(5);
        numberList.add(-9);
        numberList.add(3);
        
        System.out.println("Apply half method to each element");
        Consumer<Integer> consumerHalf = (n) -> System.out.println(half.apply(n));
        
        numberList.forEach(consumerHalf);
        
        System.out.println("Apply half2 method to each element");
        Consumer<Integer> consumerHalf2 = (n) -> System.out.println(half2.apply(n));
        
        numberList.forEach(consumerHalf2);
        
        System.out.println("Apply half2 Function to each element of ArrayList ver2");
        numberList.forEach((n) -> invokeHalf2(n, half2));
        
    }
    
    private static void invokeHalf2(int n, Function<Integer, Double> half2) {
        System.out.println(half2.apply(n));
    }
}

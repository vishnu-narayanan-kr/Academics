/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

/**
 *
 * @author Dell
 */
public class TestLambdaExpressionConsumerMethod {

    public static void main(String[] args) {
        List<Integer> numberList = new ArrayList<>();

        numberList.add(10);
        numberList.add(15);
        numberList.add(5);
        numberList.add(-9);
        numberList.add(3);

        System.out.println("Invoke simple method");

        Consumer<Integer> methodToDouble = (n) -> {
            System.out.println(n * 2);
        };
        numberList.forEach(methodToDouble);

        System.out.println("Invoke complex method");
        Consumer<Integer> fullMethod = (n) -> {
            int x = 2;
            System.out.println(n * 2 + x);
        };

        numberList.forEach(fullMethod);

        System.out.println("Invoke complex method providing clear coding");
        fullMethod = (n) -> invokeFullMethod(n);
        
        numberList.forEach(fullMethod);
        
        System.out.println("Invoke without a collection");
        fullMethod.accept(10);
    }

    private static void invokeFullMethod(int num) {
        int x = 2;
        double y = x - 6;
        System.out.println(num * 2 + x * y);
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 *
 * @author Dell
 */
public class TestStreamNumberProcessing {

    public static void main(String[] args) {

        List<Double> numberList = new ArrayList();

        numberList.add(149.99);
        numberList.add(25.0);
        numberList.add(55.99);
        numberList.add(14.99);
        numberList.add(69.99);
        numberList.add(189.99);

        System.out.println("Print all the elements of number list");
        numberList.forEach(System.out::println);

        // count the number of elements higher than 60 in normal way
        int count = 0;

        for (int i = 0; i < numberList.size(); i++) {
            if (numberList.get(i) > 60) {
                count++;
            }
        }

        System.out.println("The number of elements greater than 60: " + count);

        System.out.println("Using filter() to calculate the number of elements higher than 60: "
                + numberList.stream().filter(e -> e > 60).count());

        System.out.println("Using sorted() Number of elements sorted: ");
        numberList.stream().sorted().forEach(System.out::println);

        // Block1
        int comp = Double.compare(9, 9);
        System.out.println("Compare: " + comp);

        System.out.println("The maximum value is: "
                + numberList.stream().max(Double::compare).get());
        System.out.println("The maximum value is: "
                + numberList.stream().max((e1,e2) -> Double.compare(e1,e2)).get());
        
        System.out.println("The minimum value is: "
                + numberList.stream().min(Double::compare).get());
        
        System.out.println("Using sorted() reverse: ");
        numberList.stream().sorted(Comparator.reverseOrder())
                .forEach(System.out::println);
    }
}

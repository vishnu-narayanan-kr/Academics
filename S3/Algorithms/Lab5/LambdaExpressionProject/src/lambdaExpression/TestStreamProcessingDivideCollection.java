/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 *
 * @author Dell
 */
public class TestStreamProcessingDivideCollection {
    public static void main(String[] args) throws FileNotFoundException {
        Set divideInFileSet = new HashSet<Divide>();

        Scanner inFile = new Scanner(new File("divide.in"));

        while (inFile.hasNextLine()) {
            double x = inFile.nextDouble();
            double y = inFile.nextDouble();

            Divide divide = new Divide();
            divide.setX(x);
            divide.setY(y);

            divideInFileSet.add(divide);
        }

        Consumer<Divide> printDivideHashSet = (divide) -> {
            System.out.println("Divide x: " + divide.getX() + ", y: " + divide.getY());
        };

        System.out.println("Print Hash Set using Lambda Expression: ");
        divideInFileSet.forEach(printDivideHashSet);

        // Apply Stream Processing
        System.out.println("Apply Stream Processing: ");
        // Using Stream Processing filter Method where calculateDivision() in the HashSet
        // whose Total calculateDivision() > 20(two records)
        System.out.println("whose Total calculateDivision() > 20(two seconds)");
        
        Predicate<Divide> filter1 = divide -> { return divide.getDivision2() > 20;};
        
        divideInFileSet.stream().filter(filter1).forEach(System.out::println);
        
        // divideInFileSet sorted by first column x
        System.out.println("divideInFileSet sorted by first column x");
        divideInFileSet.stream().sorted(Comparator.comparingDouble(Divide::getX)).forEach(System.out::println);
        
        // divideInFileSet sorted by second column y
        System.out.println("divideInFileSet sorted by first column y");
        divideInFileSet.stream().sorted(Comparator.comparingDouble(Divide::getY)).forEach(System.out::println);
        
        // divideInFileSet sorted by calculateDivision() -> 11.25 12.5625
        System.out.println("divideInFileSet sorted by first column calculate Division");
        divideInFileSet.stream().sorted(Comparator.comparingDouble(Divide::getDivision2)).forEach(System.out::println);
        
        // max of divideInFileSet with respect to calculateDivision(): expected outcome 22.25
        System.out.println("max of divideInFileSet with respect to calculateDivision2(): expected outcome 22.25");
        System.out.println(((Divide)divideInFileSet.stream().max(Comparator.comparingDouble(Divide::getDivision2)).get()).getDivision2());
        
        // min of divideInFileSet with respect to calculateDivision(): expected outcome 11.25
        System.out.println("min of divideInFileSet with respect to calculateDivision2(): expected outcome 11.25");
        System.out.println(((Divide)divideInFileSet.stream().min(Comparator.comparingDouble(Divide::getDivision2)).get()).getDivision2());
        
        System.out.println("Create partial collection whose records satisfying calculateDivision2() > 20");
        List<Divide> newDivideArrayList = (List<Divide>) divideInFileSet.stream().filter(e -> ((Divide)e).getDivision2() > 20)
                .collect(Collectors.toList());
        
        newDivideArrayList.forEach(System.out::println);
        
        System.out.println("divideHashSet sorted by column x");
        divideInFileSet.stream().sorted((e1, e2) -> Double.compare(((Divide)e1).getX(), ((Divide)e2).getX()))
                .forEach(System.out::println);
        
        
    }   
}

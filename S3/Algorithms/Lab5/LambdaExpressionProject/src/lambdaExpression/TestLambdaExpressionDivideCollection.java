/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 *
 * @author Dell
 */
public class TestLambdaExpressionDivideCollection {

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

        System.out.println("Print Hash Set using Consumer");
        divideInFileSet.forEach(printDivideHashSet);

        System.out.println("Print Hash Set using :: reference operator");
        divideInFileSet.forEach(System.out::println);

        System.out.println("Use divMethod consumer method to perform x/y");

        Consumer<Divide> divMethod = (divide) -> {
            double result = divide.getDivision();

            System.out.println(divide + ", x/y: " + result);
        };
        
        divMethod = (n) -> {System.out.println( ", x/y: " + n.getX()/n.getY()); };


        divideInFileSet.forEach(divMethod);

        System.out.println("Test divMethod.accept");

        Divide testDivide = new Divide();

        testDivide.setX(5.5);
        testDivide.setY(1.1);

        divMethod.accept(testDivide);

        System.out.println("divMethod2 of type consumer using :: operator");

        Consumer<Divide> divMethod2 = Divide::printDivision;

        divideInFileSet.forEach(divMethod2);

        System.out.println("divMethod3 of type function that returns (n*3) / (n - 2)"
                + "where n = field1 + field2");

        Function<Divide, Double> divMethod3 = divide -> {
            double n = divide.getX() + divide.getY();
         
            return (n * 3) / (n - 2);
        };
          
        divideInFileSet.forEach(divide -> {
            System.out.println(divide + ": divMethod3: " + divMethod3.apply((Divide) divide));
        });
        
        inFile.close();
    }
}

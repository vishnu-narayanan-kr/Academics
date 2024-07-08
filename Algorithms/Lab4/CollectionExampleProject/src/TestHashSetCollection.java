
import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Scanner;
import java.util.Set;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestHashSetCollection {
    // LinkedHashSet maintains the order
    // HashSet doesn't

    public static void main(String[] args) throws FileNotFoundException {
        Set<Divide> divideHashSet = new LinkedHashSet();
        Scanner scanner = new Scanner(new File("divide.in"));

        while (scanner.hasNextLine()) {
            Divide divide = new Divide();
            divide.setX(scanner.nextDouble());
            divide.setY(scanner.nextDouble());

            divideHashSet.add(divide);
        }

        scanner.close();

        for (Divide divide : divideHashSet) {
            System.out.println("x: " + divide.getX() + ", y: " + divide.getY());
        }
    }
}

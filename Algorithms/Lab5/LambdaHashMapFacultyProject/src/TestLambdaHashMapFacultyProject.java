
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestLambdaHashMapFacultyProject {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new File("Faculty.in"));

        inFile.useDelimiter("[\t\r\n]+");

        Map<Integer, Faculty> facultyHashMap = new HashMap();

        while (inFile.hasNextLine()) {
            int id = inFile.nextInt();
            String lname = inFile.next();
            String fname = inFile.next();
            double salary = inFile.nextDouble();
            double bonusRate = inFile.nextDouble();

            Faculty newFaculty = new Faculty(id, lname, fname, salary, bonusRate);
            facultyHashMap.put(id, newFaculty);
        }

        inFile.close();

        System.out.println("\nPrinting all the keys of facultyHashMap");
        facultyHashMap.forEach((k, v) -> System.out.println(k));

        System.out.println("\nPrinting all the values of facultyHashMap");
        facultyHashMap.forEach((k, v) -> System.out.println(v));

        System.out.println("\nPrinting all the values of facultyHashMap sorted by Key");
        facultyHashMap
                .values()
                .stream()
                .sorted(Comparator.comparingInt(Faculty::getF_id))
                .forEach(System.out::println);

        System.out.println("\nPrinting all the values of facultyHashMap sorted by doCalc_Bonus");
        facultyHashMap
                .values()
                .stream()
                .sorted(Comparator.comparingDouble(Faculty::doCalc_Bonus))
                .forEach(System.out::println);
        
        System.out.println("\nPrinting Faculty with Max bonus");
        Faculty maxBonusFaculty = facultyHashMap
                .values()
                .stream()
                .max((f1, f2) -> Double.compare(f1.getF_BonusRate(), f2.getF_BonusRate()))
                .get();
        
        System.out.println(maxBonusFaculty);
        
        System.out.println("\nCreating and Displaying new key list from Map collection (Sorted by Value doCalc_Bonus)");
        List<Integer> keyList1 = facultyHashMap
                .values()
                .stream()
                .sorted(Comparator.comparingDouble(Faculty::doCalc_Bonus))
                .map(f -> f.getF_id())
                .collect(Collectors.toList());
        
        keyList1.forEach(System.out::println);
        
        System.out.println("\nCreating and Displaying new value list from Map collection (Sorted by Value doCalc_Bonus)");
        List<Faculty> keyList2 = facultyHashMap
                .values()
                .stream()
                .sorted(Comparator.comparingDouble(Faculty::doCalc_Bonus))
                .collect(Collectors.toList());
        
        keyList2.forEach(System.out::println);
        
        System.out.println("\nUsing filter() to search for any matching of Faculty last name \"Smith\" in HashMap");
        facultyHashMap
                .values()
                .stream()
                .filter(f -> f.getF_Lname().equals("Smith"))
                .forEach(System.out::println);
        
        System.out.println("\nUsing filter() to search for any matching of Faculty bonus rate of \\\"1.5\\\" in HashMap");
        facultyHashMap
                .values()
                .stream()
                .filter(f -> f.getF_BonusRate() == 1.5)
                .forEach(System.out::println);
    }
}

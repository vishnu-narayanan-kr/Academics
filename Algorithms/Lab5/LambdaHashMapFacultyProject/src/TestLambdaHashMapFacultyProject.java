
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

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
        
        while(inFile.hasNextLine()) {
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
        facultyHashMap.forEach((k,v) ->System.out.println(k));
        
        System.out.println("\nPrinting all the values of facultyHashMap");
        facultyHashMap.forEach((k,v) ->System.out.println(v));
        
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
    }
}

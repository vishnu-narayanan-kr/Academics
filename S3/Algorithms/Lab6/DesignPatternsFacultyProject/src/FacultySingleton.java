
import java.io.File;
import java.io.FileNotFoundException;
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
public class FacultySingleton {

    private Map<Integer, Faculty> facultyHashMap = null;
    private static FacultySingleton instance = null;

    private FacultySingleton() {
        Scanner inFile = null;
        
        try {
            inFile = new Scanner(new File("Faculty.in"));

            inFile.useDelimiter("[\t\r\n]+");

            facultyHashMap = new HashMap();

            while (inFile.hasNextLine()) {
                int id = inFile.nextInt();
                String lname = inFile.next();
                String fname = inFile.next();
                double salary = inFile.nextDouble();
                double bonusRate = inFile.nextDouble();

                Faculty newFaculty = new Faculty(id, lname, fname, salary, bonusRate);
                facultyHashMap.put(id, newFaculty);
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        } finally {
            if(inFile != null) {
                inFile.close();
            }
        }
    }

    public static FacultySingleton getInstance() {
        if (instance == null) {
            instance = new FacultySingleton();
        }

        return instance;
    }

    public Map getFacultyHashMap() {
        return facultyHashMap;
    }
}

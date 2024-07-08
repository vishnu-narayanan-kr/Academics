
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeMap;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestTreeMapCollection {
    public static void main(String[] args) throws FileNotFoundException {
        // Read from input file course.in in lab2
        // and load it into HashMap collection
        TreeMap<String, Course> courseHashMap = new TreeMap();
        
        Scanner inFile = new Scanner(new File("course.in"));
        
        while(inFile.hasNextLine()) {
            String course_no = inFile.next();
            String course_name = inFile.next();
            inFile.nextInt();
            int max_enrl = inFile.nextInt(); 
            
            Course course = new Course(course_no, course_name, max_enrl);
            courseHashMap.put(course.getCourse_no(), course);
        }
        
        // Do the search from the console using .get()
        Scanner input = new Scanner(System.in);
        
        System.out.println("Enter course no to search: ");
        String searchNo = input.next();
        
        Course foundCourse = courseHashMap.get(searchNo);
        
        if (foundCourse != null) {
            System.out.println(foundCourse);
        } else {
            System.out.println("No course found!");
        }
        
        // Print HashMap key collection by
        // call the appropriate method ...()
        Set<String> courseKeys = courseHashMap.keySet();
        
        System.out.println("All course keys: ");
        
        for(String key: courseKeys) {
            System.out.print(key + ", ");
        }
        
        System.out.println("\n");
        
        // Print HashMap values collection by
        // calling the appropriate method ...()
        Collection<Course> courses = courseHashMap.values();
        
        System.out.println("All courses: ");
        
        for(Course course: courses) {
            System.out.print(course + ", ");
        }
    }
}


import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestCourseArrayListCollection {
    public static void main(String[] args) throws FileNotFoundException {
        // read from course.in used in Lab2
        Scanner inFile = new Scanner(new File("course.in"));
        
        // load it into arraylist
        List<Course> courseArrayList = new ArrayList();
        
        while(inFile.hasNext()) {
            String course_no = inFile.next();
            String course_name = inFile.next();
            inFile.nextInt();
            int max_enrl = inFile.nextInt();
            
            Course course = new Course(course_no, course_name, max_enrl);
            courseArrayList.add(course);
        }
        
        inFile.close();
        
        // print using get()
        System.out.println("Printing using get()");
        for(int i = 0; i < courseArrayList.size(); i++) {
            System.out.println(courseArrayList.get(i).toString());
        }
        
        ListIterator<Course> it = courseArrayList.listIterator();
        
        // print using the iterator traverse forward
        System.out.println("Printing using iterator forward");
        while(it.hasNext()) {
            System.out.println(it.next().toString());
        }
        
        // print using the iterator traverse backward
        System.out.println("Printing using iterator backward");
        while(it.hasPrevious()) {
            System.out.println(it.previous().toString());
        }
    }
}

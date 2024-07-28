
import java.util.ArrayList;
import java.util.List;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestCourseMVCPattern {
    public static void main(String[] args) {
        List<Course> list = new ArrayList();
        
        list.add(new Course("12345", "Embedded Systems Design", 254));        
        list.add(new Course("34572", "Control Systems Design", 350));
        list.add(new Course("37562", "Finite Model Analyis", 105));
        list.add(new Course("93729", "Engineering Physics", 75));
        
        CourseView view = new CourseView();
        
        CourseController courseController = new CourseController(list, view);
        
        courseController.printView();
    }
}

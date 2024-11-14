
import java.util.ArrayList;
import java.util.List;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author 2301623
 */
public class CourseSingleton {
    private static CourseSingleton courseSingleton;
    private List<Course> courseList;
    
    public static CourseSingleton getInstance() {
        if (courseSingleton == null) {
            courseSingleton = new CourseSingleton();
        }
        
        return courseSingleton;
    }
    
    private CourseSingleton() {
        courseList = new ArrayList<Course>();
        
        for(int i = 0; i < 7; i++) {
            Course course = new Course();
            course.setCourse_name("course #" + i);
            courseList.add(course);
        }
    }
    
    public List<Course> getCourses() {
        return courseList;
    }
}

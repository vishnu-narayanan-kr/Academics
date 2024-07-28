
import java.util.List;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class CourseController {
    private List<Course> model;
    private CourseView view;
    
    public CourseController(List<Course> model, CourseView view) {
        this.model = model;
        this.view = view;
    }
    
    public void printView() {
        view.print(model);
    }
}

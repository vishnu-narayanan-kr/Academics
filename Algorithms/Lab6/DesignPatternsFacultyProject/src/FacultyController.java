
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class FacultyController {
    private Map<Integer, Faculty> model;
    private View view;
    
    public FacultyController(Map<Integer, Faculty> model, View view) {
        this.model = model;
        this.view = view;
    }
    
    public void updateModel(Map<Integer, Faculty> model) {
        this.model = model;
    }
    
    public void setView(View view) {
        this.view = view;
    }
    
    public void printView() {
        view.print(model);
    }
}

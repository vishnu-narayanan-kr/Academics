
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class FacultyView implements View {
    @Override
    public void print(Map<Integer, Faculty> facultyHashMap) {
        System.out.println("Printing Faculty HashMap Keys using Lambda expression with FacultyView");
        facultyHashMap.forEach((k, v) -> System.out.println(k));
        System.out.println("Printing Faculty HashMap Values using Lambda expression FacultyView");
        facultyHashMap.forEach((k, v) -> System.out.println(v));
    }
    
    public void print(Object entry) {
        System.out.println("Printing Single Faculty Entry FacultyView");
        System.out.println(((Map.Entry<Integer, Faculty>) entry).getValue());
    }
}

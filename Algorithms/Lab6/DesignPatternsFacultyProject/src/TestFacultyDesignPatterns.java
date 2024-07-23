
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestFacultyDesignPatterns {
    public static void main(String[] args) {
        Map<Integer, Faculty> facultyHashMap = FacultySingleton.getInstance().getFacultyHashMap();
        
        facultyHashMap.forEach((k, v) -> System.out.println(v));
    }
}

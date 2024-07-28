
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class FacultyRepository {

    private Map<Integer, Faculty> map;

    public FacultyRepository(Map<Integer, Faculty> map) {
        this.map = map;
    }
    
    public Iterator getFacultyRateIterator(Double rate) {
        return new FacultyRateIterator(map, rate);
    }
    
    public Iterator getFacultySalaryIterator() {
        return new FacultySalaryIterator(map);
    }
}

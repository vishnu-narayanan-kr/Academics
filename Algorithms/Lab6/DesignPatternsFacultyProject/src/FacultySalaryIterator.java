
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class FacultySalaryIterator implements Iterator {
    private final java.util.Iterator<Map.Entry<Integer, Faculty>> iterator;
    private final Map<Integer, Faculty> map;
    
    public FacultySalaryIterator(Map<Integer, Faculty> map) {
        this.map = map
                .values()
                .stream().sorted((f1, f2) -> Double.compare(f2.getF_Salary(), f1.getF_Salary())).collect(Collectors.toMap(f -> f.getF_id(), f -> f, (e,r) -> e, LinkedHashMap::new));
        
        this.iterator = this.map.entrySet().iterator();
    }
    
    @Override
    public boolean hasNext() {
        return iterator.hasNext();
    }

    @Override
    public Object next() {
        return iterator.next();
    }
}

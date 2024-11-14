
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class FacultyRateIterator implements Iterator {
    private final java.util.Iterator<Entry<Integer, Faculty>> iterator;
    private final Map<Integer, Faculty> map;
    
    public FacultyRateIterator(Map<Integer, Faculty> map, double rate) {
        this.map = map
                .values()
                .stream().filter(f -> f.getF_BonusRate() == rate).collect(Collectors.toMap(f -> f.getF_id(), f -> f));
        
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

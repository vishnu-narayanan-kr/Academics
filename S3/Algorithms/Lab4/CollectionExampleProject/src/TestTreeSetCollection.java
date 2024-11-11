
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestTreeSetCollection {
    public static void main(String[] args) {
        
        SortedSet<String> mySet = new TreeSet<>();
        
        // order is not maintained in the HashSet
        
        mySet.add("Pear");
        mySet.add("Apple");
        mySet.add("Strawberry");
        mySet.add("Banana");
        
        System.out.println("Prints Elements in Ascending order from TreeSet");
        
        for(String str: mySet) {
            System.out.println(str);
        }
    }
}

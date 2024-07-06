/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package arraylistprocessproject;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Dell
 */
public class TestArrayList1 {
    public static void main(String[] args) {
        List<String> nameList = new ArrayList<>();
        
        String[] names = {"Ann", "Bob", "Carol", "Ali"};
        
        int index = 0;
        
        // reading from the array
        for (index = 0; index < names.length; index++) {
            nameList.add(names[index]);
        }
        
        // print arraylist
        for (index = 0; index < nameList.size(); index++) {
            System.out.println("Array list " + index + " : " + nameList.get(index));
        }
    }
}

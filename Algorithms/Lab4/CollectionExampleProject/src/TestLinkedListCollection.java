
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestLinkedListCollection {

    public static void main(String[] args) {
        List<String> nameList = new LinkedList<>();

        String[] names = {"Ann", "Manu", "Deepak", "Rahul"};

        // read from array and intsert it into linked list
        for (String name : names) {
           nameList.add(name);
        }
        
        // print linked list
        System.out.println("Printing namelist");
        for (int i = 0; i < nameList.size(); i++) {
            System.out.println(nameList.get(i));
        }
        
        // print using the iterator class
        System.out.println("Printing namelist using iterator");
        ListIterator<String> it = nameList.listIterator();
        
        while(it.hasNext()) {
            String name = it.next();
            System.out.println(name);
            if(name.equals("Manu"))
                it.set("Lee");
        }
        
        // do it = nameList.listIterator(); to reset to the first node always
        
        // print using the iterator class backward
        System.out.println("Printing backwards");
        while(it.hasPrevious()) {
            String name = it.previous();
            System.out.println(name);
        }
    }
}

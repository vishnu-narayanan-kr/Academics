
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Scanner;
import java.util.Set;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestCDInventoryFinalExam {

    public static void main(String[] args) throws FileNotFoundException {
        Set<CDInventory> cdSet = new LinkedHashSet();

        Scanner inFile = new Scanner(new File("MusicCDInventory.in"));
        inFile.useDelimiter("[\t\r\n]+");

        while(inFile.hasNextLine()) {
            int no = inFile.nextInt();
            String name = inFile.next();
            int qty = inFile.nextInt();
            double price = inFile.nextDouble();
            
            CDInventory cd = new CDInventory(no, name, qty, price);
            cdSet.add(cd);
        }
        
        System.out.println("The CDInventory you entered are:" + cdSet.size());
        
        System.out.println("\nThe List of CD Inventory is:\n");
        
        Iterator it = cdSet.iterator();
        
        while(it.hasNext()) {
            System.out.println(it.next());
        }
    }
}

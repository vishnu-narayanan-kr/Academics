/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package genericPointProject;

/**
 *
 * @author Dell
 */
public class TestGenericPoint {
    public static void main(String[] args) {
        Point<String> strPoint = new Point("Anna", "Banana");
        
        System.out.println(strPoint.toString());
        
        Point<Number> Pie = new Point(3.14, 2.71);
        System.out.println(Pie.toString());
        
        Integer[] x = {2, 4, 9, 10};
        String[] strName = {"Su", "Khan", "Robertson", "Lee"};
        
        strPoint.printArray(x);
        strPoint.printArray(strName);
        strPoint.printArray2(2);
        strPoint.printArray2(10, 20);
    }
}

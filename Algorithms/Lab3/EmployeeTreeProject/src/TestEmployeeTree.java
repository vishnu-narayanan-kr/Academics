
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestEmployeeTree {
    public static void main(String[] args) throws FileNotFoundException {
        BinaryEmployeeTreeClass myTree = new BinaryEmployeeTreeClass();
        
        Scanner inFile = new Scanner(new File("Employee.in"));
        inFile.useDelimiter("[\t\r\n]+");
        
        while(inFile.hasNextLine()) {
            int id = inFile.nextInt();
            String name = inFile.next();
            double salary = inFile.nextDouble();
            
            Employee employee = new Employee(id, name, salary);
            
            BinaryEmployeeTreeNode newNode = new BinaryEmployeeTreeNode();
            newNode.info = employee;
            
            myTree.put(newNode);
        }
        
        inFile.close();
        
        System.out.println("Displaying the components of the Tree list stored");
        System.out.println("from input file Employee.in as Inorder Traversal\n");
        
        myTree.InorderTraversal();
    }
}

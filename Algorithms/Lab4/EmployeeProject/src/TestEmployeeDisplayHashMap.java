
import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestEmployeeDisplayHashMap {

    public static void main(String[] args) throws FileNotFoundException {
        //HashMap<Integer, EmployeeLinkedList> employeeHashMap = new LinkedHashMap();
        HashMap<Integer, EmployeeLinkedListNode> employeeHashMap = new LinkedHashMap();
        Scanner inFile = new Scanner(new File("Employee.in"));

        inFile.useDelimiter("[\t\r\n]+");

        // reading and displaying
        while (inFile.hasNextLine()) {
            EmployeeLinkedList empList = new EmployeeLinkedList();

            int id = inFile.nextInt();
            String fname = inFile.next();
            String lname = inFile.next();
            double salary = inFile.nextDouble();
            String dId = inFile.next();
            String position = inFile.next();

            boolean isReadingEmployee = true;

            while (isReadingEmployee) {
                Employee employee = new Employee();

                employee.setEmp_id(id);
                employee.setEmp_fname(fname);
                employee.setEmp_lname(lname);
                employee.setEmp_salary(salary);
                employee.setEmp_d_id(dId);
                employee.setEmp_position(position);

                int bonus = inFile.nextInt();

                if (bonus == -999) {
                    isReadingEmployee = false;
                } else {
                    employee.setEmp_bonus(bonus);
                }

                if (isReadingEmployee || empList.getHeadNode() == null) {
                    empList.add(employee);
                }
            }

            employeeHashMap.put(empList.getHeadNode().info.getEmp_id(), empList.getHeadNode());
        }

        inFile.close();

        // Display from data structure
        System.out.println("Printing from the LinkedHashMap\n");

        for (EmployeeLinkedListNode empListNode : employeeHashMap.values()) {
            EmployeeLinkedListNode currentNode = empListNode;
            int sum = 0;

            while (currentNode != null) {
                System.out.println(currentNode.info);

                sum += currentNode.info.getEmp_bonus();

                currentNode = currentNode.link;
            }

            System.out.println("Sum: " + sum);
        }

        // Search from data structure
        Scanner scanner = new Scanner(System.in);

        System.out.println("\n Enter a employee id to search from the HashMap: ");
        int searchId = scanner.nextInt();

        scanner.close();

        EmployeeLinkedListNode foundEmpListNode = employeeHashMap.get(searchId);

        if (foundEmpListNode != null) {
            System.out.print("Employee found: ");

            EmployeeLinkedListNode currentNode = foundEmpListNode;
            int sum = 0;

            while (currentNode != null) {
                System.out.println(currentNode.info);

                sum += currentNode.info.getEmp_bonus();

                currentNode = currentNode.link;
            }

            System.out.println("Sum: " + sum);
        } else {
            System.out.println("Employee NOT found");
        }
    }
}

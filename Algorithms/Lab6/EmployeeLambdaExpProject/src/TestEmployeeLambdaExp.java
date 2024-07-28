
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestEmployeeLambdaExp {

    public static void main(String[] args) throws FileNotFoundException {
        HashMap<Integer, Employee> myHashMap = new HashMap();

        Scanner inFile = new Scanner(new File("Employee.in"));

        inFile.useDelimiter("[\t\r\n]+");

        // reading and displaying
        while (inFile.hasNextLine()) {
            int id = inFile.nextInt();
            String fname = inFile.next();
            String lname = inFile.next();
            double salary = inFile.nextDouble();
            String dId = inFile.next();
            String position = inFile.next();

            boolean isReadingEmployee = true;

            ArrayList<Double> bonusList = new ArrayList();

            while (isReadingEmployee) {
                Double bonus = inFile.nextDouble();

                if (bonus == -999) {
                    isReadingEmployee = false;
                } else {
                    bonusList.add(bonus);
                }
            }

            Employee employee = new Employee();

            employee.setEmp_id(id);
            employee.setEmp_fname(fname);
            employee.setEmp_lname(lname);
            employee.setEmp_salary(salary);
            employee.setEmp_d_id(dId);
            employee.setEmp_position(position);
            employee.setEmp_bonus(bonusList);

            myHashMap.put(id, employee);
        }

        inFile.close();

        System.out.println("\nPrinting Employee HashMap Keys: ");
        myHashMap.forEach((k, v) -> System.out.println(k));

        System.out.println("\nPrinting Employee HashMap Values: ");
        myHashMap.forEach((k, v) -> System.out.println(v));

        System.out.println("\nPrinting the HashMap");
        myHashMap.values().stream().forEach(e -> {

            System.out.println(e);

            e.getEmp_bonus().stream().forEach(bonus -> {
                System.out.println("bonus: " + bonus + ", bonus tax: " + Math.round(bonus * (Employee.f_tax + Employee.p_tax + 1) * 100) / 100.00);
            });
        });
    }
}


import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestArrayListPayRoll {

    public static void main(String[] args) throws FileNotFoundException {
        ArrayList<PayRollEmployee> payRollArrList = new ArrayList();

        System.out.println("Reading from payroll.in input file: ");

        Scanner scanner = new Scanner(new File("payroll.in"));

        while (scanner.hasNextLine()) {
            PayRollEmployee pre = new PayRollEmployee();

            pre.setEmp_id(scanner.nextInt());
            pre.setEmp_name(scanner.next());
            pre.setEmp_ssn(scanner.next());
            pre.setNumber_whr(scanner.nextInt());
            pre.setH_rate(scanner.nextDouble());

            payRollArrList.add(pre);
        }

        scanner.close();

        System.out.println("Printing from ArrayList payRollArrList and perform processing\n");

        double totalIncomeAmount = 0.0;
        double totalNetAmount = 0.0;
        double totalDeductionAmount = 0.0;

        for (int i = 0; i < payRollArrList.size(); i++) {
            PayRollEmployee current = payRollArrList.get(i);

            System.out.println("payRollArrList[" + i + "] " + current.toString());

            System.out.println("\tThe Total earning is: " + String.format("%.2f", current.calculate_TotalIncome()) + "$\n");

            System.out.println("\tThe Fed_Tax deduction is " + String.format("%.2f", current.calculate_TotalIncome() * PayRollEmployee.Fed_Tax) + "$");
            System.out.println("\tThe Prv_Tax deduction is " + String.format("%.2f", current.calculate_TotalIncome() * PayRollEmployee.Prv_Tax) + "$");
            System.out.println("\tThe QP_ins deduction is " + String.format("%.2f", current.calculate_TotalIncome() * PayRollEmployee.QP_ins) + "$");
            System.out.println("\tThe E_ins deduction is " + String.format("%.2f", current.calculate_TotalIncome() * PayRollEmployee.E_ins) + "$");
            System.out.println("\tThe Qpp deduction is " + String.format("%.2f", current.calculate_TotalIncome() * PayRollEmployee.Qpp) + "$");
            System.out.println("\tThe Union_d deduction is " + String.format("%.2f", current.calculate_TotalIncome() * PayRollEmployee.Union_d) + "$");
            System.out.println("\tThe Total deduction is " + String.format("%.2f", current.calculate_TotalDeduction()) + "$\n\n");

            System.out.println("\tThe Total net amount is " + String.format("%.2f", current.calculate_TotalNetIncome()) + "$\n");

            totalIncomeAmount += current.calculate_TotalIncome();
            totalNetAmount += current.calculate_TotalNetIncome();
            totalDeductionAmount += current.calculate_TotalDeduction();
        }

        System.out.println("All Employees Total Income Amount is " + String.format("%.2f",totalIncomeAmount) + "$");
        System.out.println("All Employees Total Net Amount is " + String.format("%.2f",totalNetAmount) + "$");
        System.out.println("All Employees Total Deduction Amount is " + String.format("%.2f",totalDeductionAmount) + "$");
    }
}

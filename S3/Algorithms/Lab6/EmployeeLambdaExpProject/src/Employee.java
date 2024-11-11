
import java.util.ArrayList;
import java.util.List;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class Employee {
    private int emp_id;
    private String emp_fname;
    private String emp_lname;
    private double emp_salary;
    private String emp_d_id;
    private String emp_position;
    private List<Double> emp_bonus;
    
    public static double f_tax = 0.06;
    public static double p_tax = 0.075;
    
    @Override
    public String toString() {
        return "[Employee: id " + this.emp_id + ", fname: " + this.emp_fname + ", lname: " + this.emp_lname + ", salary: " + this.emp_salary + ", d_id: " + this.emp_d_id + ", position: " + this.emp_position + ", bonus=" + this.emp_bonus + "]";
    }
    
    Employee(){
        this.emp_id = 0;
        this.emp_fname = "";
        this.emp_lname = "";
        this.emp_salary = 0.0;
        this.emp_d_id = "";
        this.emp_position = "";
        this.emp_bonus = new ArrayList();
    }

    public int getEmp_id() {
        return emp_id;
    }

    public void setEmp_id(int emp_id) {
        this.emp_id = emp_id;
    }

    public String getEmp_fname() {
        return emp_fname;
    }

    public void setEmp_fname(String emp_fname) {
        this.emp_fname = emp_fname;
    }

    public String getEmp_lname() {
        return emp_lname;
    }

    public void setEmp_lname(String emp_lname) {
        this.emp_lname = emp_lname;
    }

    public double getEmp_salary() {
        return emp_salary;
    }

    public void setEmp_salary(double emp_salary) {
        this.emp_salary = emp_salary;
    }

    public String getEmp_d_id() {
        return emp_d_id;
    }

    public void setEmp_d_id(String emp_d_id) {
        this.emp_d_id = emp_d_id;
    }

    public String getEmp_position() {
        return emp_position;
    }

    public void setEmp_position(String emp_position) {
        this.emp_position = emp_position;
    }

    public List<Double> getEmp_bonus() {
        return emp_bonus;
    }

    public void setEmp_bonus(List<Double> emp_bonus) {
        this.emp_bonus = emp_bonus;
    }
}

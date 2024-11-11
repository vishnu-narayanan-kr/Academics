
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
public class TestGradeProject {

    public static void main(String[] args) throws FileNotFoundException {
        /*    
        // testing Grade class
        Grade testClass = new Grade(123, "Narayanan", "Vishnu", 70, 60, 60, 90, 70);
        System.out.println(testClass.toString());
        System.out.println("Test Average Grade: " + testClass.Calculate_GradeAverage());
         */
        // create parallel arrays
        int[] studentIds = new int[6];
        String[] studentLastnames = new String[6], studentFirstnames = new String[6];
        double[][] grades = new double[6][5];
        
        // Instantiate the Grade Array
        Grade[] all_sgrades = new Grade[6];

        for (int i = 0; i < all_sgrades.length; i++) {
            all_sgrades[i] = new Grade();
        }

        // Read from file and store data into array of objects and to parallel arrays
        Scanner inFile = new Scanner(new File("Grade.in"));

        int index = 0;

        while (inFile.hasNextLine()) {
            Grade current = all_sgrades[index];
            
            int studentId = inFile.nextInt();
            current.setStudent_id(studentId);
            studentIds[index] = studentId;
            
            String lastName = inFile.next();
            current.setStudent_lname(lastName);
            studentLastnames[index] = lastName;
            
            String firstName = inFile.next();
            current.setStudent_fname(firstName);
            studentFirstnames[index] = firstName;
            
            int ass1 = inFile.nextInt();
            current.setS_grade_assignment1(ass1);
            grades[index][0] = ass1;
            
            int ass2 = inFile.nextInt();
            current.setS_grade_assignment2(ass2);
            grades[index][1] = ass2;
            
            int ass3 = inFile.nextInt();
            current.setS_grade_assignment3(ass3);
            grades[index][2] = ass3;
            
            int midTerm = inFile.nextInt();
            current.setS_grade_midTerm(midTerm);
            grades[index][3] = midTerm;
            
            int finalTerm = inFile.nextInt();
            current.setS_grade_finalTerm(finalTerm);
            grades[index][4] = finalTerm;
            
            index++;
        }

        double allStudentsGradeSum = 0.0;

        // Display information from Array with Average Grade
        for (int i = 0; i < all_sgrades.length; i++) {
            Grade current = all_sgrades[i];

            System.out.println(i + 1 + ") Student Lastname: " + current.getStudent_lname() + ", Student Firstname: " + current.getStudent_fname() + "\n");

            System.out.println("Assignment 1: " + current.getS_grade_assignment1());
            System.out.println("Assignment 2: " + current.getS_grade_assignment2());
            System.out.println("Assignment 3: " + current.getS_grade_assignment3());
            System.out.println("Mid Term Exam: " + current.getS_grade_midTerm());
            System.out.println("Final Exam: " + current.getS_grade_finalTerm());

            double averageGrade = current.Calculate_GradeAverage();
            allStudentsGradeSum += averageGrade;

            System.out.println("\nThe average grade of this student is: " + averageGrade + "\n");
        }

        double allStudentsGradeAverage = (double)allStudentsGradeSum / index;
        
        System.out.println("The number of students in the file is: " + index);
        System.out.println("The average score for all students is: " + String.format("%.2f", allStudentsGradeAverage));
    
        // print from Arrays, Paralle Arrays, and Multi-dimensional Arrays
        System.out.println("\n\nParallel Arrays");
        System.out.println("\nStudent IDs");
        for(int i = 0; i < studentIds.length; i++) {
            System.out.println("Student ID: " + studentIds[i]);
        }
        
        System.out.println("\nStudent names");
        for(int i = 0, j = 0; i < studentFirstnames.length && j < studentLastnames.length; i++, j++) {
            System.out.println("Student FirstName: " + studentFirstnames[i] + ", LastName: " + studentLastnames[j]);
        }
        
        System.out.println("\nStudent grades");
        for(int i = 0; i < grades.length; i++) {
            for(int j = 0; j < grades[i].length; j++) {
                System.out.print(grades[i][j] + ",");
            }
            System.out.print("\n");
        }
    }
}

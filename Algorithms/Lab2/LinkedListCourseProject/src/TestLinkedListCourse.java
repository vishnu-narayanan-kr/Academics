
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
public class TestLinkedListCourse {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new File("course.in"));

        LinkedListNode headNode = null, currentNode = null;

        while (inFile.hasNextLine()) {
            String course_no = inFile.next();
            String course_name = inFile.next();
            inFile.nextInt(); // not reading credits since it's constant for all courses
            int max_enrl = inFile.nextInt();

            Course course = new Course(course_no, course_name, max_enrl);
            LinkedListNode newNode = new LinkedListNode(course, null);

            if (headNode == null) {
                headNode = newNode;
                currentNode = newNode;
            } else {
                currentNode.link = newNode;
                currentNode = newNode;
            }
        }

        inFile.close();

        System.out.println("Displaying the components of the Linked List \n\n");

        currentNode = headNode;

        while (currentNode != null) {
            System.out.println(currentNode.info.toString());
            currentNode = currentNode.link;
        }

        System.out.println("Enter the course code you are looking for: ");

        Scanner input = new Scanner(System.in);
        String wcourse_code = input.next();

        Course foundCourse = Course.searchCourses(headNode, wcourse_code);

        if (foundCourse != null) {
            System.out.println("\n\nThe course you are looking for is: ");
            System.out.println(foundCourse.toString());
        } else {
            System.out.println("\n\nNo course found with code: " + wcourse_code + "\n");
        }

        input.close();
    }
}

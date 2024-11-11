/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author 2301623
 */
public class TestCourseSingletonPattern {
    public static void main(String[] args) {
        CourseSingleton cs = CourseSingleton.getInstance();
        cs.getCourses().forEach(System.out::println);
    }
}

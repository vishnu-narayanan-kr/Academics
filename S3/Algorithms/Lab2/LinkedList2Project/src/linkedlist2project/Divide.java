/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package linkedlist2project;


public class Divide {

    private double x;
    private double y;

    public Divide() {
        this.x = 0.0;
        this.y = 0.0;
    }

    public Divide(double x, double y) {
        super();
        this.x = x;
        this.y = y;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    // Add instance methods
    public double additionOp() {
        return this.x + this.y;
    }

    public double subtractionOp() {
        return this.x - this.y;
    }

    public double multiplicationOp() {
        return this.x * this.y;
    }

    public double divisionOp() {
        return this.x / this.y;
    }

    public static boolean searchX(double xSearch, Divide[] divideArrayObj) {
        boolean searchFound = false;

        for(int index = 0; index < divideArrayObj.length; index++) {
            if (xSearch == divideArrayObj[index].getX()) {
                searchFound = true;
                break;
            }
        }

        if (searchFound) {
            System.out.println("x = " + xSearch + " does exist.");
        } else {
            System.out.println("x = " + xSearch + " does not exist.");
        }

        return searchFound;
    }

    public static boolean searchY(double ySearch, Divide[] divideArrayObj) {
        boolean searchFound = false;

        for (int index = 0; index < divideArrayObj.length; index++) {
            if (ySearch == divideArrayObj[index].getY()) {
                searchFound = true;
                break;
            }
        }

        if (searchFound) {
            System.out.println("x = " + ySearch + " does exist.");
        } else {
            System.out.println("x = " + ySearch + " does not exist.");
        }

        return searchFound;
    }

}

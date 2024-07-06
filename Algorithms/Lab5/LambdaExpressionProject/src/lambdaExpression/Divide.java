/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package lambdaExpression;

/**
 *
 * @author Dell
 */
public class Divide {

    private double x;
    private double y;

    @Override
    public String toString() {
        return "Division x: " + x + " , y: " + y + ", calculateDivision2: " + getDivision2();
    }

    public void printDivision() {
        if (y == 0) {
            System.out.println("Divide by zero error");
        }

        System.out.println(Math.round(x * 100 / y) / 100.0);
    }

    public double getDivision() {
        if (y == 0) {
            return Double.MAX_VALUE;
        }

        return Math.round(x * 100 / y) / 100.0;
    }

    public double getDivision2() {

        if (y == 0) {
            return Double.MAX_VALUE;
        }

        return Math.round((3 * x * 100 )/ (2 * y)) / 100.0;
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

    public static boolean searchX(double xSearch, Divide[] divideArrayObj) {
        boolean isFound = false;

        for (int i = 0; i < divideArrayObj.length; i++) {
            if (xSearch == divideArrayObj[i].getX()) {
                isFound = true;
                break;
            }
        }

        if (isFound) {
            System.out.println("Object found");
        } else {
            System.out.println("Object not found");
        }

        return isFound;
    }

    public static boolean searchY(double ySearch, Divide[] divideArrayObj) {
        boolean isFound = false;

        for (int i = 0; i < divideArrayObj.length; i++) {
            if (ySearch == divideArrayObj[i].getY()) {
                isFound = true;
                break;
            }
        }

        if (isFound) {
            System.out.println("Object found");
        } else {
            System.out.println("Object not found");
        }

        return isFound;
    }
}

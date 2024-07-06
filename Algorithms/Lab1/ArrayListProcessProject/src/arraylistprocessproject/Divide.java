/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package arraylistprocessproject;

/**
 *
 * @author Dell
 */
public class Divide {
    private double x;
    private double y;
    
    Divide(double x, double y) {
        this.x = x;
        this.y = y;
    }
    
    public double getDivision() {
        if (y == 0) {
            return Double.MAX_VALUE;
        }
        
        return Math.round(x * 100 / y) / 100.0;
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
        
        for(int i = 0; i < divideArrayObj.length; i++) {
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
        
        for(int i = 0; i < divideArrayObj.length; i++) {
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

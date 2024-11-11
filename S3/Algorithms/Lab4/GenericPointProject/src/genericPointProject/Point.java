/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package genericPointProject;

/**
 *
 * @author Dell
 */
public class Point<T> {
    private T x;
    private T y;
    
    // method1 is generic case 1
    public <T>void printArray(T[] v_array) {
        for(int i = 0; i < v_array.length; i++){
            System.out.println(v_array[i] + " ");
        }
    }
    
    // method1 is generic case 2
    public <T>void printArray2(T ... v_array) {
        for(T ele: v_array){
            System.out.println(ele + " ");
        }
    }
    
    @Override
    public String toString() {
        return "[ x = " + this.x + ", y = " + this.y + " ]";
    }
    
    public Point(T x, T y){
        this.x = x;
        this.y = y;
    }

    public T getX() {
        return x;
    }

    public void setX(T x) {
        this.x = x;
    }

    public T getY() {
        return y;
    }

    public void setY(T y) {
        this.y = y;
    }
}

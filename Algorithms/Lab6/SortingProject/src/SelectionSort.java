/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class SelectionSort {
    public int[] a;
    
    public void sort() {
        for(int currentIndex = 0; currentIndex < a.length - 1; currentIndex++) {
            int minValue = a[currentIndex];
            int minValueIndex = currentIndex;
            
            for(int j = currentIndex + 1; j < a.length; j++) {
                
                if(a[j] < minValue) {
                    minValue = a[j];
                    minValueIndex = j;
                }
            }
            
            swap(currentIndex, minValueIndex);
            print();
        }
    }
    
    private void swap(int i, int j) {
        int temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    
    public void print() {
        System.out.println("\nSorting in Progress...");
        System.out.print("[");
        for(int i = 0; i < a.length; i++) {
            System.out.print(a[i] + ", ");
        }
        System.out.println("]");
    }
}

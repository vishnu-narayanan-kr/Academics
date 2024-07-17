/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestSelectionSort {
    public static void main(String[] args) {
        SelectionSort mySelSort = new SelectionSort();
        mySelSort.a = new int[]{5, 2, 3, 9, 1};
        
        mySelSort.print();
        mySelSort.sort();
    }
}

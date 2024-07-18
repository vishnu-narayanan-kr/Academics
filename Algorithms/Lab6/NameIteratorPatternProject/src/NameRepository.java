/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author 2301623
 */
public class NameRepository {
    public Iterator getIterator() {
        return new NameIterator();
    }
    
    public Iterator getOddIterator() {
        return new OddNameIterator();
    }
}

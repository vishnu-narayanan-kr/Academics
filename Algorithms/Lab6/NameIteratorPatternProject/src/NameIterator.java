/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author 2301623
 */
public class NameIterator implements Iterator {
    public String names[] = {"Robert", "Khan", "Lee", "Jessica"};
    int index;
    
    @Override
    public boolean hasNext() {
        if(index < names.length) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Object next() {
        if(this.hasNext()) {
            return names[index++];
        } else {
            return null;
        }
    }
}

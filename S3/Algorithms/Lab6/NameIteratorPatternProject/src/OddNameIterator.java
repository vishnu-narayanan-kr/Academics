/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author 2301623
 */
public class OddNameIterator extends NameIterator {

    @Override
    public Object next() {
        if (this.hasNext() && index % 2 == 1) {
            return names[index++];
        }
        
        index++;
        return null;

    }
}

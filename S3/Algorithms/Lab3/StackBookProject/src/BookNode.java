/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class BookNode {
    public Book info;
    public BookNode link;
    
    BookNode(Book info, BookNode link) {
        this.info = info;
        this.link = link;
    }
}

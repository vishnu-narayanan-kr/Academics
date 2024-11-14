
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestStackBookProject {
    public static void main(String[] args) throws FileNotFoundException {
        LinkedStackClass bookStack = new LinkedStackClass();
        
        Scanner inFile = new Scanner(new File("Book.in"));
        inFile.useDelimiter("[\t\r\n]+");
        
        while(inFile.hasNextLine()) {
            int id = inFile.nextInt();
            String author = inFile.next();
            String name = inFile.next();
            String isbn = inFile.next();
            String type = inFile.next();
            double price = inFile.nextDouble();
            
            Book book = new Book(id, author, name, isbn, type, price);
            
            bookStack.push(book);
        }
        
        inFile.close();
        
        bookStack.print();
    }
}

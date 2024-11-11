
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestBookArrayListCollection {

    public static void main(String[] args) throws FileNotFoundException {
        Scanner inFile = new Scanner(new File("Book.in"));

        List<Book> myBookList = new ArrayList();

        inFile.useDelimiter("[\t\r\n]+");

        while (inFile.hasNext()) {
            int id = inFile.nextInt();
            String author = inFile.next();
            String title = inFile.next();
            String isbn = inFile.next();
            String type = inFile.next();
            double price = inFile.nextDouble();

            Book newBook = new Book(id, author, title, isbn, type, price);

            myBookList.add(newBook);
        }

        inFile.close();

        System.out.println("The Books you entered are: " + myBookList.size());

        System.out.println("\nPrinting using .get() method");
        for (int i = 0; i < myBookList.size(); i++) {
            System.out.println(myBookList.get(i));
        }

        ListIterator<Book> it = myBookList.listIterator();

        System.out.println("\nPrinting using .next() method and listIterator");
        while (it.hasNext()) {
            System.out.println(it.next());
        }

        System.out.println("\nPrinting using .previous() method and listIterator");
        while (it.hasPrevious()) {
            System.out.println(it.previous());
        }

        Book newBook = new Book(13, "Joshawa Pierre", "Python", "1209845", "BG", 99.99);
        myBookList.add(2, newBook);
        System.out.println("\nThe new book added is: ");
        System.out.println("\n" + myBookList.get(2));
    }
}

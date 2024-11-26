package webPubBookREST;

import java.util.*;

import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.xml.bind.annotation.*;

@XmlRootElement(name = "publisher")
public class PublisherWithBooks extends Publisher {
	@XmlElement(name = "books")
	@JsonbProperty("books")
	private List<Book> bookList = new ArrayList<Book>();

	public PublisherWithBooks(int p_id, String p_Name, String p_address, List<Book> bookList) {
		super(p_id, p_Name, p_address);
		this.bookList = bookList;
	}
	
	public PublisherWithBooks() {
	    super();
	    bookList = new ArrayList<Book>();
	}

	public List<Book> getBookList() {
		return bookList;
	}

	public void setBookList(List<Book> bookList) {
		this.bookList = bookList;
	}
}

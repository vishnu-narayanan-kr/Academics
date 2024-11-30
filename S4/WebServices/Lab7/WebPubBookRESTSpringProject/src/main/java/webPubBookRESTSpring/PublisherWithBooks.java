package webPubBookRESTSpring;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;

import jakarta.xml.bind.annotation.*;

@XmlRootElement(name = "publisher")
public class PublisherWithBooks extends Publisher {
	//@XmlElementWrapper(name = "books")
	@JacksonXmlElementWrapper(localName = "books")
	//@XmlElement(name = "book")
	@JsonProperty("book")
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
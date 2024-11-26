package webPubBookREST;

import java.util.*;
import java.util.stream.Collectors;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/PubBooks")
public class PubBookResource {
	List<Publisher> publisherList = new ArrayList<Publisher>();
	List<Book> bookList = new ArrayList<Book>();
	
	private void initialize() {
		publisherList.add(new Publisher(1, "Microsoft Press", "United States"));
		publisherList.add(new Publisher(2, "OReilly Media", "United States"));
		publisherList.add(new Publisher(3, "Princeton Press", "United States"));

		bookList.add(new Book(1, "Stev Jeff", "Java Programming", "1234987991", 42.40, "BG", 2));
		bookList.add(new Book(2, "Amine Khan", "Oracle Database", "9876669874", 252.40, "EX", 3));
		bookList.add(new Book(3, "Eduard Becker", "Java Programming", "1234987987", 202.30, "EX", 3));
		bookList.add(new Book(4, "James Peter", "PHP Programming", "7654329654", 66.70, "MD", 1));
		bookList.add(new Book(5, "Paul Tremblay", "History of Art Wealth", "1209845965", 43.3, "BG", 3));
		bookList.add(new Book(6, "Paul Henry", "Business principles", "6543218521", 252.10, "EX", 1));
	}
	
	PubBookResource() {
		initialize();
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String displayPubBookList() {
		String output = "";
		
		for(Publisher publisher: publisherList) {
			output += publisher.toString();
			output += "\n";
			output += bookList
					.stream()
					.filter(b -> b.getP_id() == publisher.getP_id())
					.map(p -> "\t" + p.toString())
					.collect(Collectors.joining("\n"));
			output += "\n";
		}
		
		return output;
	}
	
	@GET
	@Path("/PubBooksJSON")
	@Produces(MediaType.APPLICATION_JSON)
	public List<PublisherWithBooks> displayPubBookListJSON() {
		List<PublisherWithBooks> list = new ArrayList<PublisherWithBooks>();
		
		for(Publisher publisher: publisherList) {
			List<Book> bookList = new ArrayList<Book>();
			
			bookList = this.bookList
					.stream()
					.filter(b -> b.getP_id() == publisher.getP_id())
					.toList();
			
			PublisherWithBooks publisherWithBooks = new PublisherWithBooks(
						publisher.getP_id(),
						publisher.getP_Name(),
						publisher.getP_address(),
						bookList
					);
			
			list.add(publisherWithBooks);
		}
		
		return list;
	}
	
	@GET
	@Path("/PubBooksXML")
	@Produces(MediaType.APPLICATION_XML)
	public PublishersWithBooks displayPubBookListXML() {
		List<PublisherWithBooks> list = new ArrayList<PublisherWithBooks>();
		
		for(Publisher publisher: publisherList) {
			List<Book> bookList = new ArrayList<Book>();
			
			bookList = this.bookList
					.stream()
					.filter(b -> b.getP_id() == publisher.getP_id())
					.toList();
			
			PublisherWithBooks publisherWithBooks = new PublisherWithBooks(
						publisher.getP_id(),
						publisher.getP_Name(),
						publisher.getP_address(),
						bookList
					);
			
			list.add(publisherWithBooks);
		}
		
		PublishersWithBooks publishers = new PublishersWithBooks(list);
		
		return publishers;
	}
}

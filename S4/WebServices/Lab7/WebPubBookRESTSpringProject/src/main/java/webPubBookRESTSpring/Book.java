package webPubBookRESTSpring;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.xml.bind.annotation.*;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Book {
	@XmlElement(name = "book_Id")
	@JsonProperty("book_id")
	private int b_id;
	
	@XmlElement(name = "book_author")
	@JsonProperty("b_Author")
	private String b_author;
	
	@XmlElement(name = "book_title")
	@JsonProperty("b_Title")
	private String b_title;
	
	@XmlElement(name = "book_isbn")
	@JsonProperty("b_Isbn")
	private String b_isbn;
	
	@XmlElement(name = "book_price")
	@JsonProperty("b_Price")
	private Double b_price;
	
	@XmlElement(name = "book_type")
	@JsonProperty("b_Type")
	private String b_type;
	
	@XmlElement(name = "book_pid")
	@JsonProperty("b_p_id")
	private int p_id;
	
	public Book(int b_id, String b_author, String b_title, String b_isbn, Double b_price, String b_type,
			int p_id) {
		this.b_id = b_id;
		this.b_author = b_author;
		this.b_title = b_title;
		this.b_isbn = b_isbn;
		this.b_price = b_price;
		this.b_type = b_type;
		this.p_id = p_id;
	}
	
	public Book() {
		this.b_id = 0;
		this.b_author = "";
		this.b_title = "";
		this.b_isbn = "";
		this.b_price = 0.0;
		this.b_type = "";
		this.p_id = 0;
	}

	@Override
	public String toString() {
		return "Book [b_id=" + b_id + ", b_author=" + b_author + ", b_title=" + b_title + ", b_isbn=" + b_isbn
				+ ", b_price=" + b_price + ", b_type=" + b_type + ", p_id=" + p_id + "]";
	}

	public int getB_id() {
		return b_id;
	}

	public void setB_id(int b_id) {
		this.b_id = b_id;
	}

	public String getB_author() {
		return b_author;
	}

	public void setB_author(String b_author) {
		this.b_author = b_author;
	}

	public String getB_title() {
		return b_title;
	}

	public void setB_title(String b_title) {
		this.b_title = b_title;
	}

	public String getB_isbn() {
		return b_isbn;
	}

	public void setB_isbn(String b_isbn) {
		this.b_isbn = b_isbn;
	}

	public Double getB_price() {
		return b_price;
	}

	public void setB_price(Double b_price) {
		this.b_price = b_price;
	}

	public String getB_type() {
		return b_type;
	}

	public void setB_type(String b_type) {
		this.b_type = b_type;
	}

	public int getP_id() {
		return p_id;
	}

	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
}
package webPubBookREST;

import java.util.ArrayList;
import java.util.List;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "publishers")
@XmlAccessorType(XmlAccessType.FIELD)
public class PublishersWithBooks {
	@XmlElement(name = "publisher")
	List<PublisherWithBooks> list;

	public PublishersWithBooks(List<PublisherWithBooks> list) {
		this.list = list;
	}
	
	public PublishersWithBooks() {
		this.list = new ArrayList<PublisherWithBooks>();
	}

	public List<PublisherWithBooks> getList() {
		return list;
	}

	public void setList(List<PublisherWithBooks> list) {
		this.list = list;
	}
}


package webPubBookRESTSpring;

import java.util.*;

import jakarta.xml.bind.annotation.*;

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

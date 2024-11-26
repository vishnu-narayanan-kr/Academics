package webPubBookRESTSpring;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.xml.bind.annotation.*;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Publisher {
	@XmlElement(name = "publisher_Id")
	@JsonProperty("pub_id")
	private int p_id;
	
	@XmlElement(name = "publisher_Name")
	@JsonProperty("publisher_Name")
	private String p_Name;
	
	@XmlElement(name = "publisher_Address")
	@JsonProperty("publisher_Address")
	private String p_address;
	
	@Override
	public String toString() {
		return "Publisher [p_id=" + p_id + ", p_Name=" + p_Name + ", p_address=" + p_address + "]";
	}

	public Publisher(int p_id, String p_Name, String p_address) {
		this.p_id = p_id;
		this.p_Name = p_Name;
		this.p_address = p_address;
	}
	
	public Publisher() {
		this.p_id = 0;
		this.p_Name = "";
		this.p_address = "";
	}
	
	public int getP_id() {
		return p_id;
	}
	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
	public String getP_Name() {
		return p_Name;
	}
	public void setP_Name(String p_Name) {
		this.p_Name = p_Name;
	}
	public String getP_address() {
		return p_address;
	}
	public void setP_address(String p_address) {
		this.p_address = p_address;
	}
}
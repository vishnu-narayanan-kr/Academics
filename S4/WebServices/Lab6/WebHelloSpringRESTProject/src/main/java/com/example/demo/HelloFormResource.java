package com.example.demo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("WebHelloForm")
public class HelloFormResource {
	List<String> nameList = new ArrayList<String>();
	
	public void initializeList() {
		nameList.add("Bob");
		nameList.add("Sarah");
		nameList.add("Bamboo");
	}
	
	@GetMapping(value = "/HelloParameters", produces = MediaType.TEXT_HTML_VALUE)
	public String displayHelloAsParameter(@RequestParam("Name") String name, @RequestParam("Year") String year) {
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>Hello Everyrone from " + name + ", My year is " + year + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	@PostMapping(value = "/HelloBody", produces = MediaType.TEXT_HTML_VALUE)
	public String displayHelloAsBody(@RequestParam("Name") String name, @RequestParam("Year") String year) {
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>Hello Everyrone from " + name + ", My year is " + year + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	@GetMapping(value = "/AddName", produces = MediaType.TEXT_HTML_VALUE)
	public String displayAddNameAsParameters(@RequestParam("Name") String name) {
		initializeList();
		
		nameList.add(name);
		
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>The List names are " + nameList.toString() + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	@PutMapping(value = "/UpdateName", produces = MediaType.TEXT_HTML_VALUE)
	public String displayUpdateNameAsParameters(@RequestParam("Name") String name) {
		initializeList();
		
		for(int i = 0; i < nameList.size(); i++) {
			if(nameList.get(i).equals(name)) {
				nameList.set(i, name.toUpperCase());
			}
		}
		
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>The List names are " + nameList.toString() + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
	
	@DeleteMapping(value = "/RemoveName", produces = MediaType.TEXT_HTML_VALUE)
	public String displayRemoveNameAsParameters(@RequestParam("Name") String name) {
		initializeList(); // we need to re-initialize it because it's state less
		
		for(int i = 0; i < nameList.size(); i++) {
			if(nameList.get(i).equals(name) ) {
				nameList.remove(i);
			}
		}
		
		String html = "";
		
		html += "<html>";
			html += "<body>";
				html += "<h1>The List names are " + nameList.toString() + "</h1>";
			html += "</body>";
		html += "</html>";
		
		return html;
	}
}

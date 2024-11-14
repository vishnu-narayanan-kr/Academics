package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/WebHello") // specify the URL path
public class HelloResource {

    @GetMapping(produces = MediaType.TEXT_PLAIN_VALUE)
    public String sayHello() {
        return "Hello, Everyone from Spring!";
    }

    @GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    public String sayHTMLHello() {
        return "<html><h2>Hello REST from Spring</h2></html>";
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public University sayJSONHello() {
        return new University("Montréal", 2024, 5);
    }

    @GetMapping(value = "/specify/{name}", produces = MediaType.TEXT_HTML_VALUE)
    public String sayParameterHello(@PathVariable String name) {
        return "<h2>Hello from " + name + "</h2>";
    }

    @GetMapping(value = "/specifyParameter", produces = MediaType.TEXT_HTML_VALUE)
    public String sayHTMLClientParameterHello(@RequestParam("empId") String id,
                                              @RequestParam("empName") String name,
                                              @RequestParam("empSalary") String salary) {
        return "Employee Details, ID: " + id + ", Name: " + name + ", Salary: " + salary;
    }
}

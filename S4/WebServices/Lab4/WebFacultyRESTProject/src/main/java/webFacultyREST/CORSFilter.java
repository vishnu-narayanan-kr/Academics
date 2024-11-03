package webFacultyREST;
import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;

@WebFilter("/rest/*")
public class CORSFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
    
        HttpServletResponse resp = (HttpServletResponse) response;
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Headers", "*");
        resp.addHeader("Access-Control-Allow-Methods", "*");
        
        chain.doFilter(request, resp);
    }
}

/*
 *   <filter>
    <filter-name>RestCorsFilter</filter-name>
    <filter-class>webFacultyREST.CORSFilter</filter-class>
  </filter>
  <filter-mapping>
    <filter-name>RestCorsFilter</filter-name>
    <url-pattern>/rest/*</url-pattern>
  </filter-mapping>
  */

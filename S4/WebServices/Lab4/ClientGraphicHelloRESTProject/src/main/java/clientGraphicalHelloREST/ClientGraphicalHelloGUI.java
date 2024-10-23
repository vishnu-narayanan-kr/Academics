package clientGraphicalHelloREST;

import java.awt.Container;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JEditorPane;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.text.Document;
import javax.swing.text.html.HTMLEditorKit;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class ClientGraphicalHelloGUI extends JFrame implements ActionListener {
	JButton hihiJSONB;
	JTextField hihiJSONTF;
	JButton hihiHTMLB;
	JEditorPane hihiHTMLEP;
	JButton hihiTEXTB;
	JTextField hihiTEXTTF;
	JLabel userNameL;
	JTextField userNameTF;
	JButton pathB;
	JEditorPane pathEP;
	
	HTMLEditorKit kit, kit2;
	Document doc, doc2;
	
	// Declare variables for REST services
	String url;
	ClientConfig config;
	Client client;
	WebTarget target;
	String response;
	
	public ClientGraphicalHelloGUI() {
		// Initialize web APIs
		url = "http://localhost:8080/WebHelloWorldRESTProject/rest/HiHi";
		config = new ClientConfig();
		client = ClientBuilder.newClient(config);
		
		kit = new HTMLEditorKit();
		doc = kit.createDefaultDocument();
		
		kit2 = new HTMLEditorKit();
		doc2 = kit2.createDefaultDocument();
		
		hihiJSONB = new JButton("HiHi JSON");
		hihiJSONTF = new JTextField(10);
		hihiHTMLB = new JButton("HiHi HTML");
		hihiHTMLEP = new JEditorPane();
			hihiHTMLEP.setEditorKit(kit);
			hihiHTMLEP.setDocument(doc);
		hihiTEXTB = new JButton("HiHi TEXT");
		hihiTEXTTF = new JTextField(10);
		userNameL = new JLabel("Enter Username: ", SwingConstants.CENTER);
		userNameTF = new JTextField(10);
		pathB = new JButton("path Username");
		pathEP = new JEditorPane();
			pathEP.setEditorKit(kit2);
			pathEP.setDocument(doc2);
		
		hihiJSONB.addActionListener(this);
		hihiHTMLB.addActionListener(this);
		hihiTEXTB.addActionListener(this);
		pathB.addActionListener(this);
		
		setTitle("Graphic based HelloREST");
		
		Container pane = getContentPane();
		pane.setLayout(new GridLayout(5, 2));
		
		pane.add(hihiJSONB);
		pane.add(hihiJSONTF);
		pane.add(hihiHTMLB);
		pane.add(hihiHTMLEP);
		pane.add(hihiTEXTB);
		pane.add(hihiTEXTTF);
		pane.add(userNameL);
		pane.add(userNameTF);
		pane.add(pathB);
		pane.add(pathEP);
		
		setSize(400, 300);
		setVisible(true);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		String actionCommand = e.getActionCommand();
		
		if(actionCommand.equals("HiHi JSON")) {
			target = client.target(url);
			response = target.request().accept(MediaType.APPLICATION_JSON).get(String.class);
			hihiJSONTF.setText(response);
		} else if(actionCommand.equals("HiHi HTML")) {
			target = client.target(url);
			response = target.request().accept(MediaType.TEXT_HTML).get(String.class);
			hihiHTMLEP.setText(response);
		} else if(actionCommand.equals("HiHi TEXT")) {
			target = client.target(url);
			response = target.request().accept(MediaType.TEXT_PLAIN).get(String.class);
			hihiTEXTTF.setText(response);
		} else if(actionCommand.equals("path Username")) {
			String userName = userNameTF.getText();
			
			String pathUsernameUrl = url + "/specify/" + userName;
			target = client.target(pathUsernameUrl);
			response = target.request().accept(MediaType.TEXT_HTML).get(String.class);
			pathEP.setText(response);
		}
		
	}
	
}

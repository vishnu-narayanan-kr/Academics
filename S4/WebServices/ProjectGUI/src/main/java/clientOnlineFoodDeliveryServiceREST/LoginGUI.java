package clientOnlineFoodDeliveryServiceREST;

import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import javax.swing.SwingConstants;

import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

public class LoginGUI extends JFrame implements ActionListener {
	JLabel usernameL = new JLabel("Username:", SwingConstants.RIGHT);
	JTextField usernameTF = new JTextField(10);
	JLabel passwordL = new JLabel("Password:", SwingConstants.RIGHT);
	JPasswordField passwordTF = new JPasswordField(10);
	
	JButton registerB = new JButton("Register");
	JButton loginB = new JButton("Login");
	
	JPanel inputFormP = new JPanel(new GridBagLayout());
	GridBagConstraints gbc = new GridBagConstraints();
	
	JTextField messageDisplayTF = new JTextField(20);
	
	public LoginGUI() {
	    gbc.insets = new Insets(5, 5, 5, 5);
	    gbc.fill = GridBagConstraints.HORIZONTAL;
	    
		setTitle("Login");		
		setSize(250, 170);
		
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 1;
		inputFormP.add(usernameL, gbc);
		
        gbc.gridx = 1;
        gbc.gridy = 0;
		inputFormP.add(usernameTF, gbc);
		
        gbc.gridx = 0;
        gbc.gridy = 1;
		inputFormP.add(passwordL, gbc);
		
        gbc.gridx = 1;
        gbc.gridy = 1;
		inputFormP.add(passwordTF, gbc);
		
        gbc.gridx = 0;
        gbc.gridy = 2;
		inputFormP.add(registerB, gbc);
		
        gbc.gridx = 1;
        gbc.gridy = 2;
		inputFormP.add(loginB, gbc);
		
		messageDisplayTF.setEditable(false);
		messageDisplayTF.setEnabled(true);
		
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.gridwidth = 2;
		inputFormP.add(messageDisplayTF, gbc);
		
		add(inputFormP);
		
		registerB.addActionListener(this);
		loginB.addActionListener(this);
		
		setLocationRelativeTo(null);
		setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getActionCommand().equals("Login")) {
			try {
				messageDisplayTF.setText("logging in...");
				
				WebTarget target = Utility.getTarget("/Authentication/Login");
				
				String username = usernameTF.getText();
				String password = new String(passwordTF.getPassword());
				
				User user = new User();
				
				user.setUsername(username);
				user.setPassword(password);
				
				Response response = target.request(MediaType.APPLICATION_JSON)
	                    .post(Entity.entity(user, MediaType.APPLICATION_JSON));
				
				AuthDetails authDetails = response.readEntity(AuthDetails.class);
				
				messageDisplayTF.setText(authDetails.getMessage());
			} catch(Exception ex) {
				messageDisplayTF.setText("Something went wrong!");
			}
		} else if(e.getActionCommand().equals("Register")) {
			new RegisterGUI();
			this.dispose();
		}
		
	}

}

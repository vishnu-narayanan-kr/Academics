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

public class RegisterGUI extends JFrame implements ActionListener{
	JLabel usernameL = new JLabel("Username:", SwingConstants.RIGHT);
	JTextField usernameTF = new JTextField(10);
	JLabel passwordL = new JLabel("Password:", SwingConstants.RIGHT);
	JPasswordField passwordTF = new JPasswordField(10);
	JLabel password2L = new JLabel("Re-password:", SwingConstants.RIGHT);
	JPasswordField password2TF = new JPasswordField(10);
	
	JButton loginB = new JButton("Login");
	JButton registerB = new JButton("Register");
	
	JPanel inputFormP = new JPanel(new GridBagLayout());
	GridBagConstraints gbc = new GridBagConstraints();
	
	JTextField messageDisplayTF = new JTextField(20);
	
	public RegisterGUI() {
	    gbc.insets = new Insets(5, 5, 5, 5);
	    gbc.fill = GridBagConstraints.HORIZONTAL;
	    
		setTitle("Register");		
		setSize(250, 200);
		
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
		inputFormP.add(password2L, gbc);
		
        gbc.gridx = 1;
        gbc.gridy = 2;
		inputFormP.add(password2TF, gbc);
		
        gbc.gridx = 0;
        gbc.gridy = 3;
		inputFormP.add(loginB, gbc);
		
        gbc.gridx = 1;
        gbc.gridy = 3;
		inputFormP.add(registerB, gbc);
		
		messageDisplayTF.setEditable(false);
		messageDisplayTF.setEnabled(true);
		
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
		inputFormP.add(messageDisplayTF, gbc);
		
		add(inputFormP);
		
		loginB.addActionListener(this);
		registerB.addActionListener(this);
		
		setLocationRelativeTo(null);
		setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getActionCommand().equals("Register")) {
			try {
				String username = usernameTF.getText();
				String password1 = new String(passwordTF.getPassword());
				String password2 = new String(password2TF.getPassword());
				
				if (username.trim().isEmpty()) {
					messageDisplayTF.setText("username empty");
				} else if(password1.trim().isEmpty()) {
					messageDisplayTF.setText("password empty");
				} else if(password1.trim().length() < 4) {
					messageDisplayTF.setText("password too short");
				} else if(!password1.equals(password2)) {
					messageDisplayTF.setText("passwords don't match");
				} else {
					messageDisplayTF.setText("registering...");
					
					WebTarget target = Utility.getTarget("/Authentication/Register");
					User user = new User();
					
					user.setUsername(username);
					user.setPassword(password1);
					
					Response response = target.request(MediaType.APPLICATION_JSON)
		                    .post(Entity.entity(user, MediaType.APPLICATION_JSON));
					
					String message = response.readEntity(String.class);
					
					messageDisplayTF.setText(message);
				}
			} catch(Exception ex) {
				messageDisplayTF.setText("Something went wrong!");
			}
		} else if(e.getActionCommand().equals("Login")) {
			new LoginGUI();
			this.dispose();
		}
	}

}

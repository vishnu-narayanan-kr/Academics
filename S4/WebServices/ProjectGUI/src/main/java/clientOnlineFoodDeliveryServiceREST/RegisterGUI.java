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
		
		messageDisplayTF.setEnabled(false);
		
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
		inputFormP.add(messageDisplayTF, gbc);
		
		add(inputFormP);
		
		loginB.addActionListener(this);
		
		setLocationRelativeTo(null);
		setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getActionCommand().equals("Login")) {
			new LoginGUI();
			this.dispose();
		}
	}

}

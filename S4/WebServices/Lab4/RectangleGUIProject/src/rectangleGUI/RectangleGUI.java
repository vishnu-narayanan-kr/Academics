package rectangleGUI;

import java.awt.Container;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.SwingConstants;

public class RectangleGUI extends JFrame implements ActionListener {
	// Declare the elements
	JTextField lengthTF;
	JTextField widthTF;
	JTextField areaTF;
	JTextField perimeterTF;
	
	public RectangleGUI() {
		// Create four labels
		
		JLabel lengthL = new JLabel("Enter the length: ", SwingConstants.RIGHT);
		JLabel widthL = new JLabel("Enter the width: ", SwingConstants.RIGHT);
		JLabel areaL = new JLabel("Area: ", SwingConstants.RIGHT);
		JLabel perimeterL = new JLabel("Perimeter: ", SwingConstants.RIGHT);
		
		// Create four text fields
		
		lengthTF = new JTextField(10);
		widthTF = new JTextField(10);
		areaTF = new JTextField(10);
		perimeterTF = new JTextField(10);
		
		// Create buttons
		
		JButton calculateB = new JButton("Calculate");
		JButton exitB = new JButton("Exit");		
		
		// Register the listener with corresponding JButtons
		calculateB.addActionListener(this);
		exitB.addActionListener(this);
		
		// Set the title of the window
		setTitle("Area and Perimeter of a Recatangle");
		

		
		// Get the Container as inner area of JFrame object
		Container pane = getContentPane();
		
		// Set the layout of the Container pane
		pane.setLayout(new GridLayout(5, 2));
		
		// Add the elements into the pane
		pane.add(lengthL);
		pane.add(lengthTF);
		pane.add(widthL);
		pane.add(widthTF);
		pane.add(areaL);
		pane.add(areaTF);
		pane.add(perimeterL);
		pane.add(perimeterTF);
		
		pane.add(calculateB);
		pane.add(exitB);
		
		// Set the size of the window
		setSize(400, 300);
		
		// Display it
		setVisible(true);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getActionCommand().equals("Calculate")) {
			Double length = Double.parseDouble(lengthTF.getText());	
			Double width = Double.parseDouble(widthTF.getText());
			
			Rectangle myRectObj = new Rectangle(length, width);
			
			areaTF.setText(myRectObj.area().toString());
			perimeterTF.setText(myRectObj.perimeter().toString());
		} else {
			System.exit(0);
		}
		
	}
}

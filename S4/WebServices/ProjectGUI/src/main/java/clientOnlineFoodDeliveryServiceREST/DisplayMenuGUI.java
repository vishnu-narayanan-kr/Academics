package clientOnlineFoodDeliveryServiceREST;

import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Map;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableColumnModel;

import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

public class DisplayMenuGUI extends JFrame implements ActionListener {
	JLabel dishL = new JLabel("Enter something to search:", SwingConstants.RIGHT);
	JTextField dishTF = new JTextField(10);
	
	JButton searchB = new JButton("Search");
	
	
	DefaultTableModel tableModel = new DefaultTableModel(new String[] {
			"id",
			"Dish Name",
			"Description",
			"Price CAD",
			"Category",
			"Restaurant"
	}, 0);
	
	Map<Integer, Menu> menuHashMap;
	
	JPanel mainPanel = new JPanel(new GridBagLayout());
	GridBagConstraints gbc = new GridBagConstraints();
	
	public DisplayMenuGUI() {
	    gbc.insets = new Insets(5, 5, 5, 5);
	    gbc.fill = GridBagConstraints.HORIZONTAL;
	    
		setTitle("Menu");
		setSize(840, 450);
		setLayout(new BorderLayout());

		getMenuFromAPI();
		
		displayFilterPanel();
		displayTable();

        searchB.addActionListener(this);
        
		setLocationRelativeTo(null);
        setVisible(true);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getActionCommand().equals("Search")) {
			String keyword = dishTF.getText();
			getMenuFromAPI(keyword);
			displayTable();
		}
	}
	
	private void displayFilterPanel() {
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 1;
        gbc.weightx = 1.0;
        gbc.weighty = 0.0;
        
        mainPanel.add(dishL, gbc);
        
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.gridwidth = 1;
        gbc.weightx = 1.0;
        gbc.weighty = 0.0;
        
        mainPanel.add(dishTF, gbc);
        
        gbc.gridx = 2;
        gbc.gridy = 0;
        gbc.gridwidth = 1;
        gbc.weightx = 1.0;
        gbc.weighty = 0.0;
        
        mainPanel.add(searchB, gbc);
	}
	
	private void displayTable() {
		tableModel.setRowCount(0);
		
		menuHashMap.values().forEach(m -> {
			tableModel.addRow(new Object[] {
					m.getMealId(),
					m.getMealName(),
					m.getDescription(),
					m.getPrice(),
					m.getCategory(),
					m.getRestaurantName()
			});
		});
		
        JTable table = new JTable(tableModel);
        
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        
        TableColumnModel columnModel = table.getColumnModel();
        columnModel.getColumn(0).setPreferredWidth(40);
        columnModel.getColumn(1).setPreferredWidth(200);
        columnModel.getColumn(2).setPreferredWidth(300);
        columnModel.getColumn(3).setPreferredWidth(70); 
        columnModel.getColumn(4).setPreferredWidth(90);
        columnModel.getColumn(5).setPreferredWidth(100);
        
        JScrollPane scrollPane = new JScrollPane(table);
        
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.gridwidth = 3;
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;
        gbc.fill = GridBagConstraints.BOTH;

        mainPanel.add(scrollPane, gbc);
        
        add(mainPanel, BorderLayout.CENTER);
	}
	
	private void getMenuFromAPI() {
		getMenuFromAPI("");
	}
	
	private void getMenuFromAPI(String keyword) {
		try {
			WebTarget target = Utility.getTarget("/Menu/View")
					.queryParam("keyword", keyword);
			
			Response response = target.request()
					.accept(MediaType.APPLICATION_JSON)
					.get();
			
			
			menuHashMap = response.readEntity(new GenericType<Map<Integer, Menu>>() {});
		} catch(Exception ex) {
			System.out.println(ex.getMessage());
		}
	}
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class BinaryEmployeeTreeClass {
    BinaryEmployeeTreeNode rootTree = null;
    
    public void put(BinaryEmployeeTreeNode obj) {
        BinaryEmployeeTreeNode current = rootTree;
        
        while(true) {
            if(rootTree == null) {
                rootTree = obj;
                
                break;
            } else {
                if(obj.info.getEmp_salary() < current.info.getEmp_salary()) {
                    if(current.lLink == null) {
                        current.lLink = obj;
                        break;
                    } else {
                        current = current.lLink;
                    }
                } else {
                    if(current.rLink == null) {
                        current.rLink = obj;
                        break;
                    } else {
                        current = current.rLink;
                    }
                }
            }
        }
    }
    
    public void InorderTraversal() {
        InorderTraversal(this.rootTree);
    }
    
    private void InorderTraversal(BinaryEmployeeTreeNode current) {
        if(current != null) {
            InorderTraversal(current.lLink);
            System.out.println(current.info.toString());
            InorderTraversal(current.rLink);
        }
    }
}


import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class TestBinaryTree {

    public static void main(String[] args) {
        BinaryTreeClass myTree = new BinaryTreeClass();
        
        myTree.put(60);
        myTree.put(50);
        myTree.put(70);
        myTree.put(80);
        myTree.put(40);
        
        System.out.println("Printing Inorder Tree Values: ");
        myTree.InorderTraversal();
        
        System.out.println("Printing Preorder Tree Values: ");
        myTree.PreorderTraversal();
        
        System.out.println("Printing Postorder Tree Values: ");
        myTree.PostorderTraversal();
        
        Scanner scanner = new Scanner(System.in);
        System.out.println("Please enter number for search withing Binary Tree: ");
        int searchValue = scanner.nextInt();
        
        myTree.search(searchValue);
    }
}

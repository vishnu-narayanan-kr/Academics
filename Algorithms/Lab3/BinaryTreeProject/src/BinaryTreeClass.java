/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class BinaryTreeClass {

    public BinaryTreeNode rootTree;

    BinaryTreeClass() {
        rootTree = null;
    }

    public void put(int num) {
        BinaryTreeNode newNode = new BinaryTreeNode();
        BinaryTreeNode currentNode = rootTree;

        newNode.info = num;
        newNode.lLink = null;
        newNode.rLink = null;

        if (rootTree == null) {
            rootTree = newNode;
            currentNode = newNode;
        } else {
            while (true) {
                if (num < currentNode.info) {
                    if (currentNode.lLink == null) {
                        currentNode.lLink = newNode;
                        break;
                    } else {
                        currentNode = currentNode.lLink;
                    }
                } else {
                    if (currentNode.rLink == null) {
                        currentNode.rLink = newNode;
                        break;
                    } else {
                        currentNode = currentNode.rLink;
                    }
                }
            }
        }
    }

    public void InorderTraversal() {
        InorderTraversal(rootTree);
    }
    
    public void InorderTraversal(BinaryTreeNode node) {
        if (node != null) {
            InorderTraversal(node.lLink);
            System.out.println(node.info);
            InorderTraversal(node.rLink);
        }
    }
    
    public void PreorderTraversal() {
        PreorderTraversal(rootTree);
    }
    
    public void PreorderTraversal(BinaryTreeNode node) {
        if (node != null) {
            System.out.println(node.info);
            PreorderTraversal(node.lLink);
            PreorderTraversal(node.rLink);
        }
    }
    
    public void PostorderTraversal() {
        PostorderTraversal(rootTree);
    }
    
    public void PostorderTraversal(BinaryTreeNode node) {
        if (node != null) {
            PostorderTraversal(node.lLink);
            PostorderTraversal(node.rLink);
            System.out.println(node.info);
        }
    }
    
    public void search(int num) {
        boolean isFound = false;
        
        BinaryTreeNode current = rootTree;
        
        while(!isFound && current != null) {
            if(num == current.info) {
                isFound = true;
            } else if (num < current.info && current.lLink != null) {
                current = current.lLink;
            } else if (num > current.info && current.rLink != null) {
                current = current.rLink;
            } else {
                current = null;
            }
        }
        
        if(isFound) {
            System.out.println("Value " + num + " exists in the tree.");
        } else {
            System.out.println("Value " + num + " doesn't exist in the tree.");
        }
    }
}

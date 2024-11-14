public static void printArr2D(boolean[][] arr) {
    for(int i = 0; i < arr.length; i++) {
        for(int j = 0; j < arr[i].length; j++) {
            System.out.printf("%6s", arr[i][j]);
        }

        System.out.println(" ");
    }
    
    System.out.println(" ");
}
class Solution {
    public int climbStairs(int n) {
        int path1 = 1;
        int path2 = 2;

        if(n >= 3) {
            for(int i = 3; i <= n; i++) {
                int path = path1 + path2;
                
                if(path1 < path2) {
                    path1 = path;
                } else {
                    path2 = path;
                }
            }
        } else {
            return n;
        }

        return Math.max(path1, path2);
    }
}
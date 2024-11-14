class Solution {
    public int numDecodings(String s) {
        if(s.charAt(0) == '0') {
            return 0;
        }

        int[] dpArr = new int[s.length() + 1];

        dpArr[0] = 1;
        dpArr[1] = 1;

        for(int i = 1; i < s.length(); i++) {
            if(s.charAt(i) != '0') {
                dpArr[i + 1] = dpArr[i];
            }

            int num = Integer.parseInt("" + s.charAt(i - 1) + s.charAt(i));

            if(num >= 10 && num <= 26) {
                dpArr[i + 1] += dpArr[i - 1];
            }

            if(dpArr[i + 1] == 0) {
                return 0;
            }
        }

        return dpArr[s.length()];
    }
}
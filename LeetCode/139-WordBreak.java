class Solution {
        public static boolean wordBreak(String s, List<String> wordDict) {
        boolean[] dpA = new boolean[s.length() + 1];
        
        dpA[0] = true;
        
        for(int i = 1; i < dpA.length; i++) {
            for (String word : wordDict) {
                if(dpA[i - 1]) {
                    if((i - 1 + word.length()) <= s.length()) {
                        if(word.equals(s.substring(i - 1, i - 1 + word.length()))) {
                            if((i + word.length() - 1) < dpA.length) {
                                dpA[i + word.length() - 1] = true;
                            }
                        } 
                    }
                }
            }
        }
        
        return dpA[dpA.length - 1];
    }
}
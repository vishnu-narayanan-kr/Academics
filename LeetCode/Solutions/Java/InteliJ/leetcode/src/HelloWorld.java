import java.util.Arrays;

public class HelloWorld {
    public static void main(String[] args) {
        int[] nums = new int[]{1, 3, 4, 5, 6, 8};
        int target = 8;

        TwoSum1 test = new TwoSum1();
        Arrays.stream(test.twoSum(nums, target)).forEach(System.out::println);
    }
}

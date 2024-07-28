using System;
using System.Threading;

class Program { 
    private static void Main(String[] args)
    {
        int[] a = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15};
        int[] b = new int[15];

        for(int i = 0; i < a.Length; i++)
        {
            b[i] = a[i] + 30;
        }

        // SEQUENTIAL METHOD
        //printArrayOne(a);
        //printArrayTwo(b);

        // PARALLEL METHOD
        Thread thread1 = new Thread(() => printArrayOne(a));
        Thread thread2 = new Thread(() => printArrayOne(b));

        thread1.Start();
        thread2.Start();
    }

    private static void printArrayOne(int[] a) {
        for (int i = 0; i < a.Length; i++) {
            Console.WriteLine("printArrayOne " + a[i]);
        }
    }

    private static void printArrayTwo(int[] b) { 
        for(int i = 0; i < b.Length; i++)
        {
            Console.WriteLine("printArrayTwo " + b[i]);
        }
    }
}

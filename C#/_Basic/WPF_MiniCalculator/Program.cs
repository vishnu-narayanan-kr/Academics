using MiniCalculator;

namespace MiniCalulator {
    public class Program { 
        private static void Main(string[] args)
        {   
            /*
            double a, b;
            Boolean exit = false;

            do
            {
                Console.WriteLine("Please enter variable 1: ");
                a = double.Parse(Console.ReadLine());

                Console.WriteLine("Please enter variable 2: ");
                b = double.Parse(Console.ReadLine());

                Console.WriteLine("What type of operation you want to perform? \n" +
                    "1 for addition \n" +
                    "2 for subtraction \n" +
                    "3 for multiplication \n" +
                    "4 for division \n");

                int choice = int.Parse(Console.ReadLine());

                CalculatorImplementation calcimp = new CalculatorImplementation();

                switch (choice)
                {
                    case 1:
                        Console.WriteLine("The addition result is: " + calcimp.getAddition(a, b));
                        break;
                    case 2:
                        Console.WriteLine("The subtraction result is: " + calcimp.getSubtraction(a, b));
                        break;
                    case 3:
                        Console.WriteLine("The multiplication result is: " + calcimp.getMultiplication(a, b));
                        break;
                    case 4:
                        Console.WriteLine("The division result is: " + calcimp.getDivision(a, b));
                        break;
                    default:
                        Console.WriteLine("Invalid option");
                        break;
                }

                Console.WriteLine("Exit program? (Y/y): ");
                char response = char.Parse(Console.ReadLine());
                exit = char.ToLower(response) != 'y';

            } while (exit);
            */
            char _typeFinder1, _typeFinder2;
            int a1 = 0, b1 = 0; double a2 = 0, b2 = 0;

            Console.WriteLine("Please enter the datatype of variable 1.. I for integer" +
                " D for decimal ");
            _typeFinder1 = char.Parse(Console.ReadLine());
            if (_typeFinder1 == 'I')
            {
                a1 = int.Parse(Console.ReadLine());
            }
            else if (_typeFinder1 == 'D') {
                a2 = double.Parse(Console.ReadLine());
            }


            Console.WriteLine("Please enter the datatype of variable 2.. I for integer" +
                " D for decimal ");
            _typeFinder2 = char.Parse(Console.ReadLine());
            if (_typeFinder2 == 'I')
            {
                b1 = int.Parse(Console.ReadLine());
            }
            else if (_typeFinder2 == 'D')
            {
                b2 = double.Parse(Console.ReadLine());
            }

            Console.WriteLine("What type of operation you want to perform? \n" +
                    "1 for addition \n" +
                    "2 for subtraction \n" +
                    "3 for multiplication \n" +
                    "4 for division \n");

            int choice = int.Parse(Console.ReadLine());

            switch(choice)
            {
                case 1:
                    Addition add = new Addition();
                    Console.WriteLine(add.getResult(_typeFinder1 == 'I' ? a1 : a2, _typeFinder2 == 'I' ? b1 : b2));
                    break;
                case 2:
                    Subtract sub = new Subtract();
                    Console.WriteLine(sub.getResult(_typeFinder1 == 'I' ? a1 : a2, _typeFinder2 == 'I' ? b1 : b2));
                    break;
                case 3:
                    Multiplication mul = new Multiplication();
                    Console.WriteLine(mul.getResult(_typeFinder1 == 'I' ? a1 : a2, _typeFinder2 == 'I' ? b1 : b2));
                    break;
                case 4:
                    Division div = new Division();
                    Console.WriteLine(div.getResult(_typeFinder1 == 'I' ? a1 : a2, _typeFinder2 == 'I' ? b1 : b2));
                    break;
                default:
                    Console.WriteLine("Something went wrong!");
                    break;
            }
        }
    }
}
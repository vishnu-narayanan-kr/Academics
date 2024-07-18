using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniCalculator
{
    internal class Multiplication : Calc
    {
        public int getResult(int a, int b)
        {
            return a * b;
        }

        public override double getResult(int a, double b)
        {
            return a * b;
        }

        public override double getResult(double a, int b)
        {
            return a * b;
        }

        public override double getResult(double a, double b)
        {
            return a * b;
        }
    }
}

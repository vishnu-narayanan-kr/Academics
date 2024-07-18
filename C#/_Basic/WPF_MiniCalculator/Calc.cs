using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniCalculator
{
    abstract class Calc
    {
        public abstract double getResult(int a, double b);
        public abstract double getResult(double a, int b);
        public abstract double getResult(double a, double b);
    }
}

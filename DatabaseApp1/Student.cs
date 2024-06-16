using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseApp1
{
    internal class Student
    {
        public string Name;
        public int Id;
        public string Email;
        public int Reg_Year;
        public string Term;

        public Student() {
            this.Name = "";
            this.Id = 0;
            this.Email = "";
            this.Reg_Year = 0;
            this.Term = "";
        }
    }
}

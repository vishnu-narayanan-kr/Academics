namespace ASP.NETCoreWebApp.Models
{
    public class Student
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? course { get; set; }
        public int? year { get; set; }
        public string email { get; set; }

        public Student() { 
            id = 0;
            name = "";
            course = "";
            year = DateTime.Now.Year;
            email = "";
        }
    }
}

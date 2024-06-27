namespace RestAPI.Models
{
    public class Response
    {
        
        //The target of this class is to provide a response structure
        //to the software
        

        public int statusCode { get; set; }
        public string statusMessage { get; set; }
        public Student std { get; set; }
        public List<Student> stds { get; set;}
    }
}

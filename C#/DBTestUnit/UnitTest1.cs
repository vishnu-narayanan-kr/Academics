using System.Data.SqlClient;
using DatabaseApp1;

namespace DBTestUnit
{
    public class Tests
    {
        private void Establish_Connection()
        {
            string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True";

            sqlConnection = new SqlConnection(connectionString);
            sqlConnection.Open();
        }

        private SqlConnection sqlConnection;
        private SqlCommand sqlCommand;

        private DBApp app;
        private Student student;

        [TearDown]
        public void TearDown() { 
            sqlCommand.Dispose();
            sqlConnection.Dispose();
        }

        [SetUp]
        public void Setup()
        {
            student = new Student();

            student.Name = "Demo";
            student.Term = "DemoFall";
            student.Email = "Demo@gmail.com";
            student.Reg_Year = 2014;

            app = new DBApp();
        }

        [Test]
        public void AddStudentTest()
        {
            // Arrange, Act, Assert
            string name = "Demo", email = "Demo@gmail.com"; ;

            app.AddStudent(student);

            try {
                Establish_Connection();

                string query = "SELECT TOP 1 * FROM Student ORDER BY std_Id DESC;";

                sqlCommand = new SqlCommand(query, sqlConnection);
                SqlDataReader reader = sqlCommand.ExecuteReader();

                while(reader.Read())
                {
                    Assert.AreEqual(name, (string)reader["std_Name"]);
                    Assert.AreEqual(email, (string)reader["std_Email"]);
                    Assert.That(reader["std_Name"], Is.TypeOf<string>());
                    Assert.That(reader["std_Id"], Is.TypeOf<int>());
                }
            } catch (SqlException ex) { 
                Console.WriteLine(ex.Message);
            }
        }
    }
}
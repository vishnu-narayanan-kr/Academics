using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

// Class for NUnit testing

namespace DatabaseApp1
{
    public class DBApp
    {
        private void Establish_Connection()
        {
            string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True";

            sqlConnection = new SqlConnection(connectionString);
            sqlConnection.Open();
        }

        SqlConnection sqlConnection;
        SqlCommand sqlCommand;

        public void AddStudent(Student student) {
            try
            {
                Establish_Connection();

                string query = "insert into Student values(@name, @email, @regyear, @regterm)";

                sqlCommand = new SqlCommand(query, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@name", student.Name);
                sqlCommand.Parameters.AddWithValue("@email", student.Email);
                sqlCommand.Parameters.AddWithValue("@regyear", student.Reg_Year);
                sqlCommand.Parameters.AddWithValue("@regterm", student.Term);

                int status = sqlCommand.ExecuteNonQuery();

                if (status > 0)
                {
                    Console.WriteLine("Data Inserted Successfully");
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            sqlConnection.Close();
        }
    }
}

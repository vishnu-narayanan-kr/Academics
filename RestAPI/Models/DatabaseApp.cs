using Microsoft.Data.SqlClient;
using System.Data;

namespace RestAPI.Models
{
    public class DatabaseApp
    {
        // Insertion operation with add student method
        public Response AddStudent(SqlConnection sqlCon,Student std) {
                Response response = new Response();

            try {

                string query = "insert into Student values(@name, @email, @regyear, @regterm);";

                SqlCommand cmd = new SqlCommand(query, sqlCon);

                cmd.Parameters.AddWithValue("@name", std.Name);
                cmd.Parameters.AddWithValue("@email", std.Email);
                cmd.Parameters.AddWithValue("@regyear", std.Reg_Year);
                cmd.Parameters.AddWithValue("@regterm", std.Term);

                sqlCon.Open();

                int status = cmd.ExecuteNonQuery();

                if (status == 1)
                {
                    response.statusCode = 200;
                    response.statusMessage = "Data Entry Success";
                    response.std = std;
                    response.stds = null;
                }
                else {
                    response.statusCode = 100;
                    response.statusMessage = "Data Entry Fail, check log";
                    response.std = null;
                    response.stds = null;
                }

                sqlCon.Close();

            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }


            return response;
        }

        public Response GetAllStudents(SqlConnection sqlCon)
        {
            Response response = new Response();

            try
            {
                sqlCon.Open();

                string query = "select * from Student";
                SqlDataAdapter adapter = new SqlDataAdapter(query, sqlCon);

                DataTable dt = new DataTable();

                adapter.Fill(dt);

                List<Student> students = new List<Student>();

                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        Student student = new Student();

                        student.Name = dt.Rows[i]["std_Name"].ToString();
                        student.Id = (int)dt.Rows[i]["std_Id"];
                        student.Email = dt.Rows[i]["std_Email"].ToString();
                        student.Reg_Year = (int)dt.Rows[i]["std_Reg_Year"];
                        student.Term = dt.Rows[i]["std_Reg_Term"].ToString();

                        students.Add(student);
                    }
                }

                if (students.Count > 0)
                {
                    response.statusCode = 200;
                    response.statusMessage = "Success";
                    response.std = null;
                    response.stds = students;
                }
                else {
                    response.statusCode = 100;
                    response.statusMessage = "Unsuccessful";
                    response.std = null;
                    response.stds = null;
                }

            }
            catch (Exception ex) { 
                Console.WriteLine (ex.Message);
            }

            sqlCon.Close();

            return response;
        }
    }
}

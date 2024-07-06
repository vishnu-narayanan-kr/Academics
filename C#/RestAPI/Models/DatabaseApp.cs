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

        public Response GetStudentById(SqlConnection con, int id) { 
            Response response = new Response();

            try
            {
                con.Open();

                string query = "select * from Student where std_Id=@id";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@id", id);

                SqlDataAdapter adapter = new SqlDataAdapter(cmd);

                DataTable dt = new DataTable();

                adapter.Fill(dt);

                Student student = new Student();

                if (dt.Columns.Count > 0)
                {
                    student.Name = dt.Rows[0]["std_Name"].ToString();
                    student.Email = dt.Rows[0]["std_Email"].ToString();
                    student.Reg_Year = (int)dt.Rows[0]["std_Reg_Year"];
                    student.Term = dt.Rows[0]["std_Reg_Term"].ToString();
                    student.Id = (int)dt.Rows[0]["std_Id"];

                    response.statusCode = 200;
                    response.statusMessage = "Student retrieved successful";
                    response.std = student;
                    response.stds = null;
                }
                else {
                    response.statusCode = 100;
                    response.statusMessage = "Student not found";
                    response.std = null;
                    response.stds = null;
                }

            } catch (SqlException ex) { 
                Console.WriteLine(ex.Message);
            }

            con.Close();

            return response;
        }

        public Response UpdateStudentById(SqlConnection con, int id, Student std)
        {
            Response response = new Response();

            try
            {
                con.Open();

                string query = "update Student set std_Name=@name, std_Email=@email, std_Reg_Year=@year, std_Reg_Term=@term where std_Id=@id;";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@name", std.Name);
                cmd.Parameters.AddWithValue("@email", std.Email);
                cmd.Parameters.AddWithValue("@year", std.Reg_Year);
                cmd.Parameters.AddWithValue("@term", std.Term);
                cmd.Parameters.AddWithValue("@id", std.Id);

                int i = cmd.ExecuteNonQuery();

                if (i > 0)
                {
                    response.statusCode = 200;
                    response.statusMessage = "Student updated successful";
                    response.std = std;
                    response.stds = null;
                }
                else {
                    response.statusCode = 100;
                    response.statusMessage = "Student couldn't be updated";
                    response.std = null;
                    response.stds = null;
                }
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
            }

            con.Close();

            return response;
        }

        public Response DeleteStudentById(SqlConnection con, int id)
        {
            Response response = new Response();

            try
            {
                con.Open();

                string query = "delete from Student where std_Id=@id";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@id", id);

                int status = cmd.ExecuteNonQuery();

                if (status > 0)
                {
                    response.statusCode = 200;
                    response.statusMessage = "Student deleted successfully";
                    response.std = null;
                    response.stds = null;
                }
                else
                {
                    response.statusCode = 100;
                    response.statusMessage = "Student couldn't be deleted";
                    response.std = null;
                    response.stds = null;
                }
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
            }

            con.Close();

            return response;
        }
    }
}

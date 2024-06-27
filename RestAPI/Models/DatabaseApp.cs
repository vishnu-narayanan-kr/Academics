using Microsoft.Data.SqlClient;

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
    }
}

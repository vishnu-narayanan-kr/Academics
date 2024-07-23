using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace DatabaseApp1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        HttpClient httpClient = new HttpClient();
        public MainWindow()
        {
            InitializeComponent();

            // configure the http link for our desktop

            // step 1: setup the base address for the rest api
            httpClient.BaseAddress = new Uri("https://localhost:7286/api/Student/");

            // step 2: Clear our current packet header
            httpClient.DefaultRequestHeaders.Accept.Clear();

            // step 3: Setup your own packet header
            httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
                );
        }

        // step 1: Establish the connection

        private void Establish_Connection() {
            // Collect Connection String and Pass it to the connector
            string connectionString = "Data Source=desktop-aiq6j2v;Initial Catalog=S3-CSharp;Integrated Security=True";

            // initialize the connection String
            sqlConnection = new SqlConnection(connectionString);
            sqlConnection.Open();
        }

        // step 2: Create Connector

        // install sqlclient
        SqlConnection sqlConnection;

        // create command adaptor
        SqlCommand sqlCommand;

        private async void SearchBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                /*
                Establish_Connection();

                String query = "select * from Student where std_Id = @id";

                sqlCommand = new SqlCommand(query, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@id", int.Parse(SearchIdTbx.Text));

                bool noData = true;

                SqlDataReader reader = sqlCommand.ExecuteReader();

                while (reader.Read()) {
                    noData = false;

                    Student student = new Student();

                    student.Name = (string)reader["std_Name"];
                    student.Id = (int)reader["std_Id"];
                    student.Email = (string)reader["std_Email"];
                    student.Reg_Year = (int)reader["std_Reg_Year"];
                    student.Term = (string)reader["std_Reg_Term"];

                    StudentNameTbx.Text = student.Name;
                    StudentIdTbx.Text = student.Id.ToString();
                    EmailTbx.Text = student.Email;
                    RegTermTbx.Text = student.Term;
                    RegYearTbx.Text = student.Reg_Year.ToString();
                }

                if (noData) {
                    MessageBox.Show("The search ID is not present");
                } 
                
                */

                int stdID = int.Parse(SearchIdTbx.Text);
                // generate the client request
                var response = await httpClient.GetStringAsync(
                    "GetStudentById/" + stdID);
                // Deseriable the JSON response
                Response res = JsonConvert.DeserializeObject<Response>(response);
                if (res != null)
                {
                    MessageBox.Show(res.statusCode + " " + res.statusMessage);
                    StudentNameTbx.Text = res.std.Name;
                    EmailTbx.Text = res.std.Email;
                    RegYearTbx.Text = res.std.Reg_Year.ToString();
                    RegTermTbx.Text = res.std.Term;
                    StudentIdTbx.Text = res.std.Id.ToString();
                }
                else {

                    MessageBox.Show("Connection error present ");
                }

            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            // sqlConnection.Close();
        }

        private async void InsertBtn_Click(object sender, RoutedEventArgs e)
        { /*
            try {
                Establish_Connection();

                // step 3: Generate the db query
                string query = "insert into Student values(@name, @email, @regyear, @regterm)";

                // step 4: Initialize the sql command
                sqlCommand = new SqlCommand(query, sqlConnection);

                // step 5: initialize the variables of the query
                sqlCommand.Parameters.AddWithValue("@name", StudentNameTbx.Text);
                sqlCommand.Parameters.AddWithValue("@email", EmailTbx.Text);
                sqlCommand.Parameters.AddWithValue("@regyear", int.Parse(RegYearTbx.Text));
                sqlCommand.Parameters.AddWithValue("@regterm", RegTermTbx.Text);

                // step 6: Execute the Query with values
                // ExecuteNonQuery returns 1 if no error happens
                int status = sqlCommand.ExecuteNonQuery();

                if (status == 1)
                {
                    MessageBox.Show("Data Inserted Successfully");
                }
                else
                {
                    MessageBox.Show("Something went wrong!");
                }

            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }
            // step 7: Close the connection
            sqlConnection.Close();
          */
            
            Student std = new Student();

            std.Name = StudentNameTbx.Text;
            std.Email = EmailTbx.Text;
            std.Reg_Year = int.Parse(RegYearTbx.Text);
            std.Term = RegTermTbx.Text;

            new DBApp().AddStudent(std);
        /*
            string json = JsonConvert.SerializeObject(std);

            using StringContent jsonContent = new(
                json,
                Encoding.UTF8,
                "application/json");

            Console.WriteLine(jsonContent);

            // need to call the add student api
            var response = await httpClient.PostAsync("AddStudent", jsonContent);

            // Deserialze the response message you got from Remote Server
            //MessageBox.Show(response.Content.ToString());
            MessageBox.Show(response.StatusCode.ToString());
        */
        }

        private async void Show_All_Click(object sender, RoutedEventArgs e)
        {
            // Read all the reports from the DB table
            /*
            try {
                Establish_Connection();

                string query = "select * from Student";

                sqlCommand = new SqlCommand(query, sqlConnection);

                SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);

                DataTable dt = new DataTable();

                adapter.Fill(dt);

                StudentDataGrid.ItemsSource = dt.AsDataView();

               // DataContext = adapter; //? to re-initialize WPF form
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            } 
            */

            try
            {
                var response = await httpClient.GetStringAsync("GetAllStudents");
                // We now need to deserialize the response message
                Response res = JsonConvert.DeserializeObject<Response>(response);

                if (res != null)
                {
                    MessageBox.Show(res.statusCode.ToString() +
                        " " + res.statusMessage);
                    // StudentDataGrid.Visibility = Visibility.Visible;

                    DataTable studentsTable = new DataTable("table");

                    DataColumn colItem1 = new DataColumn("Name",
                        Type.GetType("System.String"));
                    DataColumn colItem2 = new DataColumn("ID",
                        Type.GetType("System.String"));
                    DataColumn colItem3 = new DataColumn("Email",
                        Type.GetType("System.String"));
                    DataColumn colItem4 = new DataColumn("Reg Year",
                        Type.GetType("System.String"));
                    DataColumn colItem5 = new DataColumn("Term",
                        Type.GetType("System.String"));

                    studentsTable.Columns.Add(colItem1);
                    studentsTable.Columns.Add(colItem2);
                    studentsTable.Columns.Add(colItem3);
                    studentsTable.Columns.Add(colItem4);
                    studentsTable.Columns.Add(colItem5);

                    for (int i = 0; i < res.stds.Count; i++)
                    {
                        Student student = res.stds[i];

                        DataRow newRow;

                        newRow = studentsTable.NewRow();
                        newRow["Name"] = student.Name;
                        newRow["ID"] = student.Id;
                        newRow["Email"] = student.Email;
                        newRow["Reg Year"] = student.Reg_Year;
                        newRow["Term"] = student.Term;

                        studentsTable.Rows.Add(newRow);
                    }

                    StudentDataGrid.ItemsSource = new DataView(studentsTable);

                    string json = JsonConvert.SerializeObject(res.stds);

                    Console.WriteLine(json);

                    // DataContext = this;
                }
                else
                    MessageBox.Show("Data Connection Error");
            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }
        }

        private async void updateBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                /*
                Establish_Connection();

                string query = "update Student set std_Name=@name, std_Email=@email, " +
                    "std_Reg_Year=@regYear, std_Reg_Term=@regTerm where std_Id=@id";

                sqlCommand = new SqlCommand(query, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@name", StudentNameTbx.Text);
                sqlCommand.Parameters.AddWithValue("@email", EmailTbx.Text);
                sqlCommand.Parameters.AddWithValue("@regYear", int.Parse(RegYearTbx.Text));
                sqlCommand.Parameters.AddWithValue("@regTerm", RegTermTbx.Text);
                sqlCommand.Parameters.AddWithValue("@id", int.Parse(StudentIdTbx.Text));

                int i = sqlCommand.ExecuteNonQuery();

                if (i == 1) {
                    MessageBox.Show("Update successful");
                }
                */

                // we need the updated student information from the text boxes
                Student std = new Student();
                std.Name = StudentNameTbx.Text;
                std.Email = EmailTbx.Text;
                std.Reg_Year = int.Parse(RegYearTbx.Text);
                std.Term = RegTermTbx.Text;
                std.Id = int.Parse(StudentIdTbx.Text);

                int stdID = int.Parse(SearchIdTbx.Text);

                string json = JsonConvert.SerializeObject(std);

                using StringContent jsonContent = new(
                    json,
                    Encoding.UTF8,
                    "application/json");

                Console.WriteLine(jsonContent);

                // we need to send the student to the server machine
                var response = await httpClient.PutAsync(
                    "UpdateStudentById/" + stdID, jsonContent);
                // Deserialization
                MessageBox.Show(response.ToString());
            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            sqlConnection.Close();
        }

        private void StudentNameTbx_GotFocus(object sender, RoutedEventArgs e)
        {
            StudentNameTbx.Text = "";
        }

        private void EmailTbx_GotFocus(object sender, RoutedEventArgs e)
        {
            EmailTbx.Text = "";
        }

        private void RegYearTbx_GotFocus(object sender, RoutedEventArgs e)
        {
            RegYearTbx.Text = "";
        }

        private void RegTermTbx_GotFocus(object sender, RoutedEventArgs e)
        {
            RegTermTbx.Text = "";
        }

        private async void DeleteBtn_Click(object sender, RoutedEventArgs e)
        {
            try {
                /*
                Establish_Connection();

                string query = "Delete from student where std_Id = '" + int.Parse(StudentIdTbx.Text) + "'";
            
                sqlCommand = new SqlCommand(query, sqlConnection);

                int i = sqlCommand.ExecuteNonQuery();

                if (i == 1)
                {
                    MessageBox.Show("Student deleted successfully");
                }
                else {
                    MessageBox.Show("Student not found");
                }
                */

                int stdID = int.Parse(StudentIdTbx.Text);
                // generating the delete request using restAPI
                var response = await httpClient.DeleteAsync("DeleteStudentById/" + stdID);
                // deserialize it.
                MessageBox.Show(response.ToString());
                //Response res = JsonConvert.DeserializeObject<Response>(response);
            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            sqlConnection.Close();
        }

        private void StudentDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            try
            {
                DataRowView row =  StudentDataGrid.SelectedItem as DataRowView;

                if (row != null)
                {
                    StudentIdTbx.Text = (string)row["ID"];
                    StudentNameTbx.Text = (string)row["Name"];
                    EmailTbx.Text = (string)row["Email"];
                    RegYearTbx.Text = (string)row["Reg Year"];
                    RegTermTbx.Text = (string)row["Term"];
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
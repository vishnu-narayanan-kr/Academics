using System.Data;
using System.Data.SqlClient;
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
        public MainWindow()
        {
            InitializeComponent();
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

        private void SearchBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
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

            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            sqlConnection.Close();
        }

        private void InsertBtn_Click(object sender, RoutedEventArgs e)
        {
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
        }

        private void Show_All_Click(object sender, RoutedEventArgs e)
        {
            // Read all the reports from the DB table

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
        }

        private void updateBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
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

        private void DeleteBtn_Click(object sender, RoutedEventArgs e)
        {
            try {
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
            } catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            sqlConnection.Close();
        }
    }
}
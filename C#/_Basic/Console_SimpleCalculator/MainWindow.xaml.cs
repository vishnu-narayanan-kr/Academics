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

namespace FirstProjectWPF
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

        private void submit_Click(object sender, RoutedEventArgs e)
        {
            // whenever we need to inject any controls from the wpf page, we need to use their name

            double a = double.Parse(inputOne.Text);
            double b = double.Parse(inputTwo.Text);

            double results = 0;

            // handle comboBox event

            if (operations.SelectedIndex == 0)
            {
                results = a + b;
            }
            else if (operations.SelectedIndex == 1)
            {
                results = a - b;
            }
            else if (operations.SelectedIndex == 2)
            {
                results = a * b;
            }
            else if (operations.SelectedIndex == 3)
            {
                results = a / b;
            }
            else if (operations.SelectedIndex == 4)
            {
                results = a % b;
            }
            else 
            {
                MessageBox.Show("Select Proper Option");
            }

            result.Text = results.ToString();
        }

        private void inputOne_GotFocus(object sender, RoutedEventArgs e)
        {
            inputOne.Text = "";
        }

        private void inputTwo_GotFocus(object sender, RoutedEventArgs e)
        {
            inputTwo.Text = "";
        }
    }
}
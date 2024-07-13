using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Layout1
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

        private void ListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

        }

        private void DateBtn_Click(object sender, RoutedEventArgs e)
        {
            DateTxt.Text = datePicker.SelectedDate.ToString();
        }

        private void ListItems_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // ListItemTxt.Text = (ListItems.SelectedItem as ListBoxItem).Content.ToString();
            if (IsLoaded) {
                string temp = "";

                foreach (ListBoxItem item in ListItems.SelectedItems) {
                    temp += item.Content.ToString() + " ";
                }

                ListItemTxt.Text = temp;
            }
        }

        private void cmboBx_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // comboboxText.Text = (combobox.SelectedItem as ComboBoxItem).Content.ToString();

            var selectedItem = sender as ComboBox;
            comboboxText.Text = selectedItem.SelectedItem.ToString();
        }

        private void loadButton_Click(object sender, RoutedEventArgs e)
        {
            List<string> cities = new List<string>();

            cities.Add("Montreal");
            cities.Add("Ottawa");
            cities.Add("Edmonton");


            cmboBx.ItemsSource = cities;
            cmboBx.SelectedIndex = 0;
        }

        private void chkbx1_Checked(object sender, RoutedEventArgs e)
        {
            chkbxTextbx.Text = chkbx1.Content.ToString();
        }

        private void rb1_Checked(object sender, RoutedEventArgs e)
        {
            chkbxTextbx.Text = rb1.Content.ToString();
        }

        private void chkbxApp2_Checked(object sender, RoutedEventArgs e)
        {
            app2 app2 = new app2();
            app2.Show();
        }
    }
}

using System;
using System.Text;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using System.Drawing.Text;
using System.Diagnostics;

namespace locker_app
{
    public partial class Welcome : Form
    {
        public FormWindowState WindowState { get; set; }
        public string code = "";
        public string thankText = "";
        public string lockerText = "";

        public Welcome()
        {
            InitializeComponent();
            this.GoFullscreen(true);
            this.ReformatControls();
            this.KeyPreview = true;
            this.KeyPress +=
                new KeyPressEventHandler(Welcome_KeyPress);
        }

        void Welcome_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Return)
            {
                code += "\n";
                bool goToPurchased = SendToPython();
                code = "";
                if (goToPurchased)
                {
                    this.Hide();
                    Purchased purchasedForm = new Purchased(thankText, lockerText);
                    purchasedForm.ShowDialog();
                }
            }
            else
            {
                code += e.KeyChar.ToString();
            }
            e.Handled = true;
        }

        private bool SendToPython()
        {
            // full path of python interpreter  
            string powershell = @"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe";

            // python app to call  
            string myPythonApp = "C:\\Users\\jbuxofplenty\\Documents\\DejaFood\\fudlocker\\locker\\locker_application\\plc_communication\\foodlocker_background.py";

            // Create new process start info 
            ProcessStartInfo myProcessStartInfo = new ProcessStartInfo(powershell);

            string python = @"C:\Users\jbuxofplenty\AppData\Local\Programs\Python\Python37-32\python.exe";

            if (System.Environment.OSVersion.Version.Major >= 6)
            {
                myProcessStartInfo.Verb = "runas";
            }

            // make sure we can read the output from stdout 
            myProcessStartInfo.UseShellExecute = false;
            myProcessStartInfo.RedirectStandardOutput = true;
            myProcessStartInfo.UseShellExecute = false;
            myProcessStartInfo.CreateNoWindow = true;

            // start python app with 3 arguments  
            // 1st argument is pointer to itself, 2nd and 3rd are actual arguments we want to send
            string code_send = code.ToString().TrimEnd('\r', '\n');
            myProcessStartInfo.Arguments = python + " " + myPythonApp + " " + code_send + " null";

            Debug.WriteLine(myProcessStartInfo.Arguments);

            Process myProcess = new Process();
            // assign start information to the process 
            myProcess.StartInfo = myProcessStartInfo;

            // start process 
            myProcess.Start();

            StringBuilder q = new StringBuilder();
            while (!myProcess.HasExited)
            {
                q.Append(myProcess.StandardOutput.ReadToEnd());
            }
            string myString = q.ToString();

            // wait exit signal from the app we called 
            myProcess.WaitForExit();

            // close the process 
            myProcess.Close();

            // write the output we got from python app 
            Debug.WriteLine("Value received from script: " + myString);
            string[] ssize = myString.Split('\t');
            if(ssize[0]=="dropOff")
            {
                thankText = "Meal Drop Off!";
                lockerText = "Please place the " + ssize[1] + " in locker #" + ssize[2].TrimEnd('\r', '\n') + ".";
                return true;
            }
            else if (ssize[0] == "pickUp")
            {
                thankText = "Thank you for your purchase!";
                lockerText = "Locker #" + ssize[2].TrimEnd('\r', '\n') + " is opening with your " + ssize[1] + "!";
                return true;
            }
            else
            {
                return false;
            }
        }

        private void WelcomeLoad(object sender, EventArgs e)
        {
            PrivateFontCollection pfc = new PrivateFontCollection();
            pfc.AddFontFile("fonts\\PoorStory-Regular.ttf");
            welcomeButton.Font = new Font(pfc.Families[0], 48, FontStyle.Regular);

        }

        private void GoFullscreen(bool fullscreen)
        {
            if (fullscreen)
            {
                this.WindowState = FormWindowState.Normal;
                this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
                this.Bounds = Screen.PrimaryScreen.Bounds;
            }
            else
            {
                this.WindowState = FormWindowState.Maximized;
                this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.Sizable;
            }
        }

        private void ReformatControls()
        {
            System.Drawing.Rectangle screenSize = Screen.PrimaryScreen.WorkingArea;
            int stackSize = 0;
            int curStackSize = 0;
            List<Control> controls = new List<Control>();
            foreach (var control in Extensions.GetAllChildren(this).Select((x, i) => new { Value = x, Index = i }))
            {
                if (control.Index != 0)
                {
                    stackSize += control.Value.Height + 80;
                    controls.Insert(0, control.Value);
                }
            }
            foreach (var control in controls.Select((x, i) => new { Value = x, Index = i }))
            {
                control.Value.Location = new Point(
                    (screenSize.Width - control.Value.Width) / 2,
                    (screenSize.Height - stackSize) / 2 + curStackSize
                );
                curStackSize += control.Value.Height + 80;
            }
        }

        private void welcomeButton_Click(object sender, EventArgs e)
        {
            bool IsMouse = (e is System.Windows.Forms.MouseEventArgs);
            if(IsMouse)
            {
                this.Hide();
                Meals mealsForm = new Meals();
                mealsForm.ShowDialog();
            }
            else
            {
                code += "\n";
                bool goToPurchased = SendToPython();
                code = "";
                if(goToPurchased)
                {
                    this.Hide();
                    Purchased purchasedForm = new Purchased(thankText, lockerText);
                    purchasedForm.ShowDialog();
                }
            }
        }

    }
    public static class Extensions
    {
        public static IEnumerable<Tuple<int, T>> Enumerate<T>(IEnumerable<T> list)
        {
            int id = 0;
            foreach (var elem in list)
            {
                yield return new Tuple<int, T>(id, elem);
                id++;
            }
        }

        public static IEnumerable<Control> GetAllChildren(this Control root)
        {
            var stack = new Stack<Control>();
            stack.Push(root);

            while (stack.Any())
            {
                var next = stack.Pop();
                foreach (Control child in next.Controls)
                    stack.Push(child);
                yield return next;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Drawing.Text;

namespace locker_app
{
    public partial class Welcome : Form
    {
        public FormWindowState WindowState { get; set; }

        public Welcome()
        {
            InitializeComponent();
            this.GoFullscreen(true);
            this.ReformatControls();
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
            this.Hide();
            Meals mealsForm = new Meals();
            mealsForm.ShowDialog();
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

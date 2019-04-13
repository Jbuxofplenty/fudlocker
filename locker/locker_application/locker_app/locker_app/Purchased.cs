using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using System.Drawing.Text;

namespace locker_app
{
    public partial class Purchased : Form
    {
        string thankText;
        string lockerText;

        private void Navigate()
        {
            this.Hide();
            Welcome welcomeForm = new Welcome();
            welcomeForm.ShowDialog();
        }

        public FormWindowState WindowState { get; set; }

        public Purchased(string thankText, string lockerText)
        {
            InitializeComponent();
            this.GoFullscreen(true);
            this.ReformatControls();
            AppTimer timer = new AppTimer(10);
            this.thankText = thankText;
            this.lockerText = lockerText;
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
                    controls.Add(control.Value);
                }
            }
            foreach (var control in controls.Select((x, i) => new { Value = x, Index = i }))
            {
                var width = (screenSize.Width - control.Value.Width) / 2;
                if (control.Value.Name.Contains("Label"))
                    width += 100;
                control.Value.Location = new Point(
                    width,
                    (screenSize.Height - stackSize) / 2 + curStackSize
                );
                curStackSize += control.Value.Height + 80;
            }
        }

        private void PurchasedLoad(object sender, EventArgs e)
        {
            PrivateFontCollection pfc = new PrivateFontCollection();
            pfc.AddFontFile("fonts\\PoorStory-Regular.ttf");
            thankLabel.Text = this.thankText;
            lockerLabel.Text = this.lockerText;
            thankLabel.Font = new Font(pfc.Families[0], 48, FontStyle.Regular);
            lockerLabel.Font = new Font(pfc.Families[0], 48, FontStyle.Regular);
        }
    }
}

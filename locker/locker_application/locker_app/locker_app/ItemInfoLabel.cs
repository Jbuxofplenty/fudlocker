using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Drawing.Text;
using System.Drawing;

namespace locker_app
{
    class ItemInfoLabel : Label
    {
        public ItemInfoLabel(string text, Font textFont)
        {
            this.BackColor = Color.Transparent;
            this.Font = textFont;
            this.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Text = text;
            this.Height = 60;
            this.ForeColor = Color.White;
            this.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
        }
    }
}

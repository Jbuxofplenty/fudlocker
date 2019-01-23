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
        public ItemInfoLabel(string cost, Font textFont)
        {
            this.BackColor = Color.Transparent;
            this.Font = textFont;
            this.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Text = "$" + cost;
            this.BackColor = Color.LightSlateGray;
            this.ForeColor = Color.White;
            this.BringToFront();
            this.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
        }
    }
}

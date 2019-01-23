using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.ComponentModel;
using System.Data;
using System.Reflection;
using System.Windows.Forms;
using System.Drawing.Text;
using System.Drawing.Drawing2D;

namespace locker_app
{
    class ItemContainer : TableLayoutPanel
    {

        public ItemContainer (TableLayoutPanelGrowStyle growStyle, System.Drawing.Size size, System.Drawing.Color backColor, System.Windows.Forms.Padding margin)
        {
            this.GrowStyle = growStyle;
            this.Size = size;
            this.BackColor = backColor;
            this.Margin = margin;
        }
        protected override void OnPaint(PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.FillRoundedRectangle(new SolidBrush(Color.LightSlateGray), 0, 0, this.Width, this.Height, 10);
            SolidBrush brush = new SolidBrush(
                Color.LightSlateGray
                );
            g.FillRoundedRectangle(brush, 2, 2, this.Width - 2, this.Height - 2, 10);
            g.DrawRoundedRectangle(new Pen(ControlPaint.Light(Color.LightSlateGray, 0.00f)), 12, 2, this.Width - 2, this.Height - 2, 10);
            g.FillRoundedRectangle(new SolidBrush(Color.LightSlateGray), 2, 2 + ((this.Height - 2) / 2), this.Width - 2, (this.Height - 2) / 2, 10);
        }
    }
}

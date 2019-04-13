using System.Windows.Forms;

namespace locker_app
{
    partial class Purchased
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.fudlkr_logo = new System.Windows.Forms.PictureBox();
            this.thankLabel = new System.Windows.Forms.Label();
            this.lockerLabel = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.fudlkr_logo)).BeginInit();
            this.SuspendLayout();
            // 
            // fudlkr_logo
            // 
            this.fudlkr_logo.ImageLocation = "http://fudlkr.com/images/fudlkr_logo.png";
            this.fudlkr_logo.Location = new System.Drawing.Point(542, 40);
            this.fudlkr_logo.Name = "fudlkr_logo";
            this.fudlkr_logo.Size = new System.Drawing.Size(500, 250);
            this.fudlkr_logo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.fudlkr_logo.TabIndex = 2;
            this.fudlkr_logo.TabStop = false;
            // 
            // thankLabel
            // 
            this.thankLabel.AutoSize = true;
            this.thankLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.thankLabel.Location = new System.Drawing.Point(373, 327);
            this.thankLabel.Name = "thankLabel";
            this.thankLabel.Size = new System.Drawing.Size(862, 73);
            this.thankLabel.TabIndex = 3;
            this.thankLabel.Text = "Thank you for you purchase! ";
            // 
            // lockerLabel
            // 
            this.lockerLabel.AutoSize = true;
            this.lockerLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lockerLabel.Location = new System.Drawing.Point(24, 440);
            this.lockerLabel.Name = "lockerLabel";
            this.lockerLabel.Size = new System.Drawing.Size(1506, 73);
            this.lockerLabel.TabIndex = 4;
            this.lockerLabel.Text = "Locker door containing your meal is opening............";
            // 
            // Purchased
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(46)))), ((int)(((byte)(204)))), ((int)(((byte)(113)))));
            this.ClientSize = new System.Drawing.Size(1584, 761);
            this.Controls.Add(this.lockerLabel);
            this.Controls.Add(this.thankLabel);
            this.Controls.Add(this.fudlkr_logo);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Purchased";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.PurchasedLoad);
            ((System.ComponentModel.ISupportInitialize)(this.fudlkr_logo)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private PictureBox fudlkr_logo;
        private Label thankLabel;
        private Label lockerLabel;
    }
}


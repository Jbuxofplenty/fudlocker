using System.Windows.Forms;

namespace locker_app
{
    partial class Welcome
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
            this.welcomeButton = new System.Windows.Forms.Button();
            this.fudlkr_logo = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.fudlkr_logo)).BeginInit();
            this.SuspendLayout();
            // 
            // welcomeButton
            // 
            this.welcomeButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(171)))), ((int)(((byte)(235)))), ((int)(((byte)(198)))));
            this.welcomeButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 36F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.welcomeButton.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.welcomeButton.Location = new System.Drawing.Point(491, 311);
            this.welcomeButton.Name = "welcomeButton";
            this.welcomeButton.Size = new System.Drawing.Size(600, 200);
            this.welcomeButton.TabIndex = 1;
            this.welcomeButton.Text = "Welcome";
            this.welcomeButton.UseVisualStyleBackColor = false;
            this.welcomeButton.Click += new System.EventHandler(this.welcomeButton_Click);
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
            // Welcome
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(46)))), ((int)(((byte)(204)))), ((int)(((byte)(113)))));
            this.ClientSize = new System.Drawing.Size(1584, 761);
            this.Controls.Add(this.fudlkr_logo);
            this.Controls.Add(this.welcomeButton);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Welcome";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Welcome";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.WelcomeLoad);
            ((System.ComponentModel.ISupportInitialize)(this.fudlkr_logo)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion
        private Button welcomeButton;
        private PictureBox fudlkr_logo;
    }
}


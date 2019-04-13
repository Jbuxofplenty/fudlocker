namespace locker_app
{
    partial class Meals
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Meals));
            this.MealsLabel = new System.Windows.Forms.Label();
            this.backButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // MealsLabel
            // 
            this.MealsLabel.AutoSize = true;
            this.MealsLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.MealsLabel.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.MealsLabel.Location = new System.Drawing.Point(492, 25);
            this.MealsLabel.Name = "MealsLabel";
            this.MealsLabel.Size = new System.Drawing.Size(434, 73);
            this.MealsLabel.TabIndex = 0;
            this.MealsLabel.Text = "Browse Meals";
            // 
            // backButton
            // 
            this.backButton.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.backButton.Image = ((System.Drawing.Image)(resources.GetObject("backButton.Image")));
            this.backButton.Location = new System.Drawing.Point(12, 12);
            this.backButton.Name = "backButton";
            this.backButton.Size = new System.Drawing.Size(64, 67);
            this.backButton.TabIndex = 1;
            this.backButton.TextImageRelation = System.Windows.Forms.TextImageRelation.TextBeforeImage;
            this.backButton.UseVisualStyleBackColor = true;
            this.backButton.Click += new System.EventHandler(this.backButton_Click);
            // 
            // Meals
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(46)))), ((int)(((byte)(204)))), ((int)(((byte)(113)))));
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.ClientSize = new System.Drawing.Size(1446, 635);
            this.Controls.Add(this.backButton);
            this.Controls.Add(this.MealsLabel);
            this.Name = "Meals";
            this.Text = "Meals";
            this.Load += new System.EventHandler(this.Meals_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label MealsLabel;
        private System.Windows.Forms.Button backButton;
    }
}
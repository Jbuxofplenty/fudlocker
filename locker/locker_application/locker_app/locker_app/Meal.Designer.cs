namespace locker_app
{
    partial class Meal
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Meal));
            this.MealLabel = new System.Windows.Forms.Label();
            this.backButton = new System.Windows.Forms.Button();
            this.costLabel = new System.Windows.Forms.Label();
            this.datePackagedLabel = new System.Windows.Forms.Label();
            this.caloriesLabel = new System.Windows.Forms.Label();
            this.categoryLabel = new System.Windows.Forms.Label();
            this.purchaseButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // MealLabel
            // 
            this.MealLabel.AutoSize = true;
            this.MealLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.MealLabel.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.MealLabel.Location = new System.Drawing.Point(605, 51);
            this.MealLabel.Name = "MealLabel";
            this.MealLabel.Size = new System.Drawing.Size(309, 73);
            this.MealLabel.TabIndex = 0;
            this.MealLabel.Text = "Meal Title";
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
            this.backButton.MouseClick += new System.Windows.Forms.MouseEventHandler(this.backButton_MouseClick);
            // 
            // costLabel
            // 
            this.costLabel.AutoSize = true;
            this.costLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.costLabel.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.costLabel.Location = new System.Drawing.Point(605, 153);
            this.costLabel.Name = "costLabel";
            this.costLabel.Size = new System.Drawing.Size(164, 73);
            this.costLabel.TabIndex = 3;
            this.costLabel.Text = "Cost";
            // 
            // datePackagedLabel
            // 
            this.datePackagedLabel.AutoSize = true;
            this.datePackagedLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.datePackagedLabel.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.datePackagedLabel.Location = new System.Drawing.Point(605, 255);
            this.datePackagedLabel.Name = "datePackagedLabel";
            this.datePackagedLabel.Size = new System.Drawing.Size(472, 73);
            this.datePackagedLabel.TabIndex = 4;
            this.datePackagedLabel.Text = "Date Packaged";
            // 
            // caloriesLabel
            // 
            this.caloriesLabel.AutoSize = true;
            this.caloriesLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.caloriesLabel.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.caloriesLabel.Location = new System.Drawing.Point(605, 364);
            this.caloriesLabel.Name = "caloriesLabel";
            this.caloriesLabel.Size = new System.Drawing.Size(570, 73);
            this.caloriesLabel.TabIndex = 5;
            this.caloriesLabel.Text = "Estimated Calories";
            // 
            // categoryLabel
            // 
            this.categoryLabel.AutoSize = true;
            this.categoryLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 48F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.categoryLabel.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.categoryLabel.Location = new System.Drawing.Point(605, 486);
            this.categoryLabel.Name = "categoryLabel";
            this.categoryLabel.Size = new System.Drawing.Size(293, 73);
            this.categoryLabel.TabIndex = 6;
            this.categoryLabel.Text = "Category";
            // 
            // purchaseButton
            // 
            this.purchaseButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(64)))), ((int)(((byte)(0)))));
            this.purchaseButton.ForeColor = System.Drawing.Color.White;
            this.purchaseButton.Location = new System.Drawing.Point(618, 577);
            this.purchaseButton.Name = "purchaseButton";
            this.purchaseButton.Size = new System.Drawing.Size(534, 72);
            this.purchaseButton.TabIndex = 7;
            this.purchaseButton.Text = "Purchase Meal!";
            this.purchaseButton.UseVisualStyleBackColor = false;
            this.purchaseButton.Click += new System.EventHandler(this.purchaseButton_Click);
            // 
            // Meal
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(46)))), ((int)(((byte)(204)))), ((int)(((byte)(113)))));
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.ClientSize = new System.Drawing.Size(1284, 644);
            this.Controls.Add(this.purchaseButton);
            this.Controls.Add(this.categoryLabel);
            this.Controls.Add(this.caloriesLabel);
            this.Controls.Add(this.datePackagedLabel);
            this.Controls.Add(this.costLabel);
            this.Controls.Add(this.backButton);
            this.Controls.Add(this.MealLabel);
            this.Name = "Meal";
            this.Text = "Meal";
            this.Load += new System.EventHandler(this.Meal_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label MealLabel;
        private System.Windows.Forms.Button backButton;
        private System.Windows.Forms.Label costLabel;
        private System.Windows.Forms.Label datePackagedLabel;
        private System.Windows.Forms.Label caloriesLabel;
        private System.Windows.Forms.Label categoryLabel;
        private System.Windows.Forms.Button purchaseButton;
    }
}
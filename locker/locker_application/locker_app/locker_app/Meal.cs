using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Drawing.Text;
using Firebase.Database;
using Firebase.Database.Query;
using Firebase.Auth;
using Newtonsoft.Json.Linq;

namespace locker_app
{
    public partial class Meal : Form
    {
        // vars used specific to meal
        JObject meal;
        Dictionary<string, Control> comps = new Dictionary<string, Control>();
        int labelsHeight = 0;
        private Font PoorStory;
        private Font PoorStory32;

        // screen size
        private System.Drawing.Rectangle windowSize = Screen.PrimaryScreen.WorkingArea;

        // controls.
        private FlowLayoutPanel mainPanel = new FlowLayoutPanel();
        List<ItemContainer> itemPanels = new List<ItemContainer>();
        List<PictureBox> itemPictures = new List<PictureBox>();
        List<ItemInfoLabel> itemCosts = new List<ItemInfoLabel>();
        List<ItemInfoLabel> itemNames = new List<ItemInfoLabel>();
        List<ItemInfoLabel> itemDatePackaged = new List<ItemInfoLabel>();
        List<ItemInfoLabel> itemCategories = new List<ItemInfoLabel>();
        List<Button> itemButtons = new List<Button>();

        // used for maximizing screen
        public FormWindowState WindowState { get; set; }
        
        public Meal(JObject meal)
        {
            InitializeComponent();
            this.meal = meal;
            this.GoFullscreen(true);
            this.ReformatControls();
            this.populateInformation();
            AppTimer timer = new AppTimer(120);
        }

        private void populateInformation()
        {
            // add picture box
            var wc = new WebClient();
            var picture = new PictureBox
            {
                Name = "mealPicture",
                Size = new Size(this.labelsHeight-400, this.labelsHeight- 400),
                Location = new Point(100, 100),
                Image = Image.FromStream(wc.OpenRead(this.meal["strMealThumb"].ToString())),
                SizeMode = PictureBoxSizeMode.StretchImage,
            };
            this.Controls.Add(picture);

            // update label text fields
            MealLabel.Text = this.meal["strMeal"].ToString();
            costLabel.Text = "Cost: $" + this.meal["strCost"].ToString();
            int myLimit = 30;
            string sentence = "Date Packaged: " + this.meal["strDatePackaged"].ToString();
            string[] words = sentence.Split(' ');

            StringBuilder newSentence = new StringBuilder();


            string line = "";
            foreach (string word in words)
            {
                if ((line + word).Length > myLimit)
                {
                    newSentence.AppendLine(line);
                    line = "";
                }

                line += string.Format("{0} ", word);
            }

            if (line.Length > 0)
                newSentence.AppendLine(line);

            Debug.WriteLine(newSentence.ToString());

            datePackagedLabel.Text = newSentence.ToString();

            caloriesLabel.Text = "Estimated Calories: " + this.meal["calories"].ToString();
            categoryLabel.Text = "Category: " + this.meal["strCategory"].ToString();
            purchaseButton.Text = "Purchase " + this.meal["strMeal"].ToString() + "!";
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
            int stackSize = 0;
            int curStackSize = 50;
            List<Control> controls = new List<Control>();
            
            foreach (var control in Extensions.GetAllChildren(this).Select((x, i) => new { Value = x, Index = i }))
            {
                if (control.Index != 0 && (control.Value.Name.Contains("Button") || control.Value.Name.Contains("Label")) && !control.Value.Name.Contains("back"))
                {
                    stackSize += control.Value.Height + 80;
                    controls.Add(control.Value);
                    this.comps.Add(control.Value.Name, control.Value);
                }
            }
            foreach (var control in controls.Select((x, i) => new { Value = x, Index = i }))
            {
                control.Value.Location = new Point(
                    (this.windowSize.Width) / 2,
                    (this.windowSize.Height - stackSize) / 2 + curStackSize
                );
                curStackSize += control.Value.Height + 60;
            }
            this.labelsHeight = stackSize;
        }


        private void Meal_Load(object sender, EventArgs e)
        {
            PrivateFontCollection pfc = new PrivateFontCollection();
            pfc.AddFontFile("fonts\\PoorStory-Regular.ttf");
            this.PoorStory = new Font(pfc.Families[0], 48, FontStyle.Regular);
            this.PoorStory32 = new Font(pfc.Families[0], 28, FontStyle.Regular);
            MealLabel.Font = this.PoorStory;
            costLabel.Font = this.PoorStory32;
            datePackagedLabel.Font = this.PoorStory32;
            caloriesLabel.Font = this.PoorStory32;
            categoryLabel.Font = this.PoorStory32;
            purchaseButton.Font = this.PoorStory32;

            // create a new flow layout form
            this.mainPanel.Location = new System.Drawing.Point(0, 100);
            this.mainPanel.Size = new System.Drawing.Size((this.windowSize.Width), (this.windowSize.Height - 100));     

            // add controls to form
            this.Controls.Add(this.mainPanel);
            
        }

        private void backButton_MouseClick(object sender, MouseEventArgs e)
        {
            this.Hide();
            Meals mealsForm = new Meals();
            mealsForm.ShowDialog();
        }

        async private Task PurchaseMeal()
        {
            var authProvider = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyC6wZSSUcyYDpsuS6bTxfrnOjrY1KIi1qU"));
            var auth = await authProvider.SignInWithEmailAndPasswordAsync("locker@fudlkr.com", "Ifrickingheartfud");
            var userId = auth.User.LocalId;
            var firebaseClient = new FirebaseClient(
              "https://fudlkr-7fc5b.firebaseio.com",
              new FirebaseOptions
              {
                  AuthTokenAsyncFactory = () => Task.FromResult(auth.FirebaseToken)
              });
            // Push the purchased meal data
            await firebaseClient
                    .Child("users/" + userId + "/orders/current/")
                    .PostAsync<JObject>(this.meal);
            await firebaseClient
                    .Child("users/" + userId + "/orders/history/")
                    .PostAsync<JObject>(this.meal);
            await firebaseClient
                    .Child("restaurants/" + this.meal["distributor"] + "/inventory/claimed/" + this.meal["location"].ToString().ToLower() + "/" + this.meal["idMeal"].ToString() + "/")
                    .PostAsync<JObject>(this.meal);
            await firebaseClient
                    .Child("restaurants/" + this.meal["distributor"] + "/orders/purchased/" + this.meal["location"].ToString().ToLower() + "/" + this.meal["idMeal"].ToString() + "/")
                    .PostAsync<JObject>(this.meal);

            // Update that the meal has been purchased
            JObject temp = new JObject();
            await firebaseClient
                    .Child("meals/forSale/"+ this.meal["idMeal"].ToString()+"/")
                    .PutAsync<bool>(false);
        }

        async private Task ReadyPurchase()
        {
            var authProvider = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyC6wZSSUcyYDpsuS6bTxfrnOjrY1KIi1qU"));
            var auth = await authProvider.SignInWithEmailAndPasswordAsync("locker@fudlkr.com", "Ifrickingheartfud");
            var userId = auth.User.FederatedId;
            var email = auth.User.Email;
            this.meal["userEmail"] = email;
            DateTime dateTime = DateTime.Now;
            var date = dateTime.ToUniversalTime().Subtract(
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                ).TotalMilliseconds;
            var d = DateTime.Now.ToString("dddd, MMMM d, yyyy, h:MM:ss tt");
            this.meal["strDatePurchased"] = d;
            this.meal["datePurchased"] = date.ToString();
            this.meal["pickedUp"] = false;
            this.meal["forSale"] = false;
            this.meal["datePickedUp"] = "N/A";
            this.meal["paymentMethod"] = new JObject();
            this.meal["name"] = "c4c";
            this.meal["headshot"] = "https://s3-us-west-1.amazonaws.com/fudlkr.com/mobile_assets/green.png";
        }

        async private Task PickUpMeal()
        {
            var authProvider = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyC6wZSSUcyYDpsuS6bTxfrnOjrY1KIi1qU"));
            var auth = await authProvider.SignInWithEmailAndPasswordAsync("locker@fudlkr.com", "Ifrickingheartfud");
            var userId = auth.User.LocalId;
            var firebaseClient = new FirebaseClient(
              "https://fudlkr-7fc5b.firebaseio.com",
              new FirebaseOptions
              {
                  AuthTokenAsyncFactory = () => Task.FromResult(auth.FirebaseToken)
              });

            // Set new data
            DateTime dateTime = DateTime.Now;
            var date = dateTime.ToUniversalTime().Subtract(
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                ).TotalMilliseconds;
            var d = DateTime.Now.ToString("dddd, MMMM d, yyyy, h:MM:ss TT");
            this.meal["strDatePickedUp"] = d;
            this.meal["datePickedUp"] = date.ToString();
            this.meal["pickedUp"] = true;

            // Push the picked up meal data
            await firebaseClient
                    .Child("restaurants/" + this.meal["distributor"] + "/orders/completed/" + this.meal["location"].ToString().ToLower() + "/" + this.meal["idMeal"] + "/")
                    .PostAsync<JObject>(this.meal);

            // Update that the meal has been picked up
            JObject temp = new JObject();
            await firebaseClient
                    .Child("restaurants/" + this.meal["distributor"] + "/inventory/pickedUp/" + this.meal["idMeal"].ToString() + "/")
                    .PutAsync<bool>(true);

            this.SendToPython((string)this.meal["locker"]);
        }

        private void SendToPython(string locker)
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
            myProcessStartInfo.Arguments = python + " " + myPythonApp + " null " + locker;

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
        }

        async private void purchaseButton_Click(object sender, EventArgs e)
        {
            await this.ReadyPurchase();
            await this.PurchaseMeal();
            await this.PickUpMeal();
            this.Hide();
            Purchased purchasedForm = new Purchased("Thank you for your purchase!", "Locker #" + (string)this.meal["locker"] + " is opening with your " + (string)this.meal["strMeal"] + "!");
            purchasedForm.ShowDialog();
        }
    }
}

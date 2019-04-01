using System;
using System.Collections.Generic;
using System.ComponentModel;
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
    public partial class Meals : Form
    {
        // vars used specific to locker
        private string location = "c4c";
        private JObject meals = new JObject();
        private JObject allMeals = new JObject();
        private JObject mealsForSale = new JObject();
        private int curMeal = 0;
        private Font PoorStory;
        private Font PoorStory32;

        // screen size
        private System.Drawing.Rectangle screenSize = Screen.PrimaryScreen.WorkingArea;

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
        
        public Meals()
        {
            InitializeComponent();
            this.GoFullscreen(true);
            this.ReformatControls();
            this.render();
            AppTimer timer = new AppTimer(120);
        }

        async private void render()
        {
            await this.populateInfoAsync();
            this.plotItems();
        }

        async private Task populateInfoAsync()
        {
            var authProvider = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyC6wZSSUcyYDpsuS6bTxfrnOjrY1KIi1qU"));
            var auth = await authProvider.SignInWithEmailAndPasswordAsync("locker@fudlkr.com", "Ifrickingheartfud" );
            var firebaseClient = new FirebaseClient(
              "https://fudlkr-7fc5b.firebaseio.com",
              new FirebaseOptions
              {
                  AuthTokenAsyncFactory = () => Task.FromResult(auth.FirebaseToken)
              });

            // Get all of the meals that are currently for sale
            var firebaseForSale = await firebaseClient
                              .Child("meals")
                              .Child("forSale")
                              .OnceAsync<Object>();

            foreach (var meal in firebaseForSale)
                this.mealsForSale.Add(meal.Key, JToken.FromObject(meal.Object));

            // Get all of the recently marketed meals on firebase
            var firebaseAllMeals = await firebaseClient
                              .Child("meals/locations/"+this.location+"/meals/")
                              .OnceAsync<Object>();
            
            foreach (var meal in firebaseAllMeals)
            {
                JObject tempObject = (JObject)meal.Object;
                var tempKey = "";
                foreach (JProperty prop in tempObject.Properties())
                    tempKey = prop.Name.ToString();
                JToken tempToken = (JToken)tempObject[tempKey];
                this.allMeals.Add(meal.Key, tempToken);
            }

            // use mealsForSale as a filter on allMeals
            foreach (JProperty prop in this.mealsForSale.Properties())
            {
                if( (bool)this.mealsForSale[prop.Name] && this.allMeals[prop.Name] != null)
                    this.meals.Add(prop.Name, this.allMeals[prop.Name]);
            }            
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
            foreach (var control in Extensions.GetAllChildren(this).Select((x, i) => new { Value = x, Index = i }))
            {
                if (control.Value.Name == "MealsLabel")
                {
                    control.Value.Location = new Point(
                        (this.screenSize.Width - control.Value.Width) / 2,
                        control.Value.Location.Y
                    );
                }
            }

        }

        private void plotItems()
        {
            // iterate through the meals and make an item container for each
            foreach (var meal in this.meals)
            {
                // add panel for specific item
                this.itemPanels.Add(new ItemContainer(TableLayoutPanelGrowStyle.AddColumns, new System.Drawing.Size(415, 615), System.Drawing.Color.FromArgb(46, 204, 113), new System.Windows.Forms.Padding(25)));

                // add meal picture to the panel
                this.itemPictures.Add(new PictureBox());
                this.itemPictures[this.curMeal].SizeMode = PictureBoxSizeMode.StretchImage;
                this.itemPictures[this.curMeal].ImageLocation = meal.Value["strMealThumb"].ToString();
                this.itemPictures[this.curMeal].Size = new System.Drawing.Size(200, 200);
                this.itemPanels[this.curMeal].Controls.Add(this.itemPictures[this.curMeal]);
                this.itemPictures[this.curMeal].Margin = new System.Windows.Forms.Padding(100, 10, 100, 0);
                this.itemPictures[this.curMeal].Anchor = (AnchorStyles.Top | AnchorStyles.Right | AnchorStyles.Left);

                // add meal name
                this.itemNames.Add(new ItemInfoLabel(meal.Value["strMeal"].ToString(), this.PoorStory32));
                this.itemCosts.Add(new ItemInfoLabel("$" + meal.Value["strCost"].ToString(), this.PoorStory32));
                this.itemCategories.Add(new ItemInfoLabel(meal.Value["strCategory"].ToString(), this.PoorStory32));
                this.itemDatePackaged.Add(new ItemInfoLabel("Date Packaged: " + meal.Value["strDatePackaged"].ToString(), this.PoorStory32));

                // add controls to panels
                this.itemPanels[this.curMeal].Controls.Add(this.itemNames[this.curMeal]);
                this.itemPanels[this.curMeal].Controls.Add(this.itemCosts[this.curMeal]);
                this.itemPanels[this.curMeal].Controls.Add(this.itemCategories[this.curMeal]);
                this.itemPanels[this.curMeal].Controls.Add(this.itemDatePackaged[this.curMeal]);

                // add mouse click handlers
                this.itemPictures[this.curMeal].MouseClick += new MouseEventHandler((sender, e) => this.Item_Click(sender, e, meal.Value));
                this.itemNames[this.curMeal].MouseClick += new MouseEventHandler((sender, e) => this.Item_Click(sender, e, meal.Value));
                this.itemCosts[this.curMeal].MouseClick += new MouseEventHandler((sender, e) => this.Item_Click(sender, e, meal.Value));
                this.itemCategories[this.curMeal].MouseClick += new MouseEventHandler((sender, e) => this.Item_Click(sender, e, meal.Value));
                this.itemPanels[this.curMeal].MouseClick += new MouseEventHandler((sender, e) => this.Item_Click(sender, e, meal.Value));
                this.itemDatePackaged[this.curMeal].MouseClick += new MouseEventHandler((sender, e) => this.Item_Click(sender, e, meal.Value));

                this.mainPanel.Controls.Add(this.itemPanels[this.curMeal]);
                this.curMeal++;
            }
        }

        private void Item_Click(Object sender, EventArgs e, JToken meal)
        {
            this.Hide();
            Meal mealForm = new Meal(meal.ToObject<JObject>());
            mealForm.ShowDialog();
        }

        private void Meals_Load(object sender, EventArgs e)
        {
            PrivateFontCollection pfc = new PrivateFontCollection();
            pfc.AddFontFile("fonts\\PoorStory-Regular.ttf");
            this.PoorStory = new Font(pfc.Families[0], 48, FontStyle.Regular);
            this.PoorStory32 = new Font(pfc.Families[0], 32, FontStyle.Regular);
            MealsLabel.Font = new Font(pfc.Families[0], 48, FontStyle.Regular);

            // create a new flow layout form
            this.mainPanel.Location = new System.Drawing.Point(0, 100);
            this.mainPanel.Size = new System.Drawing.Size((this.screenSize.Width), (this.screenSize.Height - 100));     

            // add controls to form
            this.Controls.Add(this.mainPanel);
            
        }

        private void backButton_MouseClick(object sender, MouseEventArgs e)
        {
            this.Hide();
            Welcome welcomeForm = new Welcome();
            welcomeForm.ShowDialog();
        }
    }
    public static class firebaseHelpers
    {
    }
}

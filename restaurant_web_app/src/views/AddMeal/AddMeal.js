import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataActions } from '../../actions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fire from "../../firebase";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import Modal from 'react-modal';
const _ = require('lodash');
const dateformat = require('dateformat');

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize)

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
};

class AddMealPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      active: false,
      locations: null,
      startDate: new Date(),
      mealData: null,
      files: [],
      imageUrl: null,
      existingMeal: false,
      inventory: null,
      modalVisible: false,
      askedTemplateSave: false,
      locationsData: null,
    };
    this.activeClicked = this.activeClicked.bind(this);
    this.datePickerChange = this.datePickerChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalVisible: true, askedTemplateSave: true });
  }


  closeModal() {
    this.setState({ modalVisible: false });
  }

  async updateData() {
    const { dispatch, user, userData, history } = this.props;
    if (user && userData && userData.org) {
      await dispatch(dataActions.populateAddMeal());
      await dispatch(dataActions.populateDashboard());
      await dispatch(dataActions.populateInventory());
      var inventory = JSON.parse(localStorage.getItem('inventory'));
      var locations = JSON.parse(localStorage.getItem('locations'));
      if (locations && inventory) {
        locations = Object.values(JSON.parse(localStorage.getItem('locations')));
        await this.setState({ locations, inventory });
        this.generateOptions(locations);
        if (this.props.location.state) {
          await this.setState({ mealData: this.props.location.state.meal, existingMeal: true });
          let blob = await fetch(this.props.location.state.meal.strTemplateThumb).then(r => r.blob());
          this.pond.addFile(blob);
          document.getElementById("meal_name").value = this.props.location.state.meal.strTemplate;
          document.getElementById("meal_cat").value = this.props.location.state.meal.strCategory;
          document.getElementById("cost").value = this.props.location.state.meal.strCost;
          document.getElementById("calories").value = this.props.location.state.meal.calories;
          document.getElementById("locations").value = this.props.location.state.meal.location;
          document.getElementById("weight").value = this.props.location.state.meal.netWeight;
          document.getElementById("shelf_life").value = this.props.location.state.meal.shelfLife;
          window.clearInterval();
        }
        var locationsData = await this.processData();
        this.setState({ locationsData });
      }
    }
    else {
      if (!user) {
        alert('No logged in user!');
      }
      else {
        alert('Logged in user not associated with an organization!');
        localStorage.setItem('user', null);
      }
      window.clearInterval();
      history.push('login');
    }
  }

  componentDidMount() {
    this.updateData();
  }

  async processData() {
    var locationsData = JSON.parse(localStorage.getItem('locations'));
    var mealsForSaleData = JSON.parse(localStorage.getItem('mealsForSale'));
    var meals = JSON.parse(localStorage.getItem('meals'));
    var purchased = JSON.parse(localStorage.getItem('purchased'));

    var locations = {};
    var mealsForSale = {};

    for (var i in meals) {
      if (mealsForSaleData[meals[i].idMeal]) {
        mealsForSale[meals[i].idMeal] = meals[i];
      }
    }

    // First value is location data, second is how many meals in locker, third is purchased meals from locker, fourth is completed transactions
    for (i in locationsData) {
      locations[locationsData[i].type] = [locationsData[i], 0, 0];
    }

    for (i in mealsForSale) {
      locations[mealsForSale[i].location.toLowerCase()][1] += 1
    }

    for (i in this.props.purchased) {
      locations[purchased[i].location.toLowerCase()][2] += 1
    }

    return locations;
  }

  generateOptions(locations) {
    var select = document.querySelector('#locations');
    _.map(_.range(locations.length), function (i) {
      var option = document.createElement("option");
      option.text = locations[i].title;
      option.value = locations[i].type;
      select.add(option);
    });
  }

  activeClicked() {
    this.setState({ active: !this.state.active });
    var active = document.querySelector('#active');
    var activeUntil = document.querySelector('#activeUntil');
    active.checked = this.state.active;
    activeUntil.hidden = !this.state.active;
  }

  datePickerChange(date) {
    this.setState({
      startDate: date
    });
  }

  validateData() {
    var mealTitle = document.getElementById("meal_name").value.toString();
    var mealDesc = document.getElementById("meal_desc").value.toString();
    var calories = document.getElementById("calories").value.toString();
    var mealCat = document.getElementById("meal_cat").value.toString();
    var location = document.getElementById("locations").value.toString();
    var cost = document.getElementById("cost").value.toString();
    var weight = document.getElementById("weight").value.toString();
    var shelfLife = document.getElementById("shelf_life").value.toString();

    if (mealTitle === "") {
      alert("Meal Title must be filled out");
      document.getElementById("meal_name").style.borderColor = "red";
      return false;
    }
    document.getElementById("meal_name").style.borderColor = "green";
    document.getElementById("meal_desc").style.borderColor = "green";
    if (calories === "" || isNaN(calories) || calories < 10 || calories > 2000) {
      alert("Invalid entry for estimated calories! Please provide a number between 10 and 2000.");
      document.getElementById("calories").style.borderColor = "red";
      return false;
    }
    document.getElementById("calories").style.borderColor = "green";
    if (mealCat === "Choose...") {
      alert("Meal Category must be filled out");
      document.getElementById("meal_cat").style.borderColor = "red";
      return false;
    }
    document.getElementById("meal_cat").style.borderColor = "green";
    if (location === "Choose...") {
      alert("Location must be filled out");
      document.getElementById("locations").style.borderColor = "red";
      return false;
    }
    document.getElementById("locations").style.borderColor = "green";
    if (cost === "" || isNaN(cost) || cost < 0 || cost > 100) {
      alert("Invalid entry for cost! Please provide a number between 0 and 100.");
      document.getElementById("cost").style.borderColor = "red";
      return false;
    }
    document.getElementById("cost").style.borderColor = "green";
    if (weight === "" || isNaN(weight) || weight < 0 || weight > 100) {
      alert("Invalid entry for weight! Please provide a number between 0 and 100.");
      document.getElementById("weight").style.borderColor = "red";
      return false;
    }
    document.getElementById("weight").style.borderColor = "green";
    if (shelfLife === "" || isNaN(shelfLife) || shelfLife < 0.25 || shelfLife > 14) {
      alert("Invalid entry for the shelf life! Please provide a number between 0.25 and 14.");
      document.getElementById("shelf_life").style.borderColor = "red";
      return false;
    }
    document.getElementById("shelf_life").style.borderColor = "green";
    let mealData = {
      calories,
      distributor: this.props.userData.org,
      location,
      shelfLife,
      strCategory: mealCat,
      strCost: cost,
      strMeal: mealTitle,
      strDesc: mealDesc,
      netWeight: weight,
  }
    let merged = { ...this.state.mealData, ...mealData }
    this.setState({
      mealData: merged,
     })
    return true;
  }

  async addNewMeal() {
    var add = await this.validateData();
    //check to see if this is a unique template
    if (!this.state.askedTemplateSave && add) {
      var unique = true;
      var item = null;
      for (var meal in this.state.inventory) {
        item = this.state.inventory[meal];
        if (item.strCost === this.state.mealData.strCost && item.strTemplate === this.state.mealData.strTemplate && item.strCategory === this.state.mealData.strCategory && item.location === this.state.mealData.location && item.shelfLife === this.state.mealData.shelfLife) {
          unique = false;
          break;
        }
      }
      if (unique) {
        this.openModal();
        return;
      }
    }
    if (add) {
      var mealData = await this.state.mealData;

      //check to see if there is space in the locker and choose a locker to place the meal into
      var locker = null;
      if (this.state.locationsData[this.state.mealData.location][1] >= this.state.locationsData[this.state.mealData.location][0].capacity) {
        alert("No space available in the specified locker!");
        return;
      }
      else {
        for (var lock in this.state.locationsData[this.state.mealData.location][0].lockers) {
          if (!this.state.locationsData[this.state.mealData.location][0].lockers[lock]) {
            locker = lock;
            break;
          }
        }
        if (locker === null) {
          alert("No space available in the specified locker!");
          return;
        }
      }
      mealData["locker"] = locker;

      var date = Date.now();
      var d = dateformat(date, 'dddd, mmmm d, yyyy, h:MM:ss TT');
      mealData["strDatePackaged"] = d.toString();
      mealData["datePackaged"] = date.toString();
      mealData["code"] = 'rgb(' + Math.floor(Math.random() * 255).toString() + ', ' + Math.floor(Math.random() * 255).toString() + ', ' + Math.floor(Math.random() * 255).toString() + ')';
      await fire.database().ref('/restaurants/' + mealData["distributor"] + '/mealCounter').once('value').then(function (snapshot) {
        mealData["idMeal"] = snapshot.val();
      });
      await fire.database().ref('/restaurants/' + mealData["distributor"] + '/').update({
        mealCounter: mealData.idMeal + 1
      });
      mealData["idMeal"] = "0" + this.props.userData.idOrg + "" + mealData["idMeal"];
      mealData["strIdMeal"] = "Meal ID #" + mealData["idMeal"];
      mealData["forSale"] = true;
      mealData["inLocker"] = false;
      if (this.state.files[0]) {
        const blob = new Blob([this.state.files[0]], { type: "image/jpeg" });
        if (this.state.imageUrl == null) {
          var picRef = fire.storage().ref('/meals/').child(mealData["idMeal"] + '.jpeg ');
          await picRef.put(blob).then(function (snapshot) { });
          await picRef.getDownloadURL().then(function (url) {
            this.setState({ imageUrl: url })
          }.bind(this));
          mealData["strMealThumb"] = this.state.imageUrl;
        }
      }
      else {
        mealData["strMealThumb"] = "http://fudlkr.com/mobile_assts/green.png";
      }

      // upload data to firebase
      await fire.database().ref('/meals/all/meals/' + this.state.mealData["idMeal"] + '/').push(mealData);
      await fire.database().ref('/meals/categories/' + mealData['strCategory'].toLowerCase() + '/meals/' + this.state.mealData["idMeal"] + '/').push(mealData);
      await fire.database().ref('/meals/locations/' + mealData['location'].toLowerCase() + '/meals/' + this.state.mealData["idMeal"] + '/').push(mealData);
      await fire.database().ref('/restaurants/' + mealData['distributor'].toLowerCase() + '/meals/history/' + this.state.mealData["location"].toLowerCase() + '/' + this.state.mealData["idMeal"] + '/').push(mealData);
      var individualLocker = {};
      individualLocker[mealData.locker] = true;
      await fire.database().ref('/restaurants/' + mealData['distributor'].toLowerCase() + '/lockers/data/' + this.state.locationsData[this.state.mealData.location][0].id + '/lockers/').update(individualLocker);
      var forSale = {};
      forSale[mealData.idMeal] = true;
      await fire.database().ref('/meals/forSale/').update(forSale);
      alert("Meal Added to Location Successfuly! " + mealData["strIdMeal"]);
      this.props.history.push('/dashboard');
    }
  }

  async addNewTemplate() {
    var add = await this.validateData();
    var mealData = this.state.mealData;
    if (add) {
      mealData["strTemplate"] = mealData["strMeal"];
      //Get the current userID
      mealData["code"] = 'rgb(' + Math.floor(Math.random() * 255).toString() + ', ' + Math.floor(Math.random() * 255).toString() + ', ' + Math.floor(Math.random() * 255).toString() + ')';
      await fire.database().ref('/restaurants/' + this.props.userData.org + '/templateCounter').once('value').then(function (snapshot) {
        mealData["idTemplate"] = snapshot.val();
      });
      await fire.database().ref('/restaurants/' + this.props.userData.org + '/').update({
        templateCounter: mealData.idTemplate + 1
      });
      // first 1 represents template rather than meal
      mealData["idTemplate"] = "1" + this.props.userData.idOrg + "" + mealData["idTemplate"]
      if (this.state.files[0]) {
        const blob = new Blob([this.state.files[0]], { type: "image/jpeg" });
        if (this.state.imageUrl === null) {
          var picRef = fire.storage().ref('/meals/').child(mealData["idTemplate"] + '.jpeg ');
          await picRef.put(blob).then(function (snapshot) { });
          await picRef.getDownloadURL().then(function (url) {
            this.setState({ imageUrl: url })
          }.bind(this));
          mealData["strMealThumb"] = this.state.imageUrl;
          mealData["strTemplateThumb"] = this.state.imageUrl;
        }
      }
      else {
        mealData["strMealThumb"] = "http://fudlkr.com/mobile_assts/green.png";
        mealData["strTemplateThumb"] = "http://fudlkr.com/mobile_assts/green.png";
      }
      await fire.database().ref('/restaurants/' + this.props.userData.org + '/templates/default/' + mealData.idTemplate + '/').update(mealData);
      alert("Template Added to Inventory Successfuly!");
      this.addNewMeal();
    }
  }

  async saveMeal() {
    var add = await this.validateData();
    if (add) {
      await fire.database().ref('/restaurants/' + this.props.userData.org + '/templates/default/' + this.state.mealData.idTemplate +'/').update(this.state.mealData);
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    if (this.state.locations) {
      return (
        <div className="masonry-item col-md-12">
          <div className="bgc-white p-20 bd">
            {!this.state.existingMeal ? (<h4 className="c-grey-900 mT-10 mB-30">Add a New Meal</h4>) :
              (<h4 className="c-grey-900 mT-10 mB-30">Edit Existing Meal / Add a New Meal</h4>)
            }
            <FilePond
              ref={ref => this.pond = ref}
              allowMultiple={true}
              allowFileTypeValidation={true}
              acceptedFileTypes={['image/*']}
              fileValidateTypeDetectType={(source, type) => new Promise((resolve, reject) => {
                resolve(type);
              })}
              onupdatefiles={fileItems => {
                this.setState({
                  files: fileItems.map(fileItem => fileItem.file)
                });
              }}
              labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
            />
            <div className="mT-30">
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label htmlFor="meal_name">Meal Name</label>
                  <input type="text" className="form-control" id="meal_name" placeholder="Chicken Bacon Ranch Pizza" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label htmlFor="meal_desc">Meal Description</label>
                  <input type="text" className="form-control" id="meal_desc" placeholder="Asiago Chicken, Farm Raised Bacon, Hidden Valley Ranch, etc." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="cost">Estimated Calories</label>
                  <input type="number" min="10" step="any" className="form-control" id="calories" placeholder="350" />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="meal_cat">Meal Category</label>
                  <select id="meal_cat" className="form-control">
                    <option>Choose...</option>
                    <option>American</option>
                    <option>Appetizers</option>
                    <option>Asian</option>
                    <option>Italian</option>
                    <option>Mexican</option>
                    <option>Meat</option>
                    <option>Salads</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="locations">Location</label>
                  <select id="locations" className="form-control">
                    <option>Choose...</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="cost">Cost</label>
                  <input type="number" min="1" step="any" className="form-control" id="cost" placeholder="$3.50" />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="cost">Default Net Weight (oz)</label>
                  <input type="number" max="100" step="any" className="form-control" id="weight" placeholder="4.21" />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="shelf_life">Shelf Life (days)</label>
                  <input type="number" min="0.25" max="14" step="any" className="form-control" id="shelf_life" placeholder="2.5" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                    <input type="checkbox" id="active" className="peer" onClick={() => { this.activeClicked() }} />
                    <label htmlFor="active" className="peers peer-greed js-sb ai-c">
                      <span className="peer peer-greed">Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div id="activeUntil" hidden>
                <div className="col-md-3">
                  <label className="fw-500">Active Until</label>
                  <div className="timepicker-input input-icon form-group">
                    <DatePicker
                      name="activeUntilDate"
                      selected={this.state.startDate}
                      onChange={this.datePickerChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row center full">
                { !this.state.existingMeal ? ( <button onClick={() => { this.addNewMeal() }} className="col-md-12 form-row center btn btn-primary">Add Meal to Locker</button> ) :
                  (<div className="full buttons-container">
                    <button onClick={() => { this.saveMeal() }} className="form-row center btn btn-primary green buttons">Save Existing Meal</button>
                    <button onClick={() => { this.addNewMeal() }} className="form-row center btn btn-primary buttons">Add Meal to Locker</button>
                  </div>)
                }
              </div>
            </div>
          </div>
          <Modal
            isOpen={this.state.modalVisible}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Save as Template"
            ariaHideApp={false}
          >

            <h2 className="center">Save as Template</h2>
            <div className="center form-row">We've noticed that the template you are trying to add to the locker is unique to your inventory.  Would you like to save this meal as a template?</div>
            <div className="full buttons-container button-container">
              <button onClick={() => { this.closeModal(); this.addNewMeal()}} className="form-row center btn btn-primary red buttons" >Cancel</button>
              <button onClick={() => { this.closeModal(); this.addNewTemplate() }} className="form-row center btn btn-primary green buttons">Save Template</button>
            </div>
          </Modal>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  const { authentication, data } = state;
  const { user, userData } = authentication;
  const { restaurantData } = data;
  return {
    user,
    userData,
    restaurantData
  };
}

const AddMeal = connect(mapStateToProps)(AddMealPage);
export default AddMeal;

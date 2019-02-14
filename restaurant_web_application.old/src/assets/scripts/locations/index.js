const React = require('react');
const ReactDOM = require('react-dom');
import RGL, { WidthProvider } from "react-grid-layout";
const ReactGridLayout = WidthProvider(RGL);
import firebase from '../firebase';
const e = React.createElement;

export default class Locations extends React.Component {
  constructor(props) {
    super(props);
    const layout = this.generateLayout();
    this.populate_uid();
    this.state = {
      layout,
      locations: null,
      org: null,
      mealsForSale: null,
      uid: null,
    };
  }

  async populate_user_info() {
    console.log(this.state.uid);
    if (!this.state.uid) {
      this.setState({ uid: this.props.user.state.uid });
      console.log(this.props.user.state.uid);
    }
    await firebase.database().ref('/users/' + this.state.uid).once('value').then(function (snapshot) {
      this.setState({ org: snapshot.val().org });
    }.bind(this));
  }

  async populate_location_data() {
    console.log(this.props.user.state);
    await firebase.database().ref('/restaurants/' + this.state.org + '/lockers/data').once('value').then(function (snapshot) {
      let tempArray = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray.push(childData);
      });
      this.setState({ locations: tempArray });
    }.bind(this));
    await firebase.database().ref('/meals/forSale').once('value').then(function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childSnapshot.key] = childData;
      });
      this.setState({ mealsForSale: tempArray });
    }.bind(this));
    var temp = this.state.mealsForSale;
    let tempObject = {};
    for (var i = 0; i < this.state.locations.length; i++) {
      console.log(this.state.locations[i].type);
      await firebase.database().ref('/meals/locations/' + this.state.locations[i].type + '/meals').once('value').then(function (snapshot) {
        let tempArray = [];
        snapshot.forEach(function (childSnapshot) {
          childSnapshot.forEach(function (childChildSnapshot) {
            var childData = childChildSnapshot.val();
            if (temp[childData.idMeal.toString()]) {
              tempArray.push(childData);
              console.log(childData);
            }
          });
        });
        console.log(tempArray);
        tempObject[this.state.locations[i]] = tempArray;
      }.bind(this));
    }
    this.setState({ meals: tempObject });
    console.log(this.state.mealsForSale);
    console.log(this.state.locations);
  }

  async componentDidMount() {
    console.log(this.state.uid);
    await this.populate_user_info();
    await this.populate_location_data();
  }

  async populate_uid() {
    var userId = await firebase.auth().currentUser;
    console.log(userId);
    await firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.setState({ uid: user.uid });
      }
    }.bind(this), function (error) {
      console.log(error);
    });
  };


  generateDOM() {
    return _.map(_.range(this.props.items), function (i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function (item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    if (this.state.locations) {
      return (
        <ReactGridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          {...this.props}
        >
          {this.generateDOM()}
        </ReactGridLayout>
      );
    }
    return <div>Loading...</div>;
  }
}

Locations.defaultProps = {
  className: "layout",
  items: 20,
  rowHeight: 30,
  onLayoutChange: function () { },
  cols: 12
};



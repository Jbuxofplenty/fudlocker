import React, { Component } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
const ReactGridLayout = WidthProvider(RGL);
const _ = require('lodash');


export default class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: null,
      locationsData: null,
      org: null,
      mealsForSale: null,
      uid: null,
    };
  }

  async componentDidMount() {
    const layout = this.generateLayout();
    this.setState({ layout });
    var locationsData = this.processData();
    this.setState({ locationsData });
  }

  processData() {
    var locations = {};
    var mealsForSale = {};

    for (var i in this.props.meals) {
      if (this.props.mealsForSale[this.props.meals[i].idMeal]) {
        mealsForSale[this.props.meals[i].idMeal] = this.props.meals[i];
      }
    }

    // First value is location data, second is how many meals in locker, third is purchased meals from locker, fourth is completed transactions
    for (i in this.props.locationsData) {
      locations[this.props.locationsData[i].type] = [this.props.locationsData[i], 0, 0];
    }

    for (i in mealsForSale) {
      locations[mealsForSale[i].location.toLowerCase()][1] += 1
    }

    for (i in this.props.purchased) {
      locations[this.props.purchased[i].location.toLowerCase()][2] += 1
    }

    return locations;
  }

  generateDOM() {
    var temp = Object.values(this.state.locationsData);
    return _.map(_.range(temp.length), function (i) {
      return (
        <div key={i.toString()}>
          <Card style={{maxWidth: 345}}>
            <CardActionArea>
              <CardMedia
                component="img"
                alt=""
                style={{ objectFit: 'cover', aspectRatio: 1 }}
                height="300"
                image={temp[i][0].image}
                title={temp[i][0].title}
              />
              <CardContent>
                <div className="center">
                  <Typography component="p" variant="caption">
                    {temp[i][0].title}
                  </Typography>
                </div>
                <div className="center">
                  <Typography component="p" variant="caption">
                    Current Meals in Locker: {temp[i][1]}/{temp[i][0].capacity}
                  </Typography>
                </div>
                <div className="center">
                  <Typography component="p" variant="caption">
                    Meals Sold Today: {temp[i][2]}
                  </Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      );
    });
  }

  generateLayout() {
    var temp = Object.values(this.props.locationsData);
    return _.map(new Array(temp.length), function (item, i) {
      const y = 11;
      return {
        x: (i * 6) % 12,
        y: Math.floor(i / 11) * y,
        w: 6,
        h: y,
        i: i.toString(),
        static: true
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    if (this.state.locationsData && this.state.layout) {
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



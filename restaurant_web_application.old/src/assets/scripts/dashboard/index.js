const React = require('react');
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);
const layouts = {
  lg: [
    { i: 'a', h: 3, w: 6, x: 0, y: 0 },
    { i: 'b', h: 3, w: 6, x: 6, y: 0 },
    { i: 'c', h: 4, w: 12, x: 0, y: 3 },
  ],
  sm: [
    { i: 'a', h: 3, w: 3, x: 0, y: 0 },
    { i: 'b', h: 3, w: 3, x: 3, y: 0 },
    { i: 'c', h: 4, w: 6, x: 0, y: 3 }
  ],
  md: [
    { i: 'a', h: 3, w: 5, x: 0, y: 0 },
    { i: 'b', h: 3, w: 5, x: 5, y: 0 },
    { i: 'c', h: 4, w: 10, x: 0, y: 3 }
  ],
  xs: [
    { i: 'a', h: 3, w: 3, x: 0, y: 0 },
    { i: 'b', h: 3, w: 3, x: 3, y: 0 },
    { i: 'c', h: 4, w: 6, x: 0, y: 3 }
  ],
  xxs: [
    { i: 'a', h: 3, w: 1, x: 0, y: 0 },
    { i: 'b', h: 3, w: 1, x: 1, y: 0 },
    { i: 'c', h: 4, w: 6, x: 0, y: 3 }
  ]
};

export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <ResponsiveGridLayout className="layout" layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
          <div key='a' className="bd bgc-white p-20">
              <h6 className="lh-1">Locations</h6>
              <div id="locations_container"></div>
          </div>
          <div key='b'>
            <div className="bd bgc-white p-20">
                  <h6 className="lh-1">Active Order List</h6>
              <div id="claimed_container"></div>
            </div>
          </div>
          <div key='c'>
            <div className="bd bgc-white p-20">
                <h6 className="lh-1">Daily Sales Report</h6>
                <div className="bgc-light-blue-500 c-white p-20">
                  <div className="peers ai-c jc-sb gap-40">
                    <div className="peer peer-greed">
                      <h5>September 7<sup>th</sup>, 2018</h5>
                      <p className="mB-0">Sales Report</p>
                    </div>
                    <div className="peer">
                      <h3 className="text-right">$512</h3>
                    </div>
                  </div>
                </div>
                <div className="table-responsive p-20">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className=" bdwT-0">Name</th>
                        <th className=" bdwT-0">Feedback</th>
                        <th className=" bdwT-0">Time</th>
                        <th className=" bdwT-0">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-600">Chicken Bacon Ranch Pizza</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">5 stars</span> </td>
                        <td>3:25pm</td>
                        <td><span className="text-info">$3.50</span></td>
                      </tr>
                      <tr>
                        <td className="fw-600">Chicken Panini</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">5 stars</span> </td>
                        <td>3:28pm</td>
                        <td><span className="text-info">$4.50</span></td>
                      </tr>
                      <tr>
                        <td className="fw-600">Vegetarian Pizza</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">5 stars</span> </td>
                        <td>3:30pm</td>
                        <td><span className="text-info">$3.25</span></td>
                      </tr>
                      <tr>
                        <td className="fw-600">Bacon Grilled Cheese</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">4 stars</span> </td>
                        <td>3:38pm</td>
                        <td><span className="text-info">$4.00</span></td>
                      </tr>
                      <tr>
                        <td className="fw-600">Shrimp Alfredo</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">5 stars</span> </td>
                        <td>3:38pm</td>
                        <td><span className="text-info">$4.25</span></td>
                      </tr>
                      <tr>
                        <td className="fw-600">Italian Meatballs</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">5 stars</span> </td>
                        <td>3:39pm</td>
                        <td><span className="text-info">$3.25</span></td>
                      </tr>
                      <tr>
                        <td className="fw-600">Sirloin Steak</td>
                        <td><span className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">4 stars</span> </td>
                        <td>3:41pm</td>
                        <td><span className="text-info">$5.00</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            <div className="ta-c bdT w-100 p-20">
              <a href="#">Check all the sales</a>
            </div>
          </div>
        </ResponsiveGridLayout>
        <footer className="foot text-center c-grey-600">
          <span className="footer-text">Copyright © 2017 Designed by <a href="http://fudlkr.com" target='_blank' title="Fudlkr">Fudlkr</a> and <a href="https://colorlib.com" target='_blank' title="Colorlib">Colorlib</a>. All rights reserved.</span>
        </footer>
      </div>
    );
  }
}


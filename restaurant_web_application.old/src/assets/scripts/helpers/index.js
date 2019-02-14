const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
import User from '../user';
import Locations from '../locations';
import ClaimedInventory from '../claimed';
import Search from '../search';
import VectorMaps from '../vectorMaps';
import InitSkyCons from '../skycons';
import Utilities from '../utils';
import SideBarInit from '../sidebar';
import ScrollBarInit from '../scrollbar';
import PopOverInit from '../popover';
import MasonryInit from '../masonry';
import GoogleMapsInit from '../googleMaps';
import renderCalendar from '../fullcalendar';
import EmailInit from '../email';
import DatePickerInit from '../datepicker';
import DataTableInit from '../datatable';
import ChatSideBarInit from '../chat';
import Dashboard from '../dashboard';
import { ChartJSInit, EasyPieChartInit, SparkLineInit } from '../charts';

export async function renderUser() {
  const user_container = document.querySelector('#user_container');
  var user = await ReactDOM.render(<User />, user_container);
  console.log(user);
  return user;
};

export async function loginUser() {
  const user_container = document.querySelector('#user_container');
  var user = await ReactDOM.render(<User loggedIn={false} />, user_container);
  var object = document.getElementById("login");
  object.onclick = async function () {
    var validated = await user.validate("login");
    if (validated) {
      window.location = "../../../index.html";
    }
  };
  return user;
}

export async function renderDashboard() {
  const dashboard_container = document.querySelector('#dashboard_container');
  var dashboard = await ReactDOM.render(<Dashboard />, dashboard_container);
  return dashboard;
}

export async function renderLocations(user) {
  const locations_container = document.querySelector('#locations_container');
  var locations = await ReactDOM.render(<Locations user={user}/>, locations_container);
  return locations;
};

export async function renderClaimed() {
  const claimed_container = document.querySelector('#claimed_container');
  var claimed = await ReactDOM.render(<ClaimedInventory />, claimed_container);
  return claimed;
};

export async function initPage() {
  Search();
  VectorMaps();
  InitSkyCons();
  Utilities();
  SideBarInit();
  ScrollBarInit();
  PopOverInit();
  MasonryInit();
  GoogleMapsInit();
  renderCalendar();
  EmailInit();
  DatePickerInit();
  DataTableInit();
  ChatSideBarInit();
  ChartJSInit();
  EasyPieChartInit();
  SparkLineInit();
};


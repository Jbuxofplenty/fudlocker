import * as $ from 'jquery';
import 'fullcalendar/dist/fullcalendar.min.js';
import 'fullcalendar/dist/fullcalendar.min.css';

export default function renderCalendar () {
  const date = new Date();
  const d    = date.getDate();
  const m    = date.getMonth();
  const y    = date.getFullYear();

  const events = [{
    title  : 'Green Bell Peppers (Order #: 344)',
    start  : new Date(y, m, d, 14, 0),
    desc: 'Dole Green Bell Peppers purchased on 9/1/2018.',
    bullet : 'success',
  }, {
    title  : 'Idaho Potatoes (Order #: 356)',
    start  : new Date(y, m, d +1, 16, 0),
    desc   : 'Boise Fry Idaho Potatoes purchased on 8/1/2018.',
    bullet : 'success',
  }, {
    title  : 'Organic Strawberries (Order #: 380)',
    start  : new Date(y, m, d + 4, 15, 0),
    desc   : 'Dole Organic Strawberries purchased on 8/1/2018.',
    bullet : 'success',
  }, {
      title: 'Ripe Red Tomatoes (Order #: 392)',
      start: new Date(y, m, d + 11, 17, 0),
      bullet: 'success',
  }, {
      title: 'Sirloin Beef (Order #: 375)',
      start: new Date(y, m, d + 9, 12, 0),
      bullet: 'success',
  }, {
      title: 'Free Range Chicken (Order #: 373)',
      start: new Date(y, m, d + 7, 16, 0),
      bullet: 'success',
  }, {
      title: 'Fresh Shrimp (Order #: 371)',
      start: new Date(y, m, d + 3, 11, 0),
      bullet: 'success',
  }, {
      title: 'Cheddar Cheese Blocks (Order #: 350)',
      start: new Date(y, m, d + 4, 13, 0),
      bullet: 'success',
  }];

  $('#full-calendar').fullCalendar({
    events,
    height   : 800,
    editable : true,
    header: {
      left   : 'month,agendaWeek,agendaDay',
      center : 'title',
      right  : 'today prev,next',
    },
  });
}

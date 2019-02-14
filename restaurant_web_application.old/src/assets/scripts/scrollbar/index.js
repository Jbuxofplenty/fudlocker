import * as $ from 'jquery';
import PerfectScrollbar from 'perfect-scrollbar';

export default function ScrollBarInit() {
  const scrollables = $('.scrollable');
  if (scrollables.length > 0) {
    scrollables.each((index, el) => {
      new PerfectScrollbar(el);
    });
  }
};

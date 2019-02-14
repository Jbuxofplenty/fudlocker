import * as $ from 'jquery';
import 'bootstrap';

export default function PopOverInit() {
  // ------------------------------------------------------
  // @Popover
  // ------------------------------------------------------

  $('[data-toggle="popover"]').popover();

  // ------------------------------------------------------
  // @Tooltips
  // ------------------------------------------------------

  $('[data-toggle="tooltip"]').tooltip();
};

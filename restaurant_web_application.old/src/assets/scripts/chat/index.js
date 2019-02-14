import * as $ from 'jquery';

export default function ChatSideBarInit() {
  $('#chat-sidebar-toggle').on('click', e => {
    $('#chat-sidebar').toggleClass('open');
    e.preventDefault();
  });
};

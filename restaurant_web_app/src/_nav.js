export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      title: true,
      name: 'Inventory',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Add New Meal',
      url: '/addmeal',
      icon: 'icon-plus',
    },
    {
      name: 'Manage Inventory',
      url: '/inventory',
      icon: 'icon-pencil',
    },
    {
      title: true,
      name: 'Miscellaneous',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Calendar',
      url: '/calendar',
      icon: 'icon-calendar'
    },
    {
      name: 'Statistics',
      url: '/stats',
      icon: 'icon-pie-chart'
    }
    
  ],
};

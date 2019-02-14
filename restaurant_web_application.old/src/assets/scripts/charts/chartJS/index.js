import Chart from 'chart.js';
import { COLORS } from '../../constants/colors';

export default function ChartJSInit() {
  // ------------------------------------------------------
  // @Line Charts
  // ------------------------------------------------------

  const lineChartBox = document.getElementById('line-chart');

  if (lineChartBox) {
    const lineCtx = lineChartBox.getContext('2d');
    lineChartBox.height = 80;

    new Chart(lineCtx, {
      type: 'line',
      data: {
          labels: ['9/1', '9/2', '9/3', '9/4', '9/5', '9/6', '9/7'],
        datasets: [{
          label                : 'Daily Sales ($)',
          backgroundColor      : 'rgba(237, 231, 246, 0.5)',
          borderColor          : COLORS['deep-purple-500'],
          pointBackgroundColor : COLORS['deep-purple-700'],
          borderWidth          : 2,
          data                 : [202, 312, 410, 350, 509, 341, 444],
        },]
      },

      //options: {
      //  legend: {
      //    display: false,
      //  },
      //},

    });
  }

  // ------------------------------------------------------
  // @Bar Charts
  // ------------------------------------------------------

  const barChartBox = document.getElementById('bar-chart');

  if (barChartBox) {
    const barCtx = barChartBox.getContext('2d');

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label           : 'Dataset 1',
          backgroundColor : COLORS['deep-purple-500'],
          borderColor     : COLORS['deep-purple-800'],
          borderWidth     : 1,
          data            : [10, 50, 20, 40, 60, 30, 70],
        }, {
          label           : 'Dataset 2',
          backgroundColor : COLORS['light-blue-500'],
          borderColor     : COLORS['light-blue-800'],
          borderWidth     : 1,
          data            : [10, 50, 20, 40, 60, 30, 70],
        }],
      },

      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
      },
    });
  }

  // ------------------------------------------------------
  // @Area Charts
  // ------------------------------------------------------

  const areaChartBox = document.getElementById('area-chart');

  if (areaChartBox) {
    const areaCtx = areaChartBox.getContext('2d');

    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
        datasets: [{
          backgroundColor : '#7FFFD4',
          borderColor     : '#00FFFF',
          data            : [7500, 8228, 9033, 9405, 10101, 10320, 11183, 12988, 13020],
          label           : 'Monthly Sales ($)',
          fill            : 'start',
        }],
      },
    });
  }

  // ------------------------------------------------------
  // @Scatter Charts
  // ------------------------------------------------------

  const scatterChartBox = document.getElementById('scatter-chart');

  if (scatterChartBox) {
    const scatterCtx = scatterChartBox.getContext('2d');

    new Chart.Line(scatterCtx, {
        data: {
            labels: ['9/1', '9/2', '9/3', '9/4', '9/5', '9/6', '9/7'],
            datasets: [{
                label: 'Daily Profit ($)',
                backgroundColor: '#00BFFF',
                borderColor: '#1E90FF',
                pointBackgroundColor: '#00BFFF',
                borderWidth: 2,
                data: [101, 106, 205, 270, 210, 300, 250],
            },]
        },

    });
  }
}

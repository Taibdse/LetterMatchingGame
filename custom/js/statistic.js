function getTimeData(){
  let arr = statistics.resultsList.map(result => result.timePassed);
  if(arr.length < 10) return arr;
  return arr.reverse().filter((item, index) => index < 10).reverse();
}

function getFlippingCountData(){
  let arr = statistics.resultsList.map(result => result.flippedCount);
  if(arr.length < 10) return arr;
  return arr.reverse().filter((item, index) => index < 10).reverse();
}

function renderChart($canvas){
  let timeData = getTimeData();
  let flippingCountData = getFlippingCountData();
  let labels = [];
  for(let i = 1; i <= timeData.length; i++) labels.push(i);
  let data = {
    labels: labels,
    datasets: [{
      label: 'Time (seconds)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      data: timeData,
      fill: false,
    }, {
      label: 'Flipping Count',
      fill: false,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      data: flippingCountData,
    }]
  }
  let options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        responsive: false
    }
  let ctx = $canvas[0].getContext('2d');
  let chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
  });
}

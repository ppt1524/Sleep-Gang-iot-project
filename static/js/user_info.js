var data_xyz = {{ date_info| tojson }};
console.log(data_xyz);

window.onscroll = function () { scrollFunction() };

function findTop(element) {
  var rec = element.getBoundingClientRect();
  return rec.top + window.scrollY;
}

var aa = findTop(document.getElementById("navbar"))

function scrollFunction() {
  if (document.body.scrollTop > aa || document.documentElement.scrollTop > aa) {
    document.getElementById("navbar").style.position = "fixed";
    document.getElementById("navbar").style.top = "0px"
  } else {
    document.getElementById("navbar").style.position = "relative";
  }
}

function makechart(id, label, data, chart_label) {
  Chart.defaults.global.responsive = false;

  // define the chart data

  chartData = {
    labels: label,
    datasets: [{
      label: chart_label,

      data: data,

    }]
  }

  // get chart canvas
  var ctx = document.getElementById(id).getContext("2d");

  // create the chart using the chart canvas
  var temp = new Chart(ctx, {
    type: 'line',
    data: chartData,
  });
}

function makeTemp(label, data_, chart_label) {
  Chart.defaults.global.responsive = false;
  const DATA_COUNT = data_.length;
  const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

  const data = {
    labels: label,
    datasets: [{
      label: chart_label,
      data: data_,
      // fill: false,
      borderColor: 'rgb(75, 192, 192)',
      // tension: 0.1
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Suggested Min and Max Settings'
        }
      },
      scales: {
        y: {
          // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
          suggestedMin: 0,

          // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
          suggestedMax: 100,
        }
      }
    }
  };

  new Chart(document.getElementById('temp').getContext("2d"),
    config);
}

function getdateData() {
  dateVal = String((String(document.getElementById('birthday').value)).split('-')
    .reverse().join(''))
  if (dateVal == '') {
    alert('Select date')
    return
  }
  if (dateVal in data_xyz) {
    // alert('yes')

    var date_label_1 = data_xyz[dateVal]['date']
    date_label_2 = new Array();
    for (let i = 0; i < date_label_1.length; i++) {
      date_label_2.push(data_xyz[dateVal]['date'][i][9] + data_xyz[dateVal]['date'][i][10] + ':' + data_xyz[dateVal]['date'][i][11] + data_xyz[dateVal]['date'][i][12] + ":" + data_xyz[dateVal]['date'][i][13] + data_xyz[dateVal]['date'][i][14]);
    }
    // var humidity_label = data_xyz[dateVal][1]
    var humidity_label = data_xyz[dateVal]['humid']
    var pir_label = data_xyz[dateVal]['pir']
    // var tem_label = data_xyz[dateVal][3]
    var tem_label = data_xyz[dateVal]['temp']
    var ldr_label = data_xyz[dateVal]['ldr']

    var temp_score=0, humidity_score=0,min_motion,motion=0,sleep_dur;
    last_date = date_label_2[date_label_2.length - 1].split(':')
    first_date = date_label_2[0].split(':')
    sleep_dur = parseFloat(last_date[0]) - parseFloat(first_date[0])
    
    for(let i=0;i<tem_label.length;i++)
    {
        if(parseInt(tem_label[i])>=23 && parseInt(tem_label[i])<=26)
        temp_score+=3;
        else if((parseInt(tem_label[i])>=26 && parseInt(tem_label[i])<29)||(parseInt(tem_label[i])>=20 && parseInt(tem_label[i])<23))
        temp_score+=2;
        else
        temp_score+=1;
    }
    for(let i=0;i<humidity_label.length;i++)
    {
        if(parseInt(humidity_label[i])>=70 && parseInt(humidity_label[i])<=80)
        humidity_score+=3;
        else if((parseInt(humidity_label[i])<=90 && parseInt(humidity_label[i])>80)||(parseInt(humidity_label[i])>=60 && parseInt(humidity_label[i])<70))
        humidity_score+=2;
        else
        humidity_score+=1;
    }
    min_motion=Math.min(...pir_label);
    for(let i=0;i<pir_label.length;i++)
    {
      motion+=(pir_label[i]-min_motion);
    }
    var bmi=(motion)/(sleep_dur*36)
    var bmiscore;

    if(bmi<=0.5)bmiscore=1;
    else if(bmi <= 1)bmiscore=3/4;
    else if(bmi<=1.5)bmiscore=2/4;
    else bmiscore=1/4;

    var ldr_score=0;
    for(let i=0;i<ldr_label.length;i++)
    ldr_score+=ldr_label[i];
    ldr_score/=4;

    temp_score/=3;
    temp_score/=tem_label.length;

    humidity_score/=3;
    humidity_score/=humidity_label.length;
    
    
    console.log(tem_label)
    makechart("humidity", date_label_2, humidity_label, "humidity")
    makechart("ldr", date_label_2, ldr_label, "ldr")
    
    makechart("pir", date_label_2, pir_label, "pir")

    makeTemp(date_label_2, tem_label, 'temp')
    
    
  }
  else alert("We don't have data for specified date")
}
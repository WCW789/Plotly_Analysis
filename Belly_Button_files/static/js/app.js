function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  const url = `/metadata/${sample}`
  d3.json(url).then(function (test) {

    let sample_metadata = d3.select("#sample-metadata").html("")
    console.log("Hi", test)
    console.log("wash", test.WFREQ)

    Object.entries(test).forEach(([key, value]) => {
      let cell = sample_metadata.append("tr")
      // console.log(key, value)
      cell.html(`<td>${key}:</td><td>${value}</td>`)
    })

    function buildGauge(wreq) {

      let level = "";
      console.log("here", level)
      console.log("see", wreq)

      if (wreq == 0) {
        level = 9
      } else if (wreq == 1) {
        level = 27
      } else if (wreq == 2) {
        level = 45
      } else if (wreq == 3) {
        level = 63
      } else if (wreq == 4) {
        level = 81
      } else if (wreq == 5) {
        level = 99
      } else if (wreq == 6) {
        level = 117
      } else if (wreq == 7) {
        level = 135
      } else if (wreq == 8) {
        level = 153
      } else if (wreq == 9) {
        level = 171
      }
      //every section is 18 degrees, start at 9 degrees to be in the middle

      console.log("level", level)
      let degrees = 180 - level,
        radius = .5;
      console.log("degrees", degrees)
      let radians = degrees * Math.PI / 180;
      let x = radius * Math.cos(radians);
      let y = radius * Math.sin(radians);
      console.log("x", x)
      console.log("y", y)

      let mainPath = 'M -.0 -0.02 L .0 0.02 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
      let path = mainPath.concat(pathX, space, pathY, pathEnd);
      console.log("path", path)

      let data_gauge = [{
        x: [0],
        y: [0],
        type: 'scatter',
        marker: {
          size: 28,
          color: 'black'
        },
        showlegend: false,
        name: `${sample}`,
        text: `${test.WFREQ}`,
        hoverinfo: 'text+name'
      },
      {
        values: [30 / 10, 30 / 10, 30 / 10, 30 / 10, 30 / 10, 30 / 10, 30 / 10, 30 / 10, 30 / 10, 30 / 10, 30],
        rotation: 90,
        text: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: ['Pink', 'MediumSlateBlue', 'Aquamarine', 'Sienna', 'SpringGreen', 'Black', 'yellow', 'DarkRed', 'HotPink', 'BurlyWood', 'White']
        },
        labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];

      let layout_gauge = {
        shapes: [{
          type: 'path',
          path: path,
          fillcolor: 'black',
          line: {
            color: 'black'
          }
        }],
        title: 'Belly Button Gauge Chart',
        height: 800,
        width: 800,
        xaxis: {
          zeroline: false, showticklabels: false,
          showgrid: false, range: [-1, 1]
        },
        yaxis: {
          zeroline: false, showticklabels: false,
          showgrid: false, range: [-1, 1]
        }
      };

      Plotly.plot("gauge", data_gauge, layout_gauge);

    }
    buildGauge(test.WFREQ)
  });
}


function buildCharts(sample) {

  const url_sample = `/samples/${sample}`
  d3.json(url_sample).then(function (w) {
    console.log("here", w)

    let sample_array = w.sample_values.slice(0, 10)
    let sample_array2 = sample_array.map(x => x + 10);

    let data_bubble = [{
      x: w.sample_values.slice(0, 10),
      y: w.otu_ids.slice(0, 10),
      hovertext: w.otu_labels.slice(0, 10),
      text: w.otu_ids.slice(0, 10),
      mode: 'markers',
      name: `Sample ${sample}`,
      marker: {
        size: sample_array2,
      }
    }];

    let layout1 = {
      title: 'Belly Button Bubble Chart',
      height: 600,
      width: 800
    };

    Plotly.plot("bubble", data_bubble, layout1);

    let data_pie = [{
      values: w.sample_values.slice(0, 10),
      labels: w.otu_ids.slice(0, 10),
      hovertext: w.otu_labels.slice(0, 10),
      text: w.otu_ids.slice(0, 10),
      type: "pie"
    }];

    let layout2 = {
      title: 'Belly Button Pie Chart',
      height: 600,
      width: 800
    };

    Plotly.plot("pie", data_pie, layout2);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  Plotly.deleteTraces("pie", 0); //added
  Plotly.deleteTraces("bubble", 0); //added
  Plotly.deleteTraces("gauge", [-2, -1]); //added
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();



// Build the chart
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id === sample);
    console.log(resultArray[0]);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    console.log(otu_ids);
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {
        t: 0
      },
      hovermode: "closest",
      xaxis: {
        title: "OTU ID"
      },
      margin: {
        t: 50
      }
    };
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
    // Draws Bubble
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        t: 50,
        l: 150
      }
    };
    // Draws Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data 
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // D3 will help to select the panel 
    var PANEL = d3.select("#sample-metadata");

    // html("") will clear metadata
    PANEL.html("");

    //Object entries to return array of the key value
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // intro the bonus part- gauge
    buildGauge(result.wfreq);
  });
}

function optionChanged(newSample) {
  //  new data 
  buildCharts(newSample);
  buildMetadata(newSample);
}


function init() {
  // to grab a reference to the dropdown 
  var selector = d3.select("#selDataset");

  // Use the list of sample names to show the different options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    console.log(sampleNames);

    // the first sample will help to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Initialize the dashboard
init();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("../samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
// 2. Use d3.json to load and retrieve the samples.json file 
d3.json("../samples.json").then((data) => {
console.log(data)
// 3. Create a variable that holds the samples array. 
var samplesArray = data.samples;

// 4. Create a variable that filters the samples for the 
//object with the desired sample number.
var filteredsamplesArray = samplesArray.filter(
  sampleObj => sampleObj.id == sample);


//  5. Create a variable that holds the first sample in the array.
var result = filteredsamplesArray [0];

// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
var otu_ids = result.otu_ids;
var otu_labels = result.otu_labels;
var sample_values = result.sample_values;

// 7. Create the yticks for the bar chart.
// Hint: Get the the top 10 otu_ids and map them in descending order  
//  so the otu_ids with the most bacteria are last. 

var x_values= sample_values.slice(0,10).reverse();
var y_values=otu_ids.slice(0,10).reverse().map(otu_id => ('otu id'+ otu_id));
var text = otu_labels.slice(0,10).reverse();

//var yticks = otu_ids.slice(0,10).map(
//  otu_id => 'OTU ID').reverse();
    

// 8. Create the trace for the bar chart. 
var barData = [{
  x: x_values,
  y: y_values,
  text: text,
  type: 'bar',
  orientation: 'h'
}];

// 9. Create the layout for the bar chart. 
var barLayout = {
  title: '<b> Top 10 Bacteria Cultures Found </b>',
  margin: {
    l: 100,
    r: 80,
    t: 80,
    b: 30
  }
};
// 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot('bar', barData, barLayout)

////Create bubble chart/////

// 1. Create the trace for the bubble chart.
var bubbleData = [{
  x: x_values,
  y: y_values,
  text: text,
  mode: 'markers',
  marker: {
    size: sample_values,
    color: otu_ids,
    colorscale: 'Rainbow'
  }

}];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: '<b> Bacteria Cultures per Sample </b>',
  showlegend: false,
  xaxis: {title: 'OTU ID'}
  
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot('bubble', bubbleData, bubbleLayout);


});

}

//// GAUGE CHART ///

function gaugeChart () {

// Create the trace for the gauge chart.
var metadata= data.metadata;
// console.log(metadata);

var filteredMetadata= metadata.filter(sampleObj=> sampleObj.id == sample);
// console.log(filteredMetadata);

var metadataResults=filteredMetadata[0];

var Wfreq= metadataResults.wfreq;
//console.log(Wfreq_value);

// 4. Create the trace for the gauge chart.
var gaugeData = [{
  type: "indicator",
  mode: "gauge+number",
  value: Wfreq,
  title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week", font: {size:20}},
  gauge: {
    axis: { 
    range: [0, 10], 
    tickwidth: 1, 
    tickcolor: "blue",
    nticks: 6
  },
  bar: { color: "black" },
  bgcolor: "white",
  borderwidth: 4,
  bordercolor: "gray",
  steps: [
    { range: [0, 2], color: "red"},
    { range: [2, 4], color: "orange" },
    { range: [4, 6], color: "yellow" },
    { range: [6, 8], color: "limegreen" },
    { range: [8, 10], color: "darkgreen" }]},
  }];
         
// 5. Create the layout for the gauge chart.
var gaugeLayout = {
  margin: {
  t:2,
  b:2, 
},
width:600,
height:400,
font: { color: "black", family: "Arial" }
};

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot('gauge', gaugeData, gaugeLayout)

}

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  var url = `/metadata/${sample}`;
  d3.json(url).then(function(data) {
  console.log(data);
    var metadata = d3.select("#sample-metadata");
    metadata.html("");
    Object.entries(data).forEach(([key, value]) => {
      metadata.append("p").text(`${key}: ${value}`);
    });
  });
};

function buildCharts(sample) {

  // @TODO: Build a Bubble Chart using the sample data

  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {    
    var x_ids = data.otu_ids; var y_vals = data.sample_values;
    var color_bub = data.otu_ids; var label_bub = data.otu_labels;
    var size_bub = data.sample_values;
    var data = [{
      x: x_ids, y: y_vals,
      text: label_bub,
      mode: 'markers',
      marker: {color: color_bub, size: size_bub}
      }];

    Plotly.newPlot('bubble', data);

    // @TODO: Build a Pie Chart

    d3.json(url).then(function(data) {
      var x_val = data.sample_values.slice(0,10);
      var x_label = data.otu_ids.slice(0,10);
      var hover = data.otu_labels.slice(0,10);
      var data = [{
        values : x_val, labels: x_label,
        hovertext: hover,
        type: 'pie'
      }];

    Plotly.newPlot('pie', data);

    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
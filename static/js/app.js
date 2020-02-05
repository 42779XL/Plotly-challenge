// Plot.ly Homework-Belly Button Biodiversity
// Step 1: Plotly

// Create function for building plots (bar and bubble), so that
// later on this function can be called for building new plots
function getPlot(id) {
// ### 1. Use the D3 library to read in `samples.json`.
    d3.json("../../samples.json").then((data)=> {
        // console.log(data)


        // ### 2. Create a horizontal bar chart with a dropdown menu to 
        // Display the top 10 OTUs found in that individual.
        // ![bar Chart](Images/hw01.png)

        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select('#selDataset');
        // Add ids to the dropdown menu
        data.names.forEach(function(name){
            dropdownMenu.append("option").text(name).property('value');
        });

        // Get the first sample id from samples of the data set
        var sample = data.samples.filter(s => s.id.toString() === id)[0];
        var testSamp = 99;
        console.log(sample);

        // Get top 10 `sample_values` for that individual 
        // as the x-axis value for the bar chart

        // (1). Sort the data by sample_values
        // var sortedSample_values = sample.sample_values.sort(d3.descending);

        // (2). Get the first 10 sample_values for plotting
        // var first_10_samples = sortedSample_values.slice(0, 10);
        var first_10_samples = sample['sample_values'].slice(0, 10);

        // (3). Make descending order as top 10 sample_values
        var top10_samples = first_10_samples.reverse();
        // console.log(`Sample Values: ${top10_samples}`)

        // (4) Get the otu ids for those top 10 samples
        // var sortedOTU_ids = sample.otu_ids.sort(d3.descending);
        // var top10_otuids = (sortedOTU_ids.slice(0, 10)).reverse();
        var first_10_otuids = (sample.otu_ids.slice(0, 10)).reverse();

        // Get the otu id's to the desired form for the plot
        // var OTU_ID = top10_otuids.map(id => "OTU " + id)
        var OTU_ID = first_10_otuids.map(id => "OTU " + id)
        // console.log(`OTU IDS: ${OTU_ID}`)

        // Get the top 10 labels for the plot
        var labels = sample.otu_labels.slice(0, 10);

        // Plotting the bar chart with famus plotly `trilogy' 3 components
        var barTrace = {
            x: top10_samples,
            y: OTU_ID,
            text: labels,
            marker: {
                color: 'blue'},
            type: "bar",
            orientation: "h"
        };
        
        var barData = [barTrace];
        
        var barLayout = {
            title: "Top 10 OTU",
        };
        
        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", barData, barLayout);

        
        // ### 3. Create a bubble chart that displays each sample.
        // ![Bubble Chart](Images/bubble_chart.png)
        var bubbleTrace = {
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: "markers",
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids
            },
            text: sample.otu_labels
        };

        var bubbleData = [bubbleTrace];

        var bubbleLayout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    });
};


// ### 4. Display the sample metadata, i.e., an individual's demographic information.

// Create a function to get demographic info, so that later on 
// this function will be called when changing the subject id
function getDemo(id) {
    // Read in json file to get data
    d3.json("../../samples.json").then((data)=> {
        // Get metadata for the demographic infomation
        var metaData = data.metadata;
        // console.log(metaData);    


        // ### 5. Display each key-value pair from the metadata JSON object 
        // ![hw](Images/hw03.png)
        
        // Get the first metadata info as the default output
        var result = metaData.filter(meta => meta.id.toString() === id)[0];

        // Select metadata panel to put demographic data
        var demoInfo = d3.select("#sample-metadata");
                
        // Empty the demographic info panel each time before getting new sample
        demoInfo.html("");

        // Grab the demographic data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
            demoInfo.append("h5").text(key[0] + ": " + key[1] + "\n"); 
        });
    });
};


// ### 6. Update all of the plots any time that a new sample is selected.
// ![hw](Images/hw02.png)

// Call a function when dropdown option changed
d3.select('#selDataset').on('change', optionChanged);
function optionChanged(id){
    getPlot(id);
    getDemo(id);
}
  
// create a function for initial analysis page setup
function init() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select('#selDataset');

    // Read in json data object
    d3.json("../../samples.json").then((data)=> {
        // console.log(data)

        // Add ids to the dropdown menu
        data.names.forEach(function(name){
            dropdownMenu.append("option").text(name).property('value');
        });

        // Call the functions to display the plots and demo info
        getPlot(data.names[0]);
        getDemo(data.names[0]);
    }); 
};

init();

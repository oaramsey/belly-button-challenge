//Declare variables
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Fetch json data
d3.json(URL).then((data) => {
    console.log(data)
    let dropdownMenu = d3.select("#selDataset");
    let exampleNames = data.names;

    exampleNames.forEach((sample) => {
        dropdownMenu.append("option").property("value", sample).text(sample);
    });

    let firstSample = exampleNames[0];

    buildMetadata(firstSample);
    buildCharts(firstSample);
    
});



function optionChanged(newSample) {
    //Get new data
    buildMetadata(newSample);
    buildCharts(newSample);
}

//Show demographics
function buildMetadata(subjectID) {
    d3.json(URL).then((data) => {
        console.log(subjectID)
        let box = d3.select("#sample-metadata");
        let metadata = data.metadata;

        let resultArray = metadata.filter(sampleObj => sampleObj.id == subjectID);
        console.log("resultArray")
        console.log(resultArray)
        let result = resultArray[0];

        box.html("");

        Object.entries(result).forEach(([key, value]) => {
            box.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    })
};

//Building Charts
function buildCharts(sample) {
    console.log(sample);
    d3.json(URL).then((data) => {
        let samples = data.samples;

        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        console.log("resultArray")
        console.log(resultArray)
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        console.log(otu_ids)
        let barData = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);
        let bubbleData = [
            {
                y: result.otu_ids,
                x: result.sample_values,
                text: result.otu_ids,
                mode: "markers",
                marker: {
                    color: result.sample_values,
                    colorscale: "Portland",
                    size: result.sample_values,
                    sizemode: "area"
                },
            }];
        let bubbleLayout = {
                title: "Bacteria Cultures Per Sample",
                xaxis: {title: "OTU ID"}
            };

            Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        
    })
    
};



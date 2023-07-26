// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 60, left: 80},
  width = 800 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// append the svgBarChart object to the body of the page
const svgBarChart = d3.select("#barChart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
const xAxis = svgBarChart.append("g")
  .attr("transform", `translate(0,${height})`)
  .style("color", "white"); // Set the color of the axis to white;

// Initialize the Y axis
const y = d3.scaleLinear()
  .range([ height, 0])
const yAxis = svgBarChart.append("g")
  .attr("class", "myYaxis")
  .style("color", "white"); // Set the color of the axis to white;


//Bar chart annotations
const barChartText = svgBarChart.append("text")
.attr("class", "tooltip-text")
.style("font-size", 30)
.style("fill", "white")
.style("opacity", 0)
.style("font-family", "Montserrat")
.attr("x", "180")
.attr("y", "150");

// Function that hides the tooltip when the mouseleave event occurs
function mouseleave(event) {
  barChartText.style("opacity", 0);
}


// A function that create / update the plot for a given variable:
function rating(count, file) {
    // Parse the Data
  d3.csv(file).then(function(data) {
  
    // X axis
    x.domain(data.map(d => d.group));
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

    // Add X axis title
    svgBarChart.select(".x-axis-title").remove(); // Remove the existing title if any
    svgBarChart.append("text")
      .attr("class", "x-axis-title")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 15) // Position it below the X axis
      .style("text-anchor", "middle")
      .style("font-size", 24) // Set font size to match the X axis
      .style("fill", svgBarChart.select(".myYaxis").style("color")) // Set font color to match the X axis
      .style("font-family", "Montserrat")
      .text("Rating"); 


    // Add Y axis
    y.domain([0, d3.max(data, d => +d.count)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    svgBarChart.select(".y-axis-title").remove(); // Remove the existing title if any
    svgBarChart.append("text")
      .attr("class", "y-axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2)
      .attr("y", -margin.left + 30) // Position it to the left of the Y axis
      .style("text-anchor", "middle")
      .style("font-size", 24) // Set font size to match the Y axis
      .style("fill", svgBarChart.select(".myYaxis").style("color")) // Set font color to match the Y axis
      .style("font-family", "Montserrat")
      .text("Frequency"); 

    function mousemove(event, d) {
      const [x, y] = d3.pointer(event, this);
      
    
      barChartText.html("Rating: " + d.group + " Frequency: " + d.count)
        // .html("Value: " + d.count) // Display the value from the data bound to the rect element
        .style("opacity", 1);
    
      const [mouseX, mouseY] = d3.pointer(event);
    
      // Log the coordinates to the console
      console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);
    
    }

    // variable u: map data to existing bars
    const rects = svgBarChart.selectAll("rect")
    .data(data)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

    // Update bars
    rects.join("rect")
      .transition()
      .duration(1000)
      .attr("x", d => x(d.group))
      .attr("y", d => y(d[count]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d[count]))
      .attr("fill", "#d41515")
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", 2)

  })
}

// A function that create / update the plot for a given variable:
function seasons(count, file) {
  // Parse the Data
  d3.csv(file).then(function(data) {

    // X axis
    x.domain(data.map(d => d.seasons))
    .range([0, width])
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

    // Add X axis title
    svgBarChart.select(".x-axis-title").remove(); // Remove the existing title if any
    svgBarChart.append("text")
    .attr("class", "x-axis-title")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 15) // Position it below the X axis
    .style("text-anchor", "middle")
    .style("font-size", 24) // Set font size to match the X axis
    .style("fill", svgBarChart.select(".myYaxis").style("color")) // Set font color to match the X axis
    .style("font-family", "Montserrat")
    .text("Season(s)"); 


    // Add Y axis
    y.domain([0, d3.max(data, d => +d.count)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    svgBarChart.select(".y-axis-title").remove(); // Remove the existing title if any
    svgBarChart.append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", -margin.left + 30) // Position it to the left of the Y axis
    .style("text-anchor", "middle")
    .style("font-size", 24) // Set font size to match the Y axis
    .style("fill", svgBarChart.select(".myYaxis").style("color")) // Set font color to match the Y axis
    .style("font-family", "Montserrat")
    .text("Frequency"); 

    function mousemove(event, d) {
      const [x, y] = d3.pointer(event, this);
    
      barChartText.html("Season(s): " + d.seasons + " Frequency: " + d.count)
        .style("opacity", 1);
    
      const [mouseX, mouseY] = d3.pointer(event);
    
      // Log the coordinates to the console
      console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);
    
    }

    // variable u: map data to existing bars
    const rects = svgBarChart.selectAll("rect")
    .data(data)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

    // Update bars
    rects.join("rect")
    .transition()
    .duration(1000)
    .attr("x", d => x(d.seasons))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.count))
    .attr("fill", "#d41515")
    .attr("stroke", "black") // Set the border color to black
    .attr("stroke-width", 2)
  })
}
  
// // Call the update function with ascending order by default
// rating('count', '../data/rating_frequency_descending.csv')

const marg = {top: 50, right: 10, bottom: 50, left: 230},
  wid = 780 - marg.left - marg.right,
  hei = 780 - marg.top - marg.bottom;

const svgLineChart = d3.select("#lineChart-container")
  .append("svg")
  .attr("width", wid + marg.left + marg.right)
  .attr("height", hei + marg.top + marg.bottom)
  .append("g")
  .attr("transform", `translate(${marg.left},${marg.top - 5})`);

const lineTooltip = svgLineChart.append("line")
  .attr("class", "line-tooltip")
  .style("stroke", "white")
  .style("stroke-width", "1.5px")
  .style("opacity", 0);

const tooltipBox = svgLineChart.append("rect")
  .attr("class", "tooltip-box")
  .attr("width", 165)
  .attr("height", 45)
  .attr("fill", "white")
  .style("opacity", 0)
  .style("border", "2px solid black");

// Append text to show the tooltip value
const tooltipText = svgLineChart.append("text")
  .attr("class", "tooltip-text")
  .style("font-size", 12)
  .style("fill", "black")
  .style("opacity", 0)
  .style("font-family", "Montserrat");

const promises = [
    d3.csv("../data/closing_stock.csv", function(d) {
      return {
        date: d3.timeParse("%Y-%m-%d")(d.date),
        value: +d.value
      };
    }),
    d3.csv("../data/tvMA_cumulative_perYear.csv", function(d) {
      return {
        date: d3.timeParse("%Y")(d.release_year),
        value: +d.cumulative_sum
      };
    })
];

//Read the data
Promise.all(promises).then(function(data) {
    const closingStockData = data[0];
    const tvMACumulativeData = data[1];

    const xScale = d3.scaleTime()
      .domain(d3.extent(closingStockData, function(d) { return d.date; }))
      .range([ 0, wid ]);

    svgLineChart.append("g")
      .attr("transform", `translate(0, ${hei})`)
      .call(d3.axisBottom(xScale))
      .style("color", "white")
      .style("font-family", "Montserrat");
      
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(closingStockData, function(d) { return +d.value; })])
      .range([ hei, 0 ]);

    svgLineChart.append("g")
      .call(d3.axisLeft(yScale))
      .style("color", "white")
      .style("font-family", "Montserrat");

    svgLineChart.append("text")
      .attr("class", "axis-title")
      .attr("x", wid / 2)
      .attr("y", hei + marg.bottom + 5)
      .style("text-anchor", "middle")
      .style("font-size", 24) 
      .style("font-family", "Montserrat")
      .text("Year");

    // Add Y axis title
    svgLineChart.append("text")
      .attr("class", "axis-title")
      .attr("x", wid / 2 - 600)
      .attr("y", -marg.left + 125)
      .style("text-anchor", "middle")
      .style("font-size", 24) 
      .style("font-family", "Montserrat")
      .attr("transform", "rotate(-90)") 
      .text("Closing Price");

    function mousemove(event) {
      const [x, y] = d3.pointer(event, this);
      const closingStockData = d3.select(this).datum();

      const tooltipValue = yScale.invert(y).toFixed(2);
      const stockYear = xScale.invert(x).getFullYear();

      const matchingData = tvMACumulativeData.find(data => data.date.getFullYear() === stockYear).value;

      tooltipBox.attr("x", x - 230)
        .attr("y", y - 45)
        .style("opacity", 1)

      tooltipText.attr("x", x - 220)
        .attr("y", y - 25)
        .html("Closing Price: $" + tooltipValue + "<tspan x='" + (x - 228) + "' dy='1.2em'># of TV-MA programs: " + matchingData)
        .style("opacity", 1);

      lineTooltip.attr("x1", x + 1)
        .attr("y1", y + 1)
        .attr("x2", x - 160)
        .attr("y2", y - 20)
        .style("opacity", 1)
    }
    
    // Function that hides the tooltip when the mouseleave event occurs
    function mouseleave(event) {
      lineTooltip.style("opacity", 0);
      tooltipBox.style("opacity", 0);
      tooltipText.style("opacity", 0);
    }

    const line = d3.line()
      .x(function(d) { return xScale(d.date); })
      .y(function(d) { return yScale(d.value); });
    
    // Add the line
    svgLineChart.append("path")
      .datum(closingStockData)
      .attr("fill", "none")
      .attr("stroke", "#d41515")
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
})
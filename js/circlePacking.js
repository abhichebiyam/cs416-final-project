function renderChart(data) {
    // Specify the chart’s dimensions.
    const width = 950;
    const height = 950;

    // Create the color scale.
    const color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(0, 82%, 46%)", "hsl(0, 82%, 46%)"])
        .interpolate(d3.interpolateHcl);

    // Compute the layout.
    const pack = data => d3.pack()
        .size([width, height])
        .padding(3)
    (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));
    const root = pack(data);

    // Create the SVG container.
    const svg = d3.create("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .style("max-width", "100%")
    .style("height", "auto")
    .style("display", "block")
    .style("background", "black")
    .style("opacity", 0.6)
    .style("cursor", "pointer");

    const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("stroke", "black") // Add this line to set the border color
        .attr("stroke-width", 2) // Add this line to set the border width
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", "black"); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

    const label = svg.append("g")
    .style("font-weight", "1000")
    .style("font-size", "20px")
    .style("font-family", "Montserrat")
    .style("text-anchor", "end")
    .selectAll("text")
    .data(root.descendants())
    .join(
        enter => enter.append("text")
            .style("fill-opacity", 1)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(d => d.data.name),
        update => update.style("fill-opacity", 1),
        exit => exit.remove()
    
    );

    const rectPack = svg.append("g")

    // Create the zoom behavior and zoom immediately in to the initial focus node.
    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;
    zoomTo([focus.x, focus.y, focus.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });

        label.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    return svg.node();
}

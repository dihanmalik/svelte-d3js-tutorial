(function() {
  const svg = d3
    .select("svg")
    .attr("width", 700)
    .attr("height", 400);

  const dimension = {
    width: +svg.attr("width"),
    height: +svg.attr("height")
  };
  const circleRadius = 6;
  const xKey = "timestamp",
    yKey = "temperature";
  const xValue = d => d[xKey],
    yValue = d => d[yKey];
  const padding = {
    top: 50,
    bottom: 50,
    left: 110,
    right: 40
  };
  const chartArea = {
    width: dimension.width - padding.left - padding.right,
    height: dimension.height - padding.top - padding.bottom
  };

  const render = data => {
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, chartArea.width])
      .clamp(true);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([chartArea.height, 0])
      .nice();

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(-chartArea.height)
      .tickPadding(10)
      .ticks(9);

    const lineGenerator = d3
      // .line()//line
      .area()
      .x(d => xScale(d[xKey]))
      .y0(chartArea.height)
      .y1(d => yScale(d[yKey]))
      .curve(d3.curveBasis);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-chartArea.width)
      .tickPadding(10);

    const xAxisIndicator = svg
      .append("g")
      .attr(
        "transform",
        `translate(${padding.left}, ${chartArea.height + padding.top})`
      )
      .call(xAxis);

    xAxisIndicator.selectAll("text").attr("font-size", "1.5em");

    const yAxisIndicator = svg
      .append("g")
      .attr("transform", `translate(${padding.left}, ${padding.top})`)
      .call(yAxis);

    yAxisIndicator.selectAll("text").attr("font-size", "1.5em");

    svg.selectAll(".tick line, .domain").attr("stroke", "grey");
    const barG = svg
      .append("g")
      .attr("transform", `translate(${padding.left}, ${padding.top})`);

    const bars = barG
      .selectAll("g")
      .data(data)
      .enter()
      .append("g");

    // bars
    //   .append("circle")
    //   .attr("r", circleRadius)
    //   .attr("cy", d =>  yScale(d[yKey]) + circleRadius)
    //   .attr("cx", d => xScale(d[xKey]))
    //   .attr("class", "circle");

    bars
      .append("path")
      .attr("class", "line-path")
      .attr("d", lineGenerator(data));
    // .transition()
    // .duration(500)
    // .delay((d, i) => i * 100)
    // .attr("r", circleRadius);
  };

  d3.csv("../data/temperature.csv").then(data => {
    data.forEach(d => {
      d.temperature = +d.temperature;
      d.timestamp = new Date(d.timestamp);
    });
    render(data);
  });
})();

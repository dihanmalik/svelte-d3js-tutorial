(function() {
  const sales = [
    {
      year: 2000,
      qty: 1000
    },
    {
      year: 2001,
      qty: 2330
    },
    {
      year: 2002,
      qty: 4523
    },
    {
      year: 2003,
      qty: 5552
    },
    {
      year: 2004,
      qty: 1243
    },
    {
      year: 2005,
      qty: 4322
    },
    {
      year: 2006,
      qty: 7092
    },
    {
      year: 2007,
      qty: 4034
    },
    {
      year: 2008,
      qty: 3035
    },
    {
      year: 2009,
      qty: 2043
    },
    {
      year: 2010,
      qty: 1050
    }
  ];

  const svg = d3
    .select("svg")
    .attr("width", 700)
    .attr("height", 400);
  const colors = d3.schemeCategory10;
  const padding = {
    left: 50,
    right: 30,
    top: 20,
    bottom: 30
  };
  const chartArea = {
    width: parseInt(svg.attr("width")) - padding.left - padding.right,
    height: parseInt(svg.attr("height")) - padding.top - padding.bottom
  };

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(sales, d => d.qty)])
    .range([chartArea.height, 0])
    .nice();

  const xScale = d3
    .scaleBand()
    .domain(sales.map(d => d.year))
    .range([0, chartArea.width])
    .padding(0.2);

  const xAxis = svg
    .append("g")
    .classed("xAxis", true)
    .attr(
      "transform",
      `translate(${padding.left}, ${chartArea.height + padding.top})`
    )
    .call(d3.axisBottom(xScale));

  const yAxisFn = d3.axisLeft(yScale);

  const yAxis = svg
    .append("g")
    .classed("yAxis", true)
    .attr("transform", `translate(${padding.left}, ${padding.top})`);

  yAxisFn(yAxis);

  const grid = svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${padding.left}, ${padding.top})`)
    .call(
      d3
        .axisLeft(yScale)
        .tickSize(-chartArea.width)
        .tickFormat("")
    );

  const rectGrp = svg
    .append("g")
    .attr("transform", `translate(${padding.left},${padding.top})`);

  rectGrp
    .selectAll("rect")
    .data(sales)
    .enter()
    .append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartArea.height - yScale(d.qty))
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.qty))
    .attr("fill", (d, i) => colors[i]);
})();

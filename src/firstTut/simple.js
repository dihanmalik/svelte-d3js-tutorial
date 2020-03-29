(function() {
  const app = document.getElementById("app");

  const data = [4, 8, 15, 16, 23, 42],
    width = 420,
    x = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width])
      .clamp(true),
    y = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([0, 200])
      .paddingInner(0.1)
      .round(true);

  const svg = d3
    .create("svg")
    .style("border", "2px solid red")
    .attr("width", width)
    .attr("height", y.range()[1])
    .attr("font-family", "sans-serfif")
    .attr("font-size", "10")
    .attr("text-anchor", "end");

  const bar = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${y(i)})`);

  bar
    .append("rect")
    .attr("fill", "steelblue")
    .attr("width", x)
    .attr("height", y.bandwidth());

  bar
    .append("text")
    .attr("fill", "white")
    .attr("x", d => x(d) - 5)
    .attr("y", y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => d);

  app.appendChild(svg.node());
})();

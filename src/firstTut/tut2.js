(function() {
  const svg = d3
    .select("svg")
    .attr("width", 700)
    .attr("height", 400);

  const r = 120,
    p = Math.PI * 2,
    data = [
      {
        value: 20,
        color: "blue"
      },
      {
        value: 40,
        color: "green"
      },
      {
        value: 50,
        color: "yellow"
      },
      {
        value: 60,
        color: "red"
      }
    ];

  const progress = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, p])
    .clamp(true);
  const colors = d3
    .scaleOrdinal()
    .domain(d3.extent(data.map(d => d.value)))
    .range(d3.schemeCategory10);
  //d3.extent(data, d => d.value)

  const canvas = svg
    .append("g")
    .attr(
      "transform",
      `translate(${svg.attr("width") / 2}, ${svg.attr("height") / 2})`
    );
  const thickness = 60;

  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(r + thickness);
  const pie = d3.pie().value(d => d.value);

  const arcs = canvas
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", d => colors(d.value));

  arcs
    .append("text")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("font-size", 20)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .text(d => d.value);
})();

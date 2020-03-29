(function() {
  const svg = d3
    .select("svg")
    .attr("width", document.body.clientWidth)
    .attr("height", window.innerHeight);

  const margin = {
    top: 0,
    bottom: 0,
    left: 25,
    right: 140
  };
  const dimension = {
    width: +svg.attr("width"),
    height: +svg.attr("height")
  };
  const containerWidth = dimension.width - margin.left - margin.right;
  const containerHeight = dimension.height - margin.top - margin.bottom;
  svg.call(
    d3.zoom().on("zoom", () => [group.attr("transform", d3.event.transform)])
  );
  const group = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const treeLayout = d3.tree().size([containerHeight, containerWidth]);

  d3.json("../data/countryHeirarchy.json").then(data => {
    const root = d3.hierarchy(data);
    const links = treeLayout(root).links();
    const nodes = root.descendants();

    const linkPathGenerator = d3
      .linkHorizontal()
      .x(d => d.y)
      .y(d => d.x);

    group
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", linkPathGenerator)
      .attr("stroke", "#09b79f");

    group
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", d => d.y)
      .attr("y", d => d.x)
      .text(d => d.data.data.id)
      .attr("dy", "0.32em")
      .attr("font-size", d => 3.15 - d.depth + "em")
      .attr("text-anchor", d => (d.children ? "middle" : "start"));
  });
})();

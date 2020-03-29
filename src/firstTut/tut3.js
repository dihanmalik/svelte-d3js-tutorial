(function() {
  const svg = d3
    .select("svg")
    .attr("width", 700)
    .attr("height", 400);
  const link = {
    source: {
      x: 10,
      y: 10
    },
    target: {
      x: 300,
      y: 300
    }
  };

  const diagonal = d3
    .linkVertical()
    .x(d => d.x)
    .y(d => d.y);

  const tree = data => {
    const root = d3.hierarchy(data);
    root.dx = 10;
    root.dy = 700 / (400 + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  };

  d3.json("/data/familyTree.json").then(data => {
    const root = tree(data);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });
  });

  svg
    .append("path")
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("d", diagonal(link));
})();

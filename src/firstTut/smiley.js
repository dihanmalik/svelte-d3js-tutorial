(function() {
  const container = {
    width: 700,
    height: 500
  };
  const svg = d3
    .select("svg")
    .attr("width", container.width)
    .attr("height", container.height);

  const headRadius = 200,
    eyeRadius = 30,
    eyeSpacing = 80,
    eyeOffset = 60,
    mouthYPosition = 20,
    eyebrowThickness = 12,
    eyebrowLength = 55,
    eyebrowYOffset = -60;

  const root = svg
    .append("g")
    .attr(
      "transform",
      `translate(${container.width / 2},${container.height / 2})`
    );
  const head = root
    .append("circle")
    .attr("r", headRadius)
    .attr("fill", "yellow")
    .attr("stroke", "black");

  const eyesG = root
    .append("g")
    .attr("transform", `translate(0, ${-eyeOffset})`);

  const leftEye = eyesG
    .append("circle")
    .attr("r", eyeRadius)
    .attr("cx", -eyeSpacing);

  const rightEye = eyesG
    .append("circle")
    .attr("r", eyeRadius)
    .attr("cx", eyeSpacing);

  const mouth = root
    .append("path")
    .attr(
      "d",
      d3.arc()({
        innerRadius: 100,
        outerRadius: 120,
        startAngle: Math.PI / 2,
        endAngle: Math.PI * 1.5
      })
    )
    .attr("transform", `translate(0, ${mouthYPosition})`);

  const eyebrowG = eyesG
    .append("g")
    .attr("transform", `translate(0, ${eyebrowYOffset})`);

  eyebrowG
    .transition()
    .duration(700)
    .attr("transform", `translate(0, ${eyebrowYOffset - 30})`)
    .transition()
    .attr("transform", `translate(0, ${eyebrowYOffset})`);

  const leftEyebrow = eyebrowG
    .append("rect")
    .attr("height", eyebrowThickness)
    .attr("width", eyebrowLength)
    .attr("x", -eyeSpacing - eyebrowLength / 2);

  const rightEyebrow = eyebrowG
    .append("rect")
    .attr("height", eyebrowThickness)
    .attr("width", eyebrowLength)
    .attr("x", eyeSpacing - eyebrowLength / 2);
})();

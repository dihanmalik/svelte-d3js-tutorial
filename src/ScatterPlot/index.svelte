<script>
  import { onMount } from "svelte";
  import {
    csv,
    select,
    selectAll,
    scaleLinear,
    axisBottom,
    axisLeft,
    extent
  } from "d3";
  import data from "@staticData/auto-mpg.csv";
  import renderGraph from "./renderGraph";
  let options = [];
  let selectedX = "weight",
    selectedY = "acceleration";
  const width = window.innerWidth,
    height = window.innerHeight;
  let csvData;
  const margin = {
    top: 30,
    left: 120,
    bottom: 150,
    right: 50
  };
  const chartArea = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
  const circleRadius = 8;
  const xValue = d => d[selectedX];
  const yValue = d => d[selectedY];

  const render = () => {
    const svg = select("svg");

    svg.call(renderGraph, {
      chartArea,
      margin,
      xValue,
      yValue,
      selectedX,
      selectedY,
      data: csvData
    });

    // const xAxisG = g.select(".x-axis"),
    //   xAxisEnter = xAxisG.append("g").attr("class", "x-axis");

    // const xAxisG = gEnter.append("g");

    // const yAxis = gEnter
    //   .append("g")
    //   .merge(g)
    //   .attr("transform", `translate(0, 0)`)
    //   .call(yAxisIndicator);

    // const circleGroup = svg
    //   .append("g")
    //   .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // const circleData = circleGroup.selectAll(".circle").data(data),
    //   circleEnter = circleData.enter().append("g");

    // const circles = circleEnter
    //   .append("circle")
    //   .attr("r", 0)
    //   .attr("class", "circle")
    //   .attr("cx", (chartArea.width + margin.left) / 2)
    //   .attr("cy", (chartArea.height + margin.top) / 2)
    //   .transition()
    //   .duration(1000)
    //   .delay((d, i) => i * 4)
    //   .attr("cx", d => xScale(xValue(d)))
    //   .attr("cy", d => yScale(yValue(d)))
    //   .attr("r", circleRadius);

    // circleEnter
    //   .append("title")
    //   .text(d => `${xPropName}: ${xValue(d)}, ${yPropName}: ${yValue(d)}`);
  };

  onMount(() => {
    csv(data).then(data => {
      options = data.columns.slice(0, -2);
      data.forEach(d => {
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.horsepower = +d.horsepower;
        d.weight = +d.weight;
        d.accelration = +d.accelration;
        d.year = +d.year;
      });
      csvData = data;
      render();
    });
  });
</script>

<style>
  :global(.circle) {
    fill: red;
    opacity: 0.5;
  }
  :global(.circle):hover {
    opacity: 1;
    stroke: black;
    stroke-width: 2px;
  }
  :global(.axisLabel) {
    font-size: 2em;
    font-family: sans-serif;
    text-transform: capitalize;
  }
  .selectGroup {
    position: absolute;
  }
  :global(.container) {
  }
</style>

<div class="selectGroup">
  <select
    on:change={e => {
      selectedX = e.target.value;
      render();
    }}>
    {#each options as option}
      <option selected={selectedX === option} value={option}>{option}</option>
    {/each}
  </select>

  <select
    on:change={e => {
      selectedY = e.target.value;
      render();
    }}>
    {#each options as option}
      <option selected={selectedY === option} value={option}>{option}</option>
    {/each}
  </select>
</div>

<svg {height} {width} />

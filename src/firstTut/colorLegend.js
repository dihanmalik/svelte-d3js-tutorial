import * as j from "./bowlOfFruit.js";

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
})();

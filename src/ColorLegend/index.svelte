<script>
  import { select, tsv, linePath, scaleOrdinal, schemeSpectral } from "d3";
  import { onMount } from "svelte";
  import { feature } from "topojson";
  import data from "../../static/data/countries50m.json";
  import tsvData from "../../static/data/countries50m.tsv";
  import { colorLegend } from "./colorLegend.js";
  import { choropletMap } from "./choropletMap";

  let features;
  onMount(async () => {
    await tsv(tsvData).then(tsvResult => {
      const countries = feature(data, data.objects.countries);
      const rowById = tsvResult.reduce((acc, d) => {
        acc[d.iso_n3] = d;
        return acc;
      }, {});

      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      features = countries.features;
      render();
    });
  });

  const width = window.innerWidth,
    height = window.innerHeight;
  let svg;

  const colorScale = scaleOrdinal();

  const colorValue = d => d.properties.economy;
  $: selectedValue = null;

  const onFilter = d => {
    selectedValue = d;
    render();
  };

  const render = tsvResult => {
    svg = select("svg");
    const g = svg.append("g");

    const colorLegendG = svg.append("g");

    colorScale
      .domain(features.map(colorValue))
      .domain(colorScale.domain().sort())
      .range(schemeSpectral[colorScale.domain().length]);

    svg.call(choropletMap, {
      features,
      colorScale,
      colorValue,
      selectedValue
    });

    colorLegendG.call(colorLegend, {
      colorScale,
      circleRadius: 8,
      spacing: 25,
      onFilter,
      selectedValue
    });
  };
</script>

<style>
  svg {
    border: 1px solid grey;
  }
  :global(.country) {
    stroke: black;
    stroke-width: 0.1px;
  }
  :global(.country):hover {
    fill: red;
  }
  :global(.country.highlighted) {
    stroke-width: 0.5px;
  }
  :global(.label) {
    font-family: sans-serif;
    font-size: 1em;
  }
  :global(.legendOption) {
    cursor: pointer;
  }
  :global(body) {
    overflow-y: hidden;
  }
  :global(.countryLabel) {
    fill: white;
    font-size: 0.2em;
    text-shadow: 1px 1px 7px black;
  }
</style>

<svg {height} {width} />

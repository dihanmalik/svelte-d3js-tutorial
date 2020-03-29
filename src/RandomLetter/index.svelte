<script>
  import { select, shuffle } from "d3";
  import { onMount } from "svelte";
  const height = window.innerHeight,
    width = window.innerWidth;

  const questions = [
    "Are you looking for hotel?",
    "Where do you wanna go?",
    "You can find places here",
    "You can suck my dick",
    "Or lick my balls"
  ];
  function randomLetters() {
    return shuffle(questions.map(d => d.toLowerCase()))[0];
  }

  async function runSimulation() {
    const svg = select("svg");
    const t = svg.transition().duration(750);

    while (true) {
      svg
        .selectAll("text")
        .data(randomLetters(), d => d)
        .join(
          enter =>
            enter
              .append("text")
              .text(d => d)
              .style("font-size", "2em")
              .attr("fill", "green")
              .attr("x", (d, i) => i * 20)
              .attr("y", -30)
              .attr("opacity", 1)
              .call(enter => enter.transition(t).attr("y", 30)),
          update =>
            update
              .attr("fill", "black")
              .attr("y", 30)
              .call(update => update.transition(t).attr("x", (d, i) => i * 20)),
          exit =>
            exit.attr("fill", "brow").call(exit =>
              exit
                .transition(t)
                .attr("y", 50)
                .attr("opacity", 1)
                .remove()
            )
        );
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }
  }

  onMount(() => {
    runSimulation();
  });
</script>

<svg {height} {width} />

<script>
    import { onMount } from 'svelte'
    import {
        select,
        forceSimulation,
        forceLink,
        forceManyBody,
        forceX,
        forceY,
        event,
        drag,
        forceCenter,
        zoom,
        invalidation,
    } from 'd3'
    import data from './data.json'
    import yamiteImage from '@staticSrc/maleIcon.png'

    const dragger = simulation => {
        function dragstarted(d) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        }

        function dragged(d) {
            d.fx = event.x
            d.fy = event.y
        }

        function dragended(d) {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        }

        return drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
    }

    onMount(() => {
        const width = window.innerWidth,
            height = window.innerHeight
        const svg = select('svg')
            .attr('height', height)
            .attr('width', width)
            .attr('viewBox', [0, 0, width, height])

        const { nodes, links } = data,
            simulation = forceSimulation(nodes)
                .force(
                    'link',
                    forceLink(links)
                        .id(d => d.id)
                        .distance(100)
                )
                .force('charge', forceManyBody().strength(-300))
                .force('x', forceX())
                .force('y', forceY())
                .force('center', forceCenter(width / 2, height / 2)),
            groupSvg = svg.append('g'),
            linkG = groupSvg
                .append('g')
                .attr('class', 'linksG')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6),
            nodesG = groupSvg
                .append('g')
                .attr('class', 'nodesG')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5)

        console.warn(nodes)
        // svg
        //   .append("filter")
        //   .attr("id", "image")
        //   .attr("x", "0%")
        //   .attr("y", "0%")
        //   .attr("height", "100%")
        //   .attr("width", "100%")
        //   .append("feImage")
        //   .style("border-radius", "50%")
        //   .attr(
        //     "xlink:href",
        //     yamiteImage
        //   );

        svg.append('defs')
            .append('pattern')
            .attr('id', 'image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('patternUnits', 'objectBoundingBox')
            .attr('height', 1)
            .attr('width', 1)
            .append('image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 40)
            .attr('width', 40)
            .attr('xlink:href', yamiteImage)

        svg.call(
            zoom().on('zoom', () => {
                groupSvg.attr('transform', event.transform)
            })
        )

        const circles = nodesG
            .selectAll('circle.node')
            .data(nodes)
            .join('g')
            .call(dragger(simulation))

        const newCircles = circles
            .append('circle')
            .attr('fill', 'url(#image)')
            .style('border-radius', '50%')

        const labels = circles
            .append('text')
            .attr('class', 'nodeLabel')
            .text(d => d.name)
            .attr('rx', '20')
            .attr('text-anchor', 'middle')

        const paths = linkG
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', d => (d.type ? 0 : 5))

        simulation.on('tick', () => {
            paths
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)

            newCircles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', 20)
            // .attr("r", d => Math.sqrt(d.value) * 0.8);

            labels.attr('x', d => d.x).attr('y', d => d.y + 30)
        })
    })
</script>

<style>
    :global(body) {
        min-height: 100vh;
    }
    :global(.nodeLabel) {
        stroke: skyblue;
        font-family: sans-serif;
        font-weight: 200;
        letter-spacing: 0.3em;
        font-size: 12px;
    }
</style>

<svg height="100vh" width="100%" />

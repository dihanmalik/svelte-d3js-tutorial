import {
    csv,
    drag,
    easeElastic,
    event,
    forceCenter,
    forceLink,
    forceManyBody,
    forceSimulation,
    forceX,
    forceY,
    geoEqualEarth,
    geoPath,
    transition,
    zoom,
} from 'd3'

import airports from '@staticData/airport.csv'
import getLocations from './dummyLoc'
import personImage from '@staticSrc/maleIcon.png'

const width = window.innerWidth,
    height = window.innerHeight
const projection = geoEqualEarth(),
    pathGenerator = geoPath().projection(projection)

const linkForce = forceLink()
    .id(d => d.id)
    .distance(20)

const simulation = forceSimulation()
    .force('link', linkForce)
    .force('charge', forceManyBody().strength(-100))
    .force('x', forceX())
    .force('y', forceY())
    .force('center', forceCenter(width / 2, height / 2))
    .stop()

function dragStarted(d) {
    // if (positioning === 'map') { return }
    simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
}

function dragged(d) {
    // if (positioning === 'map') { return }
    d.fx = event.x
    d.fy = event.y
}

function dragEnded(d) {
    // if (positioning === 'map') { return }
    simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
}

const dragger = drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded)

export const choropletMap = async (selection, props) => {
    let locations, links
    await csv(airports).then(data => {
        const { nodes, links: relations } = getLocations()

        locations = nodes
        links = relations

        locations.push({
            id: 'lskjdflksjdf',
            latitude: 14.613754,
            longitude: 120.980815,
            name: 'sldkjf',
        })
    })

    simulation.nodes(locations).on('tick', ticked)
    simulation.force(
        'link',
        forceLink(links).id(d => d.id)
    )

    const { colorScale, colorValue, features, selectedValue } = props

    const gUpdate = selection.selectAll('g').data([null])
    const gEnter = gUpdate.enter().append('g')
    const g = gUpdate.merge(gEnter)

    g.selectAll('.sphere')
        .data([null])
        .enter()
        .append('path')
        .attr('class', 'sphere')
        .attr('fill', '#303c41')
        .attr('d', pathGenerator({ type: 'Sphere' }))
        .merge(g.select('.sphere'))
        .attr('opacity', selectedValue ? 0.3 : 1)

    selection.call(
        zoom().on('zoom', () => {
            g.attr('transform', event.transform)
        })
    )
    //add sphere

    const personImg = g
        .append('defs')
        .append('pattern')
        .attr('id', 'maleIcon')
        .attr('height', 1)
        .attr('width', 1)
        .attr('x', 0)
        .attr('y', 0)
        .append('image')
        .attr('width', 10)
        .attr('height', 10)
        .attr('xlink:href', personImage)

    const countryPaths = g.selectAll('.country').data(features)

    const countryPathsEnter = countryPaths
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)

    countryPaths
        .merge(countryPathsEnter)
        // .attr('fill', d => colorScale(colorValue(d)))
        .attr('fill', '#707070')
        .attr('opacity', d =>
            !selectedValue || selectedValue === colorValue(d) ? 1 : 0.3
        )
        .classed('highlighted', d => selectedValue === colorValue(d))

    countryPathsEnter
        .append('title')
        .text(d => `${d.properties.name}: ${colorValue(d)}`)

    const paths = g
        .selectAll('line.paths')
        .data(links)
        .join('line')
        .attr('class', 'paths')
        .attr('stroke-width', 1)
        .attr('stroke', '#124ece')
        .attr('fill', 'none')

    const circles = g
        .selectAll('circle.nodes')
        .data(locations)
        .join('circle')
        .attr('class', 'nodes')
        .attr('r', 5)
        .attr('fill', d => (d.name ? 'red' : 'url(#maleIcon)'))
        .attr('stroke', 'pink')
        .call(dragger)

    fixed(true)
    setTimeout(() => {
        simulation.alpha(1).restart()
    }, 5000)

    function fixed(immediate) {
        locations.forEach(d => {
            var pos = projection([d.longitude, d.latitude])
            d.x = pos[0]
            d.y = pos[1]
        })

        var t = transition()
            .duration(immediate ? 0 : 600)
            .ease(easeElastic.period(0.5))

        update(paths.transition(t), circles.transition(t))
    }

    function ticked() {
        update(paths, circles)
    }

    function update(paths, circles) {
        // paths.attr('d', linkArc)
        paths
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)

        circles.attr('cx', d => d.x).attr('cy', d => d.y)
    }

    function linkArc(d) {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
        return `
          M${d.source.x},${d.source.y}
          A${r},${r} 0.5 0,1 ${d.target.x},${d.target.y}
        `
    }
}

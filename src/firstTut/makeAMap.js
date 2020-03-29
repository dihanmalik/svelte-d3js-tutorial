;(function() {
    const svg = d3
        .select('svg')
        .attr('width', document.body.clientWidth)
        .attr('height', window.innerHeight)

    const dimension = {
        width: +svg.attr('width'),
        height: +svg.attr('height'),
    }

    const projection = d3.geoEqualEarth()
    const pathGenerator = d3.geoPath().projection(projection)

    const g = svg.append('g')

    svg.call(
        d3.zoom().on('zoom', () => {
            g.attr('transform', d3.event.transform)
        })
    )

    const sphere = g
        .append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({ type: 'Sphere' }))

    d3.json('../data/countries.json').then(data => {
        const countries = topojson.feature(data, data.objects.countries)
        const paths = g.selectAll('path').data(countries.features)

        paths
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .append('title')
            .text(d => d.name)
    })
})()

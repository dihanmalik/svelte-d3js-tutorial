export const colorLegend = (selection, props) => {
    const {
        colorScale,
        circleRadius = 50,
        spacing = 30,
        textOffset = 15,
        onFilter: onClick,
        selectedValue,
    } = props
    const n = colorScale.domain().length
    selection
        .append('rect')
        .attr('x', -circleRadius * 2)
        .attr('y', -circleRadius * 2)
        .attr('fill', 'white')
        .attr('height', spacing * n + circleRadius * 2 - 10)
        .attr('width', 250)
        .attr('stroke', 'grey')
        .attr('rx', circleRadius)
        .attr('opacity', 0.75)

    selection.attr(
        'transform',
        `translate(${circleRadius * 2 + 10}, ${window.innerHeight -
            (spacing * n + circleRadius * 2 - 10)})`
    )

    const groups = selection.selectAll('g').data(colorScale.domain())
    const groupsEnter = groups
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * spacing})`)
        .attr('class', 'legendOption')
        .merge(groups)
        .attr('opacity', d => (!selectedValue || d === selectedValue ? 1 : 0.5))
        .on('click', d => {
            onClick(selectedValue === d ? null : d)
        })

    groupsEnter
        .append('circle')
        .merge(groups.select('circle'))
        .attr('r', circleRadius)
        .attr('fill', colorScale)
        .attr('stroke', 'black')

    groupsEnter
        .append('text')
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'start')
        .attr('dx', textOffset)
        .attr('class', 'label')
}

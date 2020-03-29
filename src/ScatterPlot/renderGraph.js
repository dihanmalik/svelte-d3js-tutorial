import { axisBottom, axisLeft, extent, scaleLinear } from 'd3'

export default (selection, props) => {
    const {
        margin,
        chartArea,
        xValue,
        yValue,
        data,
        selectedX,
        selectedY,
    } = props

    const circleRadius = 7

    const xScale = scaleLinear()
        .domain(extent(data, xValue))
        .range([0, chartArea.width])
        .nice()
        .clamp(true)
    const yScale = scaleLinear()
        .domain(extent(data, yValue))
        .range([chartArea.height, 0])
        .nice()
        .clamp(true)

    const xAxisIndicator = axisBottom(xScale)
        .tickSize(-chartArea.height)
        .tickPadding(15)
    const yAxisIndicator = axisLeft(yScale)
        .tickSize(-chartArea.width)
        .tickPadding(10)

    const group = selection.selectAll('g').data([null]),
        gEnter = group
            .enter()
            .append('g')
            .attr('class', 'container')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // console.warn(xScale.domain())
    gEnter
        .append('g')
        .attr('class', 'x-axis')
        .merge(group.select('.x-axis'))
        .attr('transform', `translate(0,${chartArea.height + margin.top})`)
        .call(xAxisIndicator)

    gEnter
        .append('g')
        .attr('class', 'y-axis')
        .merge(group.select('.y-axis'))
        .attr('transform', `translate(0,${margin.top})`)
        .call(yAxisIndicator)

    const circleGroup = group
        .merge(gEnter)
        .selectAll('circle')
        .data(data)

    const circleEnter = circleGroup
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('r', circleRadius)
        .attr('cx', chartArea.width / 2)
        .attr('cy', chartArea.height / 2 + margin.top)

    circleEnter
        .merge(circleGroup)
        .transition()
        .duration(500)
        .delay((d, i) => i * 4)
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)) + margin.top)

    circleEnter
        .append('title')
        .merge(circleGroup.select('title'))
        .text(d => `${selectedX}: ${xValue(d)}\n${selectedY}: ${yValue(d)}`)

    const xAxisLabel = group
        .merge(gEnter)
        .selectAll('.axisLabel.xAxis')
        .data([null])

    const xAxisLabelEnter = xAxisLabel
        .enter()
        .append('text')
        .attr('class', 'axisLabel xAxis')
        .attr('text-anchor', 'middle')
        .merge(xAxisLabel)
        .text(selectedX)
        .attr(
            'transform',
            `translate(${chartArea.width / 2}, ${chartArea.height +
                margin.top +
                margin.bottom / 2})`
        )

    const yAxisLabel = group
        .merge(gEnter)
        .selectAll('.axisLabel.yAxis')
        .data([null])

    yAxisLabel
        .enter()
        .append('text')
        .attr('class', 'axisLabel yAxis')
        .attr('text-anchor', 'middle')
        .merge(yAxisLabel)
        .text(selectedY)
        .attr(
            'transform',
            `translate(${-(margin.left / 2)}, ${chartArea.height /
                2}) rotate(-90)`
        )
}

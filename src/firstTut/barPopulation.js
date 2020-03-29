;(function() {
    const svg = d3
        .select('svg')
        .attr('width', 700)
        .attr('height', 400)

    const dimension = {
        width: +svg.attr('width'),
        height: +svg.attr('height'),
    }
    const circleRadius = 5
    const xKey = 'acceleration',
        yKey = 'horsepower'
    const xValue = d => d[xKey],
        yValue = d => d[yKey]
    const padding = {
        top: 50,
        bottom: 50,
        left: 110,
        right: 40,
    }
    const chartArea = {
        width: dimension.width - padding.left - padding.right,
        height: dimension.height - padding.top - padding.bottom,
    }

    const render = data => {
        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, xValue)])
            .range([0, chartArea.width])
            .clamp(true)
            .nice()

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, yValue)])
            .range([chartArea.height, 0])
            .nice()

        const xAxis = d3
            .axisBottom(xScale)
            .tickFormat(d3.format('.3s'))
            .tickSize(-chartArea.height)
            .tickPadding(10)

        const yAxis = d3
            .axisLeft(yScale)
            .tickSize(-chartArea.width)
            .tickPadding(10)

        const xAxisIndicator = svg
            .append('g')
            .attr(
                'transform',
                `translate(${padding.left}, ${chartArea.height + padding.top})`
            )
            .call(xAxis)

        xAxisIndicator.selectAll('text').attr('font-size', '1.5em')

        const yAxisIndicator = svg
            .append('g')
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .call(yAxis)

        yAxisIndicator.selectAll('text').attr('font-size', '1.5em')

        svg.selectAll('.tick line, .domain').attr('stroke', 'grey')
        const barG = svg
            .append('g')
            .attr('transform', `translate(${padding.left}, ${padding.top})`)

        const bars = barG
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')

        bars.append('circle')
            .attr('r', 0)
            .attr('cy', d => yScale(d[yKey]) + circleRadius)
            .attr('cx', d => xScale(d[xKey]))
            .attr('class', 'circle')
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('r', circleRadius)
    }

    d3.csv('../data/auto-mpg.csv').then(data => {
        data.forEach(d => {
            d.mpg = +d.mpg
            d.cylinders = +d.cylinders
            d.displacement = +d.displacement
            d.horsepower = +d.horsepower
            d.weight = +d.weight
            d.acceleration = +d.acceleration
            d.year = +d.year
        })
        render(data)
    })
})()

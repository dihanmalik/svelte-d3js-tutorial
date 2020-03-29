;(function() {
    const svg = d3
        .select('svg')
        .attr('width', 700)
        .attr('height', 400)

    const dimension = {
        width: +svg.attr('width'),
        height: +svg.attr('height'),
    }
    const appleRadius = 60,
        lemonRadius = 30

    const colorScale = d3
        .scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['#bf210f', '#d9e010'])

    const sizeScale = d3
        .scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([appleRadius, lemonRadius])

    let fruits = d3.range(5).map(() => ({ type: 'apple', id: Math.random() }))

    const render = (selection, { fruits }) => {
        const circles = selection.selectAll('circle').data(fruits, d => d.id)
        circles
            .enter()
            .append('circle')
            .attr('r', 0)
            .attr('cx', 0)
            .merge(circles)
            .attr('fill', d => colorScale(d.type))
            .transition()
            .duration(1000)
            .attr('cx', (d, i) => i * 130)
            .attr('r', d => sizeScale(d.type))

        circles
            .exit()
            .transition()
            .duration(1000)
            .attr('r', 0)
            .remove()
    }

    const bowl = svg
        .append('g')
        .attr(
            'transform',
            `translate(${appleRadius + 20},${dimension.height / 2})`
        )

    render(bowl, { fruits })
    fruits.pop()

    setTimeout(() => {
        render(bowl, { fruits })
    }, 2000)

    setTimeout(() => {
        fruits[2].type = 'lemon'
        render(bowl, { fruits })
    }, 4000)
    setTimeout(() => {
        fruits = fruits.filter((d, i) => i !== 1)
        render(bowl, { fruits })
    }, 6000)
})()

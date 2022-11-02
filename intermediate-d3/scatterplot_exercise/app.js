const width = 500;
const height = 500;
const padding = 50;

const data = regionData.filter(mustHaveKeys);

const xScale = d3.scaleLinear()
    .domain(d3.extent(regionData, (d) => d.adultLiteracyRate))
    .range([padding, width - padding]);

const yScale = d3.scaleLinear()
    .domain(d3.extent(regionData, (d) => d.subscribersPer100))
    .range([height - padding, padding]);

const radiusScale = d3.scaleLinear()
    .domain(d3.extent(regionData, (d) => d.medianAge))
    .range([5, 30]);

const colorScale = d3.scaleLinear()
    .domain(d3.extent(regionData, (d) => d.urbanPopulationRate))
    .range(['green', 'blue']);

const xAxis = d3.axisBottom(xScale)
    .tickSize(- height + 2 * padding)
    .tickSizeOuter(0);
    
const yAxis = d3.axisLeft(yScale)
    .tickSize(- width + 2 * padding)
    .tickSizeOuter(0);

function mustHaveKeys(obj) {
    const keys = [
        'subscribersPer100',
        'adultLiteracyRate',
        'medianAge',
        'urbanPopulationRate'
    ];
    for (const key of keys) {
        if (obj[key] === null) return false;
    }
    return true;
}


d3.select('svg')
    .append('g')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

d3.select('svg')
    .append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);

d3.select('svg')
        .attr('width', width)
        .attr('height', height)
    .selectAll('circle')
    .data(regionData)
    .enter()
    .append('circle')
        .attr('cx', (d) => xScale(d.adultLiteracyRate))
        .attr('cy', (d) => yScale(d.subscribersPer100))
        .attr('fill', (d) => colorScale(d.urbanPopulationRate))
        .attr('r', (d) => radiusScale(d.medianAge))
        .attr('stroke', '#fff');

d3.select('svg')
    .append('text')
        .attr('x', width / 2)
        .attr('y', height - padding)
        .attr('dy', '1.5em')
        .style('text-anchor', 'middle')
        .text('Literacy Rate, Aged 15 and Up');

d3.select('svg')
    .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', - height / 2)
        .attr('y', padding / 2)
        .style('text-anchor', 'middle')
        .text('Cellular Subscribers per 100 People');

d3.select('svg')
    .append('text')
        .attr('x', width / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '1.5em')
        .text('Cellular Subscriptions vs. Literacy Rate');
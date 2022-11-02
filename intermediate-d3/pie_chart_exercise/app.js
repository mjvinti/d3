const width = 600;
const height = 600;
const minYear = d3.min(birthData, d => d.year);
const maxYear = d3.max(birthData, d => d.year);
const orderedMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const colors = [
    '#aec7e8',
    '#a7cfc9',
    '#9fd7a9',
    '#98df8a',
    '#bac78e',
    '#ddb092',
    '#ff9896',
    '#ffa48c',
    '#ffaf82',
    '#ffbb78',
    '#e4bf9d',
    '#c9c3c3'
];
const quarterColors = [
    '#1f77b4',
    '#2ca02c',
    '#d62728',
    '#ff7f0e'
];

const colorScale = d3.scaleOrdinal()
    .domain(orderedMonths)
    .range(colors);

const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);
svg    
    .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .classed('chart', true);

svg.
    append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .classed('inner-chart', true);

svg
    .append('text')
        .classed('title', true)
        .attr('x', width / 2)
        .attr('y', 30)
        .style('font-size', '2em')
        .style('text-anchor', 'middle');


d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', function() {
        makeGraph(+d3.event.target.value);
    });

makeGraph(minYear);

function makeGraph(year) {
    const yearData = birthData.filter(d => d.year === year);
    const arcs = d3.pie()
        .value(d => d.births)
        .sort((a, b) => orderedMonths.indexOf(a.month) - orderedMonths.indexOf(b.month));

    const innerArcs = d3.pie()
        .value(d => d.births)
        .sort((a, b) => a.quarter - b.quarter);

    const path = d3.arc()
        .outerRadius(width / 4)
        .innerRadius(width / 2 - 40);

    const innerPath = d3.arc()
        .innerRadius(0)
        .outerRadius(width / 4);

    const outer = d3.select('.chart')
        .selectAll('.arc')
        .data(arcs(yearData));

    const inner = d3.select('.inner-chart')
        .selectAll('.arc')
        .data(innerArcs(getDataByQuarter(yearData)));

    outer
        .enter()
        .append('path')
            .classed('arc', true)
            .attr('fill', d => colorScale(d.data.month))
        .merge(outer)
            .attr('d', path);

    inner
        .enter()
        .append('path')
            .classed('arc', true)
            .attr('fill', (_, i) => quarterColors[i])
        .merge(inner)
            .attr('d', innerPath);

    d3.select('.title')
        .text(`Births by months and quarter for ${year}`);
}

function getDataByQuarter(data) {
    const quarterTallies = [0, 1, 2, 3].map(n => ({
        quarter: n, births: 0
    }));
    for (const row of data) {
        const quarter = Math.floor(orderedMonths.indexOf(row.month) / 3);
        quarterTallies[quarter].births += row.births;
    }
    return quarterTallies;
}
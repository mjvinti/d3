const minYear = d3.min(birthData, d => d.year);
const maxYear = d3.max(birthData, d => d.year);
const width = 600;
const height = 600;

const continents = [];
for (let i = 0; i < birthData.length; i++) {
    const continent = birthData[i].continent;
    if (continents.indexOf(continent) === -1) {
        continents.push(continent);
    }
}

const colorScale = d3.scaleOrdinal()
    .domain(continents)
    .range(d3.schemeCategory10);

d3.select('svg')
        .attr('width', width)
        .attr('height', height)
    .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .classed('chart', true);

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
        .sort((a, b) => a.continent < b.continent ? -1
            : a.continent > b.continent ? 1
            : a.births - b.births
        )
        (yearData);
    const path = d3.arc()
        .outerRadius(width / 2 - 10)
        .innerRadius(width / 4);
    const update = d3.select('.chart')
        .selectAll('.arc')
        .data(arcs);

    update
        .exit()
        .remove();
    update
        .enter()
        .append('path')
            .classed('arc', true)
        .merge(update)
            .attr('fill', d => colorScale(d.data.continent))
            .attr('stroke', 'black')
            .attr('d', path);
}
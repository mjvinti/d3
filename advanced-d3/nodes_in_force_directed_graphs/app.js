const width = 600;
const height = 600;

const nodes = [
	{ color: 'red', size: 5 },
	{ color: 'orange', size: 10 },
	{ color: 'yellow', size: 15 },
	{ color: 'green', size: 20 },
	{ color: 'blue', size: 25 },
	{ color: 'purple', size: 30 }
];

const links = [
    { source: 'red', target: 'orange' },
    { source: 'orange', target: 'yellow' },
    { source: 'yellow', target: 'green' },
    { source: 'green', target: 'blue' },
    { source: 'blue', target: 'purple' },
    { source: 'purple', target: 'red' },
    { source: 'green', target: 'red' }
];

const svg = d3.select('svg').attr('width', width).attr('height', height);

const linkSelection = svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

const nodeSelection = svg
	.selectAll('circle')
	.data(nodes)
	.enter()
	.append('circle')
	.attr('r', (d) => d.size)
    .attr('fill', (d) => d.color)
    .call(d3.drag()
        .on('start', dragStart)
        .on('drag', drag)
        .on('end', dragEnd));


const simulation = d3.forceSimulation(nodes);

simulation
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('nodes', d3.forceManyBody())
    .force('links', d3.forceLink(links)
        .id(d => d.color)
        .distance(d => 5 * (d.source.size + d.target.size)))
    .on('tick', ticked);

function ticked() {
    console.log(simulation.alpha());
    nodeSelection
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    
    linkSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
}

function dragStart(d) {
    console.log('starting to drag');
    simulation.alphaTarget(0.5).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function drag(d) {
    console.log('dragging');
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragEnd(d) {
    console.log('done dragging');
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
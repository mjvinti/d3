queue();

async function queue() {
    try {
        const [mapData, data] = await Promise.all([
            d3.json('//unpkg.com/world-atlas@1.1.4/world/50m.json'),
            d3.csv('./data/all_data.csv', (row) => {
                return {
                    continent: row.Continent,
                    country: row.Country,
                    countryCode: row['Country Code'],
                    emissions: +row['Emissions'],
                    emissionsPerCapita: +row['Emissions Per Capita'],
                    region: row.Region,
                    year: +row.Year
                }
            })
        ]);
        const extremeYears = d3.extent(data, d => d.year);
        console.log(extremeYears);
        console.log(extremeYears);
        let currentYear = extremeYears[0];
        let currentDataType = d3.select('input[name="data-type"]:checked')
            .attr('value');
        const geoData = topojson.feature(mapData, mapData.objects.countries).features;
        const width = +d3.select('.chart-container')
            .node().offsetWidth;
        const height = 300;
        
        createMap(width, width * 4 / 5);
        createPie(width, height);
        createBar(width, height);
        drawMap(geoData, data, currentYear, currentDataType);
        drawPie(data, currentYear);
        drawBar(data, currentDataType, '');

        d3.select('#year')
            .property('min', currentYear)
            .property('max', extremeYears[1])
            .property('value', currentYear)
            .on('input', () => {
                currentYear = +d3.event.target.value;
                drawMap(geoData, data, currentYear, currentDataType);
                drawPie(data, currentYear);
                highlightBars(currentYear);
            });

        d3.selectAll('input[name="data-type"]')
            .on('change', () => {
                const active = d3.select('.active').data()[0];
                const country = active ? active.properties.country : '';
                currentDataType = d3.event.target.value;
                drawMap(geoData, data, currentYear, currentDataType);
                drawBar(data, currentDataType, country);
            });

        d3.selectAll('svg')
            .on('mousemove touchmove', updateTooltip);

        function updateTooltip() {
            const tooltip = d3.select('.tooltip');
            const tgt = d3.select(d3.event.target);
            const isCountry = tgt.classed('country');
            const isBar = tgt.classed('bar');
            const isArc = tgt.classed('arc');
            const dataType = d3.select('input:checked')
                .property('value');
            const units = dataType === 'emissions' ? 'thousand metric tons' : 'metric tons per capita';
            let data;
            let percentage = '';
            if (isCountry) data = tgt.data()[0].properties;
            if (isArc) {
                data = tgt.data()[0].data;
                percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`
            };
            if (isBar) data = tgt.data()[0];
            tooltip
                .style('opacity', +(isCountry || isArc || isBar))
                .style('left', (d3.event.pageX - tooltip.node().offsetWidth / 2) + 'px')
                .style('top', (d3.event.pageY - tooltip.node().offsetHeight - 10) + 'px');
            if (data) {
                const dataValue = data[dataType] ?
                    data[dataType].toLocaleString() + ' ' + units :
                    'Data not available';
                tooltip.html(`
                    <p>Country: ${data.country}</p>
                    <p>${formatDataType(dataType)}: ${dataValue}</p>
                    <p>Year: ${data.year || d3.select('#year').property('value')}</p>
                    ${percentage}
                `)
            }
        }

        function formatDataType(key) {
            return key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, c => ' ' + c);
        }

        function getPercentage(d) {
            const angle = d.endAngle - d.startAngle;
            const fraction = 100 * angle / (Math.PI * 2);
            return fraction.toFixed(2) + '%';
        }
    } catch (error) {
        if (error) throw error;
    }
    
}
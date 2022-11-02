Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv('./country_data.csv', (row) => {
        return {
            country: row.country,
            countryCode: row.countryCode,
            population: +row.population,
            medianAge: +row.medianAge,
            fertilityRate: +row.fertilityRate,
            populationDensity: +row.population / +row.landArea
        }
    })
]).then(([mapData, populationData]) => {
    const geoData = topojson.feature(mapData, mapData.objects.countries).features;
    populationData.forEach((row) => {
        const countries = geoData.filter((d) => d.id === row.countryCode);
        countries.forEach((country) => country.properties = row);
    });

    const width = 960;
    const height = 600;
    const projection = d3.geoMercator()
        .scale(125)
        .translate([width / 2, height / 1.4]);
    const path = d3.geoPath()
        .projection(projection);

    d3.select('svg')
            .attr('width', width)
            .attr('height', height)
        .selectAll('.country')
        .data(geoData)
        .enter()
            .append('path')
            .classed('country', true)
            .attr('d', path);

    const select = d3.select('select');
    
    select
        .on('change', d => setColor(d3.event.target.value));
    
    setColor(select.property('value'));

    function setColor(val) {
        const colorRanges = {
            population: ['white', 'purple'],
            populationDensity: ['white', 'red'],
            medianAge: ['white', 'black'],
            fertilityRate: ['black', 'orange']
        };

        const scale = d3.scaleLinear()
            .domain([0, d3.max(populationData, d => d[val])])
            .range(colorRanges[val]);

        d3.selectAll('.country')
            .transition()
            .duration(750)
            .ease(d3.easeBackIn)
            .attr('fill', d => {
                const data = d.properties[val];
                return data ? scale(data) : '#ccc';
            });
    }

}).catch(e => console.log(e))
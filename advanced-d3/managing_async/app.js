async function chart() {
    const [first, second] = await Promise.all([
        d3.json('./countries.json'),
        d3.csv('./simple-worldcities-basic.csv')
    ])
    console.log(first);
    console.log(second);
};

chart();

// d3.json().then((data) => {
//     d3.select('body')
//         .selectAll('h3')
//         .data(data.geonames)
//         .enter()
//         .append('h3')
//         .text(d => d.countryName);
// });


// d3.csv('').then((row) => {
//     if (+row.pop < 10000) return;
//     return {
//         cityName: row.city,
//         countryCode: row.iso2,
//         population: +row.pop
//     }
// });
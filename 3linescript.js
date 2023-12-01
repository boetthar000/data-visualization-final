document.addEventListener('DOMContentLoaded', function () {
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    function createLineChart(svgId, country1, country2, country3, country4, country5, country6, options) {
        const svg = d3.select(svgId)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        d3.csv("./data/filtered_global_development.csv").then(function (rawData) {
            const data = processDataForChart(rawData, country1, country2, country3, country4, country5, country6, options.attribute);
    
            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
    
            const y = d3.scaleLinear()
                .range([height, 0]);
    
            const line = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.value));
    
            x.domain(data.map(d => d.year));
            y.domain([0, d3.max(data, d => d3.max([d[country1], d[country2], d[country3], d[country4], d[country5], d[country6]]))]);
    
            // Line Charts
            for (let i = 1; i <= 6; i++) {
                const currentCountry = eval(`country${i}`);
                const currentLine = d3.line()
                    .x(d => x(d.year))
                    .y(d => y(d[currentCountry]));
    
                svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", currentLine)
                    .attr("stroke", options[`color${i}`])
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
    
                // Add points for current line
                svg.selectAll(`.point${i}`)
                    .data(data)
                    .enter().append("circle")
                    .attr("class", `point${i}`)
                    .attr("cx", d => x(d.year))
                    .attr("cy", d => y(d[currentCountry]))
                    .attr("r", 5)
                    .style("fill", options[`color${i}`]);
            }
    
            // Axes
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
    
            svg.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format("~s")));
    
            // Legend
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - 100},${margin.top})`);
    
            const countries = [
                country1, country2, country3, country4, country5, country6
            ];
    
            countries.forEach((country, index) => {
                const legendRow = legend.append("g")
                    .attr("transform", `translate(0, ${index * 20})`);
    
                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", options[`color${index + 1}`]);
    
                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .text(country);
            });
        });
    }
    

    createLineChart("#line1", "United States", "Philippines","China", "Kenya", "Canada", "Argentina" ,{ yText: "Mobile Cellular Subscriptions", color1: "blue", color2: "grey", color3: "red", color4: "purple",color5: "orange", color6: "green",attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions' });
    createLineChart("#line2", "China", "Kenya",  "United States", "Philippines","Canada", "Argentina" ,{ yText: "Mobile Cellular Subscriptions", color1: "blue", color2: "grey", color3: "red", color4: "purple",color5: "orange", color6: "green", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions' });
    createLineChart("#line3", "China", "Kenya",  "United States", "Philippines","Canada", "Argentina", { yText: "Mobile Cellular Subscriptions", color1: "blue", color2: "grey", color3: "red", color4: "purple",color5: "orange", color6: "green", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions' });

    function processDataForChart(rawData, country1, country2, country3, country4, country5, country6, attribute) {
        let processedData = {};

        rawData.forEach(d => {
            const year = parseInt(d.Year, 10);
            if ((year >= 2008 && year <= 2013) && (d.Country === country1 || d.Country === country2 || d.Country === country3 || d.Country === country4 || d.Country === country5 || d.Country === country6)) {
                if (!processedData[year]) {
                    processedData[year] = { year: year };
                }

                if (d.Country === country1) {
                    processedData[year][country1] = +d[attribute];
                } else if (d.Country === country2) {
                    processedData[year][country2] = +d[attribute];
                }
                else if (d.Country === country3) {
                    processedData[year][country3] = +d[attribute];
                }
                else if (d.Country === country4) {
                    processedData[year][country4] = +d[attribute];
                }
                else if (d.Country === country5) {
                    processedData[year][country5] = +d[attribute];
                }
                else if (d.Country === country6) {
                    processedData[year][country6] = +d[attribute];
                }
                
            }
        });

        return Object.values(processedData);
    }
});

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
            const data = processDataForChart(rawData, country1, country2,country3, country4, country5, country6,options.attribute);

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .range([height, 0]);

            const line1 = d3.line()
                .x(d => x(d.year))
                .y(d => y(d[country1]));

            const line2 = d3.line()
                .x(d => x(d.year))
                .y(d => y(d[country2]));
                
                const line3 = d3.line()
                .x(d => x(d.year))
                .y(d => y(d[country3]));

            const line4 = d3.line()
                .x(d => x(d.year))
                .y(d => y(d[country4]));

                const line5 = d3.line()
                .x(d => x(d.year))
                .y(d => y(d[country5]));

            const line6 = d3.line()
                .x(d => x(d.year))
                .y(d => y(d[country6]));

            x.domain(data.map(d => d.year));
            y.domain([0, d3.max(data, d => Math.max(d[country1], d[country2], d[country3],d[country4], d[country5], d[country6]))]);

            // Line Charts
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line1)
                .attr("stroke", options.color1)
                .attr("stroke-width", 2)
                .attr("fill", "none");

            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line2)
                .attr("stroke", options.color2)
                .attr("stroke-width", 2)
                .attr("fill", "none");

                svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line3)
                .attr("stroke", options.color3)
                .attr("stroke-width", 2)
                .attr("fill", "none");

            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line4)
                .attr("stroke", options.color4)
                .attr("stroke-width", 2)
                .attr("fill", "none");

                svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line5)
                .attr("stroke", options.color5)
                .attr("stroke-width", 2)
                .attr("fill", "none");

            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line6)
                .attr("stroke", options.color6)
                .attr("stroke-width", 2)
                .attr("fill", "none");

            // Axes
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format("~s")));

            // Legend (similar to previous examples)
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - 100},${margin.top})`);

            const countries = [
                { name: country1, color: options.color1 },
                { name: country2, color: options.color2 },
                { name: country3, color: options.color3 },
                { name: country4, color: options.color4 },
                { name: country5, color: options.color5 },
                { name: country6, color: options.color6 }
            ];

            countries.forEach((country, index) => {
                const legendRow = legend.append("g")
                    .attr("transform", `translate(0, ${index * 20})`);

                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", country.color);

                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .text(country.name);
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

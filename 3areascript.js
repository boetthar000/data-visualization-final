document.addEventListener('DOMContentLoaded', function() {
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    function createAreaChart(svgId, country1, country2, options) {
        const svg = d3.select(svgId)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        d3.csv("./data/filtered_global_development.csv").then(function (rawData) {
            const data = processDataForChart(rawData, country1, country2, options.attribute);
    
            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
    
            const y = d3.scaleLinear()
                .range([height, 0]);
    
            const area1 = d3.area()
                .x(d => x(d.year))
                .y0(height)
                .y1(d => y(d[country1]));
    
            const area2 = d3.area()
                .x(d => x(d.year))
                .y0(height)
                .y1(d => y(d[country2]));
    
            x.domain(data.map(d => d.year));
            y.domain([0, d3.max(data, d => Math.max(d[country1], d[country2]))]);
    
            // Area Charts
            svg.append("path")
                .data([data])
                .attr("class", "area")
                .attr("d", area1)
                .attr("fill", options.color1)
                .attr("opacity", 0.7);
    
            svg.append("path")
                .data([data])
                .attr("class", "area")
                .attr("d", area2)
                .attr("fill", options.color2)
                .attr("opacity", 0.7);
    
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
                { name: country2, color: options.color2 }
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
    
  
    createAreaChart("#area1", "Angola", "Afghanistan", {yText: "Mobile Cellular Subscriptions", color1: "blue", color2: "grey", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions'});
    createAreaChart("#area2", "Argentina", "Bangladesh", {yText: "Mobile Cellular Subscriptions", color1: "red", color2: "black", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions'});
    createAreaChart("#area3", "Bolivia", "Burkina Faso", {yText: "Mobile Cellular Subscriptions", color1: "purple", color2: "orange", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions'});
  
    function processDataForChart(rawData, country1, country2, attribute) {
        let processedData = {};
    
        rawData.forEach(d => {
            const year = parseInt(d.Year, 10);
            if ((year >= 2008 && year <= 2013) && (d.Country === country1 || d.Country === country2)) {
                if (!processedData[year]) {
                    processedData[year] = { year: year };
                }
    
                if (d.Country === country1) {
                    processedData[year][country1] = +d[attribute];
                } else if (d.Country === country2) {
                    processedData[year][country2] = +d[attribute];
                }
            }
        });
    
        return Object.values(processedData);
      }
  
  });
  


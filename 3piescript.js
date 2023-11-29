document.addEventListener('DOMContentLoaded', function() {
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    function createDonutChart(svgId, country1, country2, options) {
        const svg = d3.select(svgId)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
    
        d3.csv("./data/filtered_global_development.csv").then(function (rawData) {
            const data = processDataForChart(rawData, country1, country2, options.attribute);
    
            const pie = d3.pie()
                .sort(null)
                .value(d => d[country1]);
    
            const arc = d3.arc()
                .innerRadius(50)  // Adjust the inner radius for the donut hole
                .outerRadius(Math.min(width, height) / 2 - 10);
    
            const color = d3.scaleOrdinal()
                .domain(data.map(d => d.year))
                .range(d3.schemeCategory10);
    
            const arcs = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");
    
            arcs.append("path")
                .attr("d", arc)
                .attr("fill", d => color(d.data.year))
                .attr("stroke", "white")  // Add white stroke for better separation
    
            // Add labels inside the donut slices
            arcs.append("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("dy", "0.35em")
                .style("text-anchor", "middle")
                .text(d => d.data.year);
    
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
    
    
  
    createDonutChart("#pie1", "United States", "Philippines", {yText: "Mobile Cellular Subscriptions", color1: "blue", color2: "grey", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions'});
    createDonutChart("#pie2", "China", "Kenya", {yText: "Mobile Cellular Subscriptions", color1: "red", color2: "black", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions'});
    createDonutChart("#pie3", "Canada", "Argentina", {yText: "Mobile Cellular Subscriptions", color1: "purple", color2: "orange", attribute: 'Data.Infrastructure.Mobile Cellular Subscriptions'});
    
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
  


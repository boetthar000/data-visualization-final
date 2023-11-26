document.addEventListener('DOMContentLoaded', function() {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg1 = d3.select("#chart1")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("./data/filtered_global_development.csv").then(function(rawData) {

      const data = processDataForChart(rawData, "United States", "Philippines");

      const x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
      const y = d3.scaleLinear()
          .range([height, 0]);

      x.domain(data.map(d => d.year));
      y.domain([0, d3.max(data, d => Math.max(d["United States"], d["Philippines"]))]);

      svg1.selectAll(".bar-us")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar bar-us")
          .attr("x", d => x(d.year))
          .attr("width", x.bandwidth() / 2)
          .attr("y", d => y(d["United States"]))
          .attr("height", d => height - y(d["United States"]))
          .attr("fill", "purple");

      svg1.selectAll(".bar-philippines")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar bar-philippines")
          .attr("x", d => x(d.year) + x.bandwidth() / 2)
          .attr("width", x.bandwidth() / 2)
          .attr("y", d => y(d["Philippines"]))
          .attr("height", d => height - y(d["Philippines"]))
          .attr("fill", "orange");

      svg1.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

      svg1.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format("~s")));
  });

  function processDataForChart(rawData, country1, country2) {
    let processedData = {};

    rawData.forEach(d => {
        const year = parseInt(d.Year, 10);
        if ((year >= 2008 && year <= 2013) && (d.Country === country1 || d.Country === country2)) {
            if (!processedData[year]) {
                processedData[year] = { year: year };
            }

            if (d.Country === country1) {
                processedData[year][country1] = +d['Data.Infrastructure.Mobile Cellular Subscriptions'];
            } else if (d.Country === country2) {
                processedData[year][country2] = +d['Data.Infrastructure.Mobile Cellular Subscriptions'];
            }
        }
    });

    return Object.values(processedData);
  }

});


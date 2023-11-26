const margin2 = { top: 40, right: 40, bottom: 40, left: 60 };
const width2 = 960 - margin2.left - margin2.right;
const height2 = 600 - margin2.top - margin2.bottom;

let globalDevelopmentData2;
let selectedCountries2 = [];
let selectedAttributes2 = [
  'Data.Health.Birth Rate',
  'Data.Health.Death Rate',
  'Data.Health.Fertility Rate',
  'Data.Health.Life Expectancy at Birth, Female',
  'Data.Health.Life Expectancy at Birth, Male',
  'Data.Health.Life Expectancy at Birth, Total',
  'Data.Health.Population Growth',
  'Data.Health.Total Population',
  'Data.Infrastructure.Mobile Cellular Subscriptions',
  'Data.Infrastructure.Mobile Cellular Subscriptions per 100 People'
];
let selectedRegions2 = [];
let selectedXAttribute2 = 'Data.Infrastructure.Mobile Cellular Subscriptions per 100 People';
let selectedSizeAttribute2 = 'Data.Health.Total Population';
let selectedYear2 = 2000;
let isPlaying2 = false;
let speed2 = 1;

let heatmapColor;

const svg2 = d3.select("#beeswarm-svg-2")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

const tooltip2 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let xScale2, sizeScale2;

function initializeControls2() {
    const attributeSelectors = [d3.select("#size-attribute-selector-2")]; // d3.select("#x-attribute-selector-2"),
    attributeSelectors.forEach(selector => {
        selector.selectAll("option")
            .data(selectedAttributes2)
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);
    });

    selectedXAttribute2 = selectedXAttribute2 || selectedAttributes2[0];
    selectedSizeAttribute2 = selectedSizeAttribute2 || selectedAttributes2[1];

    // d3.select("#x-attribute-selector-2").on("change", function() {
    //     selectedXAttribute2 = d3.select(this).property("value");
    //     updateChart2();
    // });

    d3.select("#size-attribute-selector-2").on("change", function() {
        selectedSizeAttribute2 = d3.select(this).property("value");
        updateChart2();
    });

    // d3.select("#year-input-2").on("change", function() {
    //     selectedYear2 = +d3.select(this).property("value");
    //     updateChart2();
    // });

    d3.select("#regions-selector-2").on("change", function() {
        let selectedRegion = d3.select(this).property("value");
        selectedRegions2 = selectedRegion ? [selectedRegion] : [];
        updateChart2();
    });

    document.getElementById("regions-selector-2").style.display = "none";
    document.getElementById("select-all-regions-2").style.display = "none";
    document.getElementById("deselect-all-regions-2").style.display = "none";

    // d3.select("#year-range-2").on("change", function() {
    //     speed2 = d3.select(this).property("value");
    // });

    // d3.select("#play-pause-button-2").on("click", togglePlayPause2);
}

function updateScales2(filteredData2) {
    xScale2 = d3.scaleLinear()
        .domain(d3.extent(filteredData2, d => d[selectedXAttribute2]))
        .range([0, width2]);

    sizeScale2 = d3.scaleSqrt()
        .domain([0, d3.max(filteredData2, d => d[selectedSizeAttribute2])])
        .range([1, 20]);
}

function showTooltip2(event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(`Country: ${event.Country}<br/>${selectedXAttribute}: ${event[selectedXAttribute]}<br/>${selectedSizeAttribute}: ${event[selectedSizeAttribute]}`)
        .style("left", (d3.event.pageX + 10) + "px")  // adjusts X position
        .style("top", (d3.event.pageY - 15) + "px"); // Adjust Y position
}

function moveTooltip2(event) {
    tooltip.style("left", (d3.event.pageX + 10) + "px")  // Adjust X position
          .style("top", (d3.event.pageY - 15) + "px"); // Adjust y position
}


function hideTooltip2() {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

function drawBeeswarm2(data) {
    simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(d => xScale2(d[selectedXAttribute2])).strength(1))
        .force("y", d3.forceY(height2 / 2))
        .force("collide", d3.forceCollide(d => sizeScale2(d[selectedSizeAttribute2]) / 2))
        .on("tick", ticked);

    const circles = svg2.selectAll("circle")
        .data(data);

    circles.enter().append("circle")
        .attr("r", d => sizeScale2(d[selectedSizeAttribute2]) / 2)
        .style("fill", "purple")
        .on("mouseover", showTooltip2)
        .on("mousemove", moveTooltip2)
        .on("mouseout", hideTooltip2)
        .merge(circles)
        .attr("r", d => sizeScale2(d[selectedSizeAttribute2]) / 2)
        .style("fill", "purple");

    circles
        .attr("r", d => sizeScale2(d[selectedSizeAttribute2]) / 2)
        .style("fill", "purple");

    circles.exit().remove();

    function ticked() {
        circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    simulation.alpha(1).restart();
}

function drawHeatmap(data) {
    heatmapColor = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, d3.max(data, function (d) { return d.density; })]);

    const heatmap = svg2.selectAll(".heatmap-rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "heatmap-rect")
        .attr("x", d => xScale2(d[selectedXAttribute2]))
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", height2)
        .style("fill", d => heatmapColor(d.density));
}

function calculateDensity(d, data, xScale, radius) {
    let count = 0;
    const xValue = xScale(d[selectedXAttribute2]);

    data.forEach(point => {
        const xPoint = xScale(point[selectedXAttribute2]);
        if (Math.abs(xValue - xPoint) <= radius) {
            count += 1;
        }
    });

    return count;
}

function drawColorLegend() {
    const legendWidth = 300, legendHeight = 20;
    const legendMargin = { top: 10, right: 60, bottom: 10, left: 60 };

    const linearGradient = svg2.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient");

    const numStops = 10;
    const colorRange = d3.range(numStops).map(d => d / (numStops - 1));
    linearGradient.selectAll("stop")
        .data(colorRange)
        .enter().append("stop")
        .attr("offset", d => d)
        .attr("stop-color", d => d3.interpolateInferno(d));

    const legend = svg2.append("g")
        .attr("class", "color-legend")
        .attr("transform", `translate(${width2 - legendWidth - legendMargin.right}, ${height2 - legendHeight - legendMargin.bottom})`);

    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#linear-gradient)");

    legend.append("text")
    .attr("x", 0)
    .attr("y", legendHeight + legendMargin.bottom)
    .style("fill", "purple")
    .text("Low Density");

    legend.append("text")
    .attr("x", legendWidth)
    .attr("y", legendHeight + legendMargin.bottom)
    .attr("text-anchor", "end")
    .style("fill", "purple")
    .text("High Density");
}


function updateChart2() {
    let filteredData2 = globalDevelopmentData2.filter(d => d.Year === selectedYear2 && (selectedRegions2.length === 0 || selectedRegions2.includes(d.Region)));

    updateScales2(filteredData2);

    filteredData2.forEach(d => {
        d.density = calculateDensity(d, filteredData2, xScale2, 50);
    });

    drawHeatmap(filteredData2);
    drawBeeswarm2(filteredData2);

    drawColorLegend();
}


// function updateChart2() {
//     let filteredData2 = globalDevelopmentData2.filter(d => d.Year === selectedYear2 && (selectedRegions2.length === 0 || selectedRegions2.includes(d.Region)));

//     updateScales2(filteredData2);

//     const xAxisGroup = svg2.selectAll(".x-axis")
//       .data([0]);

//     const xAxis = d3.axisBottom(xScale2);

//     xAxisGroup.enter()
//       .append("g")
//       .attr("class", "x-axis")
//       .attr("transform", `translate(0, ${height2})`)
//       .call(xAxis)
//       .merge(xAxisGroup)
//       .call(xAxis);

//     drawBeeswarm2(filteredData2);
// }

function sleep2(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// async function runSimulation2() {
//     let virtualYear = 1960;
//     while(isPlaying2 && virtualYear <= 2013) {
//         selectedYear2 = virtualYear;
//         d3.select("#year-input-2").property("value", selectedYear2);
//         updateChart2();
//         await sleep2(-100*speed2 + 1100);
//         virtualYear = virtualYear + 1;
//     }
//     return
// }

// async function togglePlayPause2() {
//     isPlaying2 = !isPlaying2;
//     d3.select("#play-pause-button-2").text(isPlaying2 ? "Pause" : "Play");

//     await runSimulation2();
//     updateChart2()
// }

function populateRegionDropdown2(regions) {
  const regionDropdown = d3.select("#regions-selector-2");

  regionDropdown.selectAll("option")
      .data(regions)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);
}

d3.csv("./data/countries_regions.csv").then((data) => {
  let uniqueRegions = [...new Set(data.map(d => d['World bank region']))];

  populateRegionDropdown2(uniqueRegions);

  d3.csv("./data/filtered_global_development.csv").then((globalData) => {
      globalDevelopmentData2 = globalData.map(d => {
          d.Year = +d.Year;
          for (let prop in d) {
              if (!isNaN(+d[prop]) && d[prop] !== '') {
                  d[prop] = +d[prop];
              }
          }
          return d;
      });
      initializeControls2();
      updateChart2();
      setTimeout(function() {
        updateChart2();
      }, 100);
  });
});
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
let selectedXAttribute2 = 'Data.Health.Life Expectancy at Birth, Total';
let selectedSizeAttribute2 = 'Data.Health.Total Population';
let selectedYear2 = 2000;
let isPlaying2 = false;
let speed2 = 1;

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
    const attributeSelectors = [d3.select("#x-attribute-selector-2"), d3.select("#size-attribute-selector-2")];
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

    d3.select("#x-attribute-selector-2").on("change", function() {
        selectedXAttribute2 = d3.select(this).property("value");
        updateChart2();
    });

    d3.select("#size-attribute-selector-2").on("change", function() {
        selectedSizeAttribute2 = d3.select(this).property("value");
        updateChart2();
    });

    d3.select("#year-input-2").on("change", function() {
        selectedYear2 = +d3.select(this).property("value");
        updateChart2();
    });

    d3.select("#regions-selector-2").on("change", function() {
        let selectedRegion = d3.select(this).property("value");
        selectedRegions2 = selectedRegion ? [selectedRegion] : [];
        updateChart2();
    });

    document.getElementById("regions-selector-2").style.display = "none";
    document.getElementById("select-all-regions-2").style.display = "none";
    document.getElementById("deselect-all-regions-2").style.display = "none";

    d3.select("#year-range-2").on("change", function() {
        speed2 = d3.select(this).property("value");
    });

    d3.select("#play-pause-button-2").on("click", togglePlayPause2);
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
    tooltip.html(`Country: ${event.Country}<br/>${selectedXAttribute2}: ${event[selectedXAttribute2]}<br/>${selectedSizeAttribute2}: ${event[selectedSizeAttribute2]}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function moveTooltip2(event) {
    tooltip.style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
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
        .style("fill", "magenta")
        .on("mouseover", showTooltip2)
        .on("mousemove", moveTooltip2)
        .on("mouseout", hideTooltip2)
        .merge(circles)
        .attr("r", d => sizeScale2(d[selectedSizeAttribute2]) / 2)
        .style("fill", "magenta");

    circles
        .attr("r", d => sizeScale2(d[selectedSizeAttribute2]) / 2)
        .style("fill", "magenta");

    circles.exit().remove();

    function ticked() {
        circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    simulation.alpha(1).restart();
}

function updateChart2() {
    let filteredData2 = globalDevelopmentData2.filter(d => d.Year === selectedYear2 && (selectedRegions2.length === 0 || selectedRegions2.includes(d.Region)));

    updateScales2(filteredData2);

    const xAxisGroup = svg2.selectAll(".x-axis")
      .data([0]);

    const xAxis = d3.axisBottom(xScale2);

    xAxisGroup.enter()
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height2})`)
      .call(xAxis)
      .merge(xAxisGroup)
      .call(xAxis);

    drawBeeswarm2(filteredData2);
}

function sleep2(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSimulation2() {
    let virtualYear = 1960;
    while(isPlaying2 && virtualYear <= 2013) {
        selectedYear2 = virtualYear;
        d3.select("#year-input-2").property("value", selectedYear2);
        updateChart2();
        await sleep2(-100*speed2 + 1100);
        virtualYear = virtualYear + 1;
    }
    return
}

async function togglePlayPause2() {
    isPlaying2 = !isPlaying2;
    d3.select("#play-pause-button-2").text(isPlaying2 ? "Pause" : "Play");

    await runSimulation2();
    updateChart2()
}

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
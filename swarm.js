const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

let globalDevelopmentData;
let selectedCountries = [];
let selectedAttributes = [
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
let selectedRegions = [];
let selectedXAttribute = 'Data.Infrastructure.Mobile Cellular Subscriptions';
let selectedSizeAttribute = 'Data.Health.Total Population';
let selectedYear = 2000;
let isPlaying = false;
let speed = 1;

const svg = d3.select("#beeswarm-svg")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let xScale, sizeScale;

function initializeControls() {
    const attributeSelectors = [d3.select("#size-attribute-selector")]; // d3.select("#x-attribute-selector"),
    attributeSelectors.forEach(selector => {
        selector.selectAll("option")
            .data(selectedAttributes)
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);
    });

    selectedXAttribute = selectedXAttribute || selectedAttributes[0];
    selectedSizeAttribute = selectedSizeAttribute || selectedAttributes[1];

    // d3.select("#x-attribute-selector").on("change", function() {
    //     selectedXAttribute = d3.select(this).property("value");
    //     updateChart();
    // });

    d3.select("#size-attribute-selector").on("change", function() {
        selectedSizeAttribute = d3.select(this).property("value");
        updateChart();
    });

    d3.select("#year-input").on("change", function() {
        selectedYear = +d3.select(this).property("value");
        updateChart();
    });

    d3.select("#regions-selector").on("change", function() {
        let selectedRegion = d3.select(this).property("value");
        selectedRegions = selectedRegion ? [selectedRegion] : [];
        updateChart();
    });

    document.getElementById("regions-selector").style.display = "none";
    document.getElementById("select-all-regions").style.display = "none";
    document.getElementById("deselect-all-regions").style.display = "none";

    d3.select("#year-range").on("change", function() {
        speed = d3.select(this).property("value");
    });

    d3.select("#play-pause-button").on("click", togglePlayPause);
}

function updateScales(filteredData) {
    xScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d[selectedXAttribute]))
        .range([0, width]);

    sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(filteredData, d => d[selectedSizeAttribute])])
        .range([1, 20]);
}

function showTooltip(event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(`Country: ${event.Country}<br/>${selectedXAttribute}: ${event[selectedXAttribute]}<br/>${selectedSizeAttribute}: ${event[selectedSizeAttribute]}`)
        .style("left", (d3.event.pageX + 10) + "px")  // Adjust X position
        .style("top", (d3.event.pageY - 15) + "px"); // Adjust Y position
}

function moveTooltip(event) {
    tooltip.style("left", (d3.event.pageX + 10) + "px")  // Adjust X position
          .style("top", (d3.event.pageY - 15) + "px"); // Adjust Y position
}

function hideTooltip() {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

function drawBeeswarm(data) {
    simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(d => xScale(d[selectedXAttribute])).strength(1))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(d => sizeScale(d[selectedSizeAttribute]) / 2))
        .on("tick", ticked);

    const circles = svg.selectAll("circle")
        .data(data);

    circles.enter().append("circle")
        .attr("r", d => sizeScale(d[selectedSizeAttribute]) / 2)
        .style("fill", "red")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .merge(circles)
        .attr("r", d => sizeScale(d[selectedSizeAttribute]) / 2)
        .style("fill", "red");

    circles
        .attr("r", d => sizeScale(d[selectedSizeAttribute]) / 2)
        .style("fill", "red");

    circles.exit().remove();

    function ticked() {
        circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    simulation.alpha(1).restart();
}

function updateChart() {
    let filteredData = globalDevelopmentData.filter(d => d.Year === selectedYear && (selectedRegions.length === 0 || selectedRegions.includes(d.Region)));

    updateScales(filteredData);

    const xAxisGroup = svg.selectAll(".x-axis")
      .data([0]);

    const xAxis = d3.axisBottom(xScale);

    xAxisGroup.enter()
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .merge(xAxisGroup)
      .call(xAxis);

    drawBeeswarm(filteredData);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSimulation() {
    let virtualYear = 1960;
    while(isPlaying && virtualYear <= 2013) {
        selectedYear = virtualYear;
        d3.select("#year-input").property("value", selectedYear);
        updateChart();
        await sleep(-100*speed + 1100);
        virtualYear = virtualYear + 1;
    }
    return
}

async function togglePlayPause() {
    isPlaying = !isPlaying;
    d3.select("#play-pause-button").text(isPlaying ? "Pause" : "Play");

    await runSimulation();
    updateChart()
}

function populateRegionDropdown(regions) {
  const regionDropdown = d3.select("#regions-selector");

  regionDropdown.selectAll("option")
      .data(regions)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);
}

d3.csv("./data/countries_regions.csv").then((data) => {
  let uniqueRegions = [...new Set(data.map(d => d['World bank region']))];

  populateRegionDropdown(uniqueRegions);

  d3.csv("./data/filtered_global_development.csv").then((globalData) => {
      globalDevelopmentData = globalData.map(d => {
          d.Year = +d.Year;
          for (let prop in d) {
              if (!isNaN(+d[prop]) && d[prop] !== '') {
                  d[prop] = +d[prop];
              }
          }
          return d;
      });
      initializeControls();
      updateChart();
      setTimeout(function() {
        updateChart();
      }, 100);
  });
});
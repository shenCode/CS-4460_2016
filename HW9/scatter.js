var margin = {top: 50, right: 0, bottom: 30, left: 0};
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// pre-cursors
var sizeForCircle = function(d) {
  // TODO: modify the size
  return 10 * d["Serving Size Weight"];
}

// setup x
var xValue = function(d) { return d.Sugars;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.Calories;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var baryScale = d3.scale.ordinal().rangeRoundBands([0, height], .5),
    baryAxis = d3.svg.axis().scale(baryScale).orient("left");

var barxScale = d3.scale.linear().range([200, width]),
    barxAxis = d3.svg.axis().scale(barxScale).orient("bottom");

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select(".scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var barchart = d3.select(".barchart").append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("cereal.csv", function(error, data) {

  // change string (from CSV) into number format
  var manufacturers = {};
  var counter = {};
  data.forEach(function(d) {
    d.Sugars = +d.Sugars;
    d.Calories = +d.Calories;
    if (!manufacturers[d.Manufacturer]) {
       manufacturers[d.Manufacturer] = d.Calories;
       counter[d.Manufacturer] = 1;
    } else {
        manufacturers[d.Manufacturer] += d.Calories;
        counter[d.Manufacturer] += 1;
    }
  });

  var each;
  var names = [];
  for (each in manufacturers) {
    manufacturers[each] /= counter[each];
    names.push({Manufacturer: each, avgCal: manufacturers[each]});
      
  }

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Sugars");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Calories");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {

          // TODO: show the tool tip
          tooltip.style("opacity", 1);

          // TODO: fill to the tool tip with the appropriate data
          tooltip.html("Name: " + d["Cereal Name"] 
            + "</br>" + "Calories: " + d.Calories
            + "</br>" + "Sugars: " + d.Sugars)
          // TODO: update text in our custom nutrition label
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
          // TODO: expand all nodes with the same manufacturer

      })
      .on("mouseout", function(d) {
          // TODO: hide the tooltip
          tooltip.style("opacity", 0);
          // TODO: resize the nodes

      })
      .on("click", function(d) {
        barchart.selectAll('.bar').transition().duration(500).attr('fill', function(e) {
          if (e.avgCal >= manufacturers[d.Manufacturer]) {
            return 'blue';
          } else return 'red';
        })
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(function(d) { return d;});

  baryScale.domain(names.map(function(d) { return d.Manufacturer;}));
  barxScale.domain([0, d3.max(names, function(d) {return d.avgCal;})]);

  // x-axis
  barchart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(barxAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Avg Calories");

  // y-axis
    barchart.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .attr("transform", "translate(200,0)")
      .call(baryAxis)
    .append("text")
      .attr("class", "label")
      .attr("y", 0)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Manufracturer");
  var bar = barchart.selectAll('.bar')
  .data(names)
  .enter()
  .append('g')
  .append('rect')
  .attr('class', 'bar')
  .attr('x', function(d) {return (barxScale(0.0));})
  .attr('y', function(d) {
    console.log(baryScale(d.Manufacturer));
    return baryScale(d.Manufacturer);
  })
  .attr('width', function(d) {
    return barxScale(d.avgCal-75);
  })
  .attr('height', function(d) {
    return baryScale.rangeBand();
  })
  .attr('fill', function(d) {return 'white'})
  .on('click', function(d) {
    d3.selectAll(".dot").transition().duration(500)
    .attr("opacity", function(e) {
      if (e["Manufacturer"] != d["Manufacturer"]) {
        return 0.25;
      } else return 1;
      
    });
  });
});
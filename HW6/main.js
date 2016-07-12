window.onload = start;

function start() {
    var graph = document.getElementById('graph');

    var width = 900;
    var height = 600;

    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(70, 0)');

    var bars = svg.append('g');

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], 0.5);
    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

    d3.csv('Courses.csv', preProcess, function(error, data) {
        if (error) throw error;

        xScale.domain([0.0, d3.max(data, function(d) { return d.GPA+0.5; })]);
        yScale.domain(data.map(function(d) { return d.yLabel; }));

        bars.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        bars.append('g')
            .attr('class', 'x axis')
            .call(xAxis);
            console.log(height);

        bars.append('g')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', function(d) {
                return yScale(d.yLabel);
            })
            .attr('width', function(d) {
                return xScale(d.GPA);
            })
            .attr('height', function(d) {
                return yScale.rangeBand();
            });

        gpa = 0.0;
        current = "";
        var selection = document.getElementById('selection');
        var repeat = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].Department != repeat) {
                var option = document.createElement('option');
                option.text = data[i].Department;
                repeat = data[i].Department;
                selection.add(option);
            }
        }
        current = "notSelected";
        selection.onchange = function() {
            current = this.value;
            console.log(current);
            gpa = document.getElementById('inputGPA').value;
            d3.select(graph).selectAll('.bar')
            .filter(function(d) {
                if (current === "notSelected" && gpa != "") {
                    console.log("1, both null");
                    return (d.GPA < gpa);
                } else if (gpa === "") {
                    console.log("2, gpa null");
                    return (d.Department != current);
                } else {
                    console.log("3, both have values");
                    return (d.GPA < gpa && d.Department != current || d.Department != current);
                }
            })
            .transition()
            .attr("width", 0)
            .delay(function (d) {
                return Math.random()*500+500;
            })
            .duration(function(d) {
                return Math.random()*500+500;
            }); // Hide all that is not chosen

            d3.select(graph).selectAll('.bar')
            .filter(function(d) {
                if (current === "notSelected") {
                    console.log("4, both null");
                    return (d.GPA >= gpa);
                } else if (gpa === "") {
                    console.log("5, gpa null");
                    return (d.Department === current);
                } else {
                    console.log("6, both have values");
                    return (d.Department === current && d.GPA >= gpa);
                }
            })
            .transition()
            .attr("width", function (d) {
                return xScale(d.GPA);
            })
            .delay(function (d) {
                return Math.random()*500+500;
            })
            .duration(function(d) {
                return Math.random()*500+500;
            });
        }
        gpaText = document.getElementById("submit");
        gpaText.onclick=function() {
            gpa = document.getElementById('inputGPA').value;
            d3.select(graph).selectAll('.bar')
            .filter(function(d) {
                if (current === "notSelected" && gpa != "") {
                    return (d.GPA < gpa);
                } else if (gpa === "") {
                    return (d.Department != current);
                } else {
                    return (d.GPA < gpa && d.Department != current || d.Department != current);
                }
            })
            .transition()
            .attr("width", 0)
            .delay(function (d) {
                return Math.random()*500+500;
            })
            .duration(function(d) {
                return Math.random()*500+500;
            }); // Hide all that is not chosen

            d3.select(graph).selectAll('.bar')
            .filter(function(d) {
                if (current === "notSelected") {
                    return (d.GPA >= gpa);
                } else if (gpa === "") {
                    return (d.Department === current);
                } else {
                    return (d.Department === current && d.GPA >= gpa);
                }
            })
            .transition()
            .attr("width", function (d) {
                return xScale(d.GPA);
            })
            .delay(function (d) {
                return Math.random()*500+500;
            })
            .duration(function(d) {
                return Math.random()*500+500;
            });
        }
    });
}

function preProcess(d) {
    d.yLabel = d.Department + d['Course Number'];
    d.GPA = +d.GPA;
    if (d.GPA < 0 || d.GPA > 4.0) {
        d.GPA = 0;
    }
    return d;
}
const margin = { left: 50, right: 30, top: 20, bottom: 50 };
const width = 550 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const xLabel = 'Time';
const yLabel = 'Humans';
var data = replaceAll(inputData, '&quot;', '"')
var json = JSON.parse(data);
var dateFrom = new Date(Date.now())
var dateTo = new Date(Date.now())

const svg = d3.select('#graph1');
const svg2 = d3.select('#graph2');

var dataset = [];
json.data.forEach((el, i) => {
    dataset.push({"x": new Date(el.Time), "y": el.Value}); // Skal laves om!!!
});


var line = d3.line()
    .x(function(d) { return x(d.x); }) // set the x values for the line generator
    .y(function(d) { return y(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

//Define the x-axis:
var x = d3.scaleTime()
    .domain([dateFrom.setHours(dateFrom.getHours() - 6), dateTo.setHours(dateTo.getHours() + 2)])
    .range([20, width - 50])
    .nice()

//define the y-axis:
var y = d3.scaleLinear()
    .domain([0, 650])
    .range([height - 40, 50])
    .nice()

constructGraph(svg, dataset);
constructGraph(svg2, dataset);

function constructGraph(object, data){
    object.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + 26 + ',0)')
        .call(y.axis = d3.axisLeft().scale(y))

    object.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(6,' + (height- 40)  + ')')
        .call(x.axis = d3.axisBottom().scale(x))

    object.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height)
        .text(xLabel);

    object.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", 80)
        .attr("y", 45)
        .text(yLabel);


    object.append("path")
        .attr("d", line(data))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    object.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('fill-opacity', 0.7)
        .attr('fill', 'blue')
        .attr('r', 3);
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
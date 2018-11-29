const margin = { left: 50, right: 30, top: 20, bottom: 50 };
const width = 550 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const xLabel = 'Time';
const yLabel = 'Humans';
var dateFrom = new Date(Date.now())
var dateTo = new Date(Date.now())

var data = replaceAll(humanData, '&quot;', '"')
var json = JSON.parse(data);
var tempdata = replaceAll(tempData, '&quot;', '"')
var tjson = JSON.parse(tempdata);
var humdata = replaceAll(humData, '&quot;', '"')
var hjson = JSON.parse(humdata);

const svg = d3.select('#graph1');
const svg2 = d3.select('#graph2');
const svg3 = d3.select('#graph3');

var dataset = [];
json.data.forEach((el, i) => {
    dataset.push({"x": new Date(el.Time), "y": el.Value}); // Skal laves om!!!
});
var tempdataset = [];
tjson.data.forEach((el, i) => {
    tempdataset.push({"x": new Date(el.Time), "y": el.Value}); // Skal laves om!!!
});
var humdataset = [];
hjson.data.forEach((el, i) => {
    humdataset.push({"x": new Date(el.Time), "y": el.Value}); // Skal laves om!!!
});


var line = d3.line()
    .x(function(d) { return x(d.x); }) // set the x values for the line generator
    .y(function(d) { return y(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

//Define the x-axis:
var x = d3.scaleTime()
    //.domain([dateFrom.setHours(dateFrom.getHours() - 6), dateTo.setHours(dateTo.getHours() + 2)])
    .domain([dateFrom.setMinutes(dateFrom.getMinutes() - 180), dateTo.setMinutes(dateTo.getMinutes() + 120)])
    .range([20, width - 50])
    .nice()

//define the y-axis:
var y = d3.scaleLinear()
    .domain([0, 50])
    .range([height - 40, 50])
    .nice()

constructGraph(svg, dataset, 'Time', 'Humans');
constructGraph(svg2, tempdataset, 'Time', 'Temperature');
constructGraph(svg3, humdataset, 'Time', 'Humidity');

function constructGraph(object, data, xlabel, ylabel){
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
        .text(xlabel);

    object.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", 80)
        .attr("y", 45)
        .text(ylabel);


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
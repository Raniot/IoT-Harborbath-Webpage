const margin = { left: 50, right: 30, top: 20, bottom: 50 };
const width = 550 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;
const svg = d3.select('#graph1');
const svg2 = d3.select('#graph2');
const svg3 = d3.select('#graph3');
const timeFormat = d3.timeFormat("%H:%M");
var dateFrom = new Date(Date.now())
var dateTo = new Date(Date.now())


var data = replaceAll(humanData, '&quot;', '"')
var tempdata = replaceAll(tempData, '&quot;', '"')
var humdata = replaceAll(humData, '&quot;', '"')

var humandataset = [];
var humdataset = [];
var tempdataset = [];

toArray(humandataset, JSON.parse(data));
toArray(humdataset, JSON.parse(humdata));
toArray(tempdataset, JSON.parse(tempdata));

const xLabel = 'Time';
var xAxisDomain = [dateFrom.setMinutes(dateFrom.getMinutes() - 120), dateTo.setMinutes(dateTo.getMinutes() + 60)];
constructGraph(svg, humandataset, xLabel, 'Humans', xAxisDomain, [0, 50], true);
constructGraph(svg2, tempdataset, xLabel, 'Temperature', xAxisDomain, [0, 50]);
constructGraph(svg3, humdataset, xLabel, 'Humidity', xAxisDomain, [0, 100]);

function constructGraph(object, data, xlabel, ylabel, xDomain, yDomain, humans = false){
    //Define the x-axis:
    var x = d3.scaleTime()
        .domain(xDomain)
        .range([20, width - 50])
        .nice()

    //define the y-axis:
    var y = d3.scaleLinear()
        .domain(yDomain)
        .range([height - 40, 50])
        .nice()

    var line = d3.line()
        .x(function(d) { return x(d.x); }) // set the x values for the line generator
        .y(function(d) { return y(d.y); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var div = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

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
        .attr("d", line(data.filter((d) => {
            return d.x <= new Date(Date.now());
        })))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    
    if(humans == true) {
        object.append("path")
        .attr("d", line(data.slice(data.length - 2)))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .style("stroke-dasharray", "4,4");
    }

    object
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('stroke-width', '20px')
        .attr('stroke', 'rgba(0,0,0,0)')
        .style('cursor', 'pointer')
        .on('mouseover', d => {
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          div
            .html(ylabel + ": " + (humans ? d.y : parseFloat(d.y).toFixed(2)) + "<br\>" + xlabel + ": " + timeFormat(d.x))
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', () => {
          div
            .transition()
            .duration(500)
            .style('opacity', 0);
        });
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function toArray(array, json) {
    json.data.forEach((element) => {
        array.push({"x": new Date(element.Time), "y": element.Value});
    })
}
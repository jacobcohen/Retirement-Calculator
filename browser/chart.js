import React, { Component } from 'react';
import d3 from 'd3';


export default class Chart extends Component {

    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(newProps){
        console.log('new PROPS')
        console.log(newProps.data)
        //this.componentDidMount();
    }

    componentDidMount() {

        let data1=this.props.data;
        let data2=this.props.data2;


        let margin = {top: 30, right: 20, bottom: 30, left: 100},
            width = 1600 - margin.left - margin.right,
            height = 270 - margin.top - margin.bottom;

        // Parse the date / time
        let parseDate = d3.time.format('%d-%b-%Y').parse;

        // Set the ranges
        let x = d3.time.scale().range([0, width]);
        let y = d3.scale.linear().range([height, 0]);

        // Define the axes
        let xAxis = d3.svg.axis().scale(x)
            .orient('bottom').ticks(8);

        let yAxis = d3.svg.axis().scale(y)
            .orient('left').ticks(8);

        let yAxis2 = d3.svg.axis().scale(y)
            .orient('right').ticks(8);

        // Define the line
        let valueline = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // Adds the svg canvas
        let svg = d3.select('#chartle')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

        // Get the data

        data1.forEach(function(d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(data1, function(d) { return d.date; }));
        y.domain([0, d3.max(data1, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append('path')
            .attr('class', 'line')
            .attr('d', valueline(data1));

        // Add the X Axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // Add the Y Axis
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        // Add the Y Axis
        svg.append('g')
            .attr('class', 'y axis2')
            .call(yAxis2);

        let inter = setTimeout(function() {
            updateData();
        }, 2000);


// ** Update data section (Called from the onclick)
        function updateData() {

            // Get the new data
            data2.forEach(function(d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
            });

            // Scale the range of the data again
            x.domain(d3.extent(data2, function(d) { return d.date; }));
            y.domain([0, d3.max(data2, function(d) { return d.close; })]);

            // Select the section we want to apply our changes to
            //let svg1 = d3.select('body').transition();

            let svg1 = d3.select('body')
            // Make the changes
            svg1.select('.line')   // change the line
                .attr('d', valueline(data2));
            svg1.select('.x.axis') // change the x axis
                .call(xAxis);
            svg1.select('.y.axis') // change the y axis
                .call(yAxis);
            svg1.select('.y.axis2') // change the y axis
                .call(yAxis2);

        }

        //need x, y, valueLine, xAxis, yAxis
    }



    render () {

        return (
            <div>
                <div id='chartle'></div>
            </div>
        )

    }
}
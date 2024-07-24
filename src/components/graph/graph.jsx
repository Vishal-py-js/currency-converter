import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import "./graph.css"

function Graph({data1}) {
     
      const margin = { top: 20, right: 20, bottom: 40, left: 45 };
      const svgWidth = 800;
      const svgHeight = 400;
      const width = svgWidth - margin.left - margin.right;
      const height = svgHeight - margin.top - margin.bottom;
      
      useEffect(() => {
        const svg = d3.select('.graph-cont')
      svg.selectAll("*").remove()

      const graphArea = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      const x = d3
        .scaleBand()
        .rangeRound([0, width])
        .domain(data1.map((d) => d.name))
        .padding(0.4);
      
      const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([d3.min(data1, (d) => d.value) - 5, d3.max(data1, (d) => d.value) + 5])
        .nice();
      
      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y).ticks(5);
      
      graphArea
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
      
      graphArea.append("g").attr("class", "axis").call(yAxis);
      
      const rx = 12;
      const ry = 12;
      
      graphArea
        .selectAll("bar")
        .data(data1)
        .enter()
        .append("path")
        .style("fill", "whitesmoke")
        .attr(
          "d",
          (item) => `
              M${x(item.name)},${y(item.value) + ry}
              a${rx},${ry} 0 0 1 ${rx},${-ry}
              h${x.bandwidth() - 2 * rx}
              a${rx},${ry} 0 0 1 ${rx},${ry}
              v${height - y(item.value) - ry}
              h${-x.bandwidth()}Z
            `
        )
        .text(d => d.value)
      }, [data1])

    return (
        <svg className="graph-cont" width={800}/>
    )
}

export default Graph
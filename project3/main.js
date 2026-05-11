import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 1200;
const height = 600;

const svg = d3.select("#map");

const projection = d3.geoNaturalEarth1()
    .scale(220)
    .translate([width / 2, height / 2]);

const path = d3.geoPath(projection);

Promise.all([
    d3.json("data/world.geojson"),
    d3.csv("data/aerosol_globe.csv")
]).then(([world, data]) => {

    console.log(data[0]);

    // ===== 年份篩選 =====
    const filtered = data.filter(d => +d.year === 1850);

    // ===== Aerosol Layer =====
    svg.selectAll("rect")
        .data(filtered)
        .join("rect")

        .attr("x", d => {
            const coords = projection([+d.longitude, +d.latitude]);
            return coords ? coords[0] : null;
        })

        .attr("y", d => {
            const coords = projection([+d.longitude, +d.latitude]);
            return coords ? coords[1] : null;
        })

        .attr("width", 4)

        .attr("height", 4)

        .attr("fill", d => {

            const value = +d.aerosol;

            if (value < 0.05) return "#38f9ff";

            if (value < 0.1) return "#00e676";

            if (value < 0.15) return "#ffee00";

            if (value < 0.2) return "#ff9800";

            return "#ff0000";
        })

        .attr("opacity", 0.85);

    // ===== 世界國界 =====
    svg.selectAll("path")
        .data(world.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.2)
        .attr("vector-effect", "non-scaling-stroke");

});

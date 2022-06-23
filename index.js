const width = 800;
const height = 700;

const svg = d3
  .select('#svg_container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
).then((data) => {
  /*
    Doping: "Alleged drug use during 1995 due to high hematocrit levels"
    Name: "Marco Pantani"
    Nationality: "ITA"
    Place: 1
    Seconds: 2210
    Time: "36:50"
    URL: "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
    Year: 1995
  */

  const scaleX = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.year)])
    .range([0, width]);
  const xAxis = d3.axisBottom(scaleX);

  const scaleY = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
    .range([0, height]);
  const yAxis = d3.axisLeft(scaleY);

  svg
    .append('g')
    .attr('transform', `translate(0, ${height - 1})`)
    .call(xAxis);
  svg.append('g').call(yAxis);

  data.forEach((d) => {
    const parsed = d.Time.split(':');
    d.Time = new Date(d.Year, 0, 1, parsed[0], parsed[1]);
    console.log(d);
  });

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cy', (d) => d.Time)
    .attr('cx', (d) => d.Date)
    .attr('r', 6);
});

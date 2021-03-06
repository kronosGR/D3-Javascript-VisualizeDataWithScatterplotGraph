const width = 800;
const height = 700;

const svg = d3
  .select('#svg_container')
  .append('svg')
  .attr('width', width)
  .attr('height', height + 60);

const popup = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

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

  data.forEach((d) => {
    // console.log(d.Time);
    const parsed = d.Time.split(':');
    d.Time = new Date(2000, 0, 1, 0, parsed[0], parsed[1]);
  });

  const scaleX = d3
    .scaleLinear()
    .range([0, width])
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year)]);
  const xAxis = d3.axisBottom(scaleX).tickFormat(d3.format('d'));

  const scaleY = d3
    .scaleTime()
    .range([0, height])
    .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)]);
  const yAxis = d3.axisLeft(scaleY).tickFormat(d3.timeFormat('%M:%S'));

  svg
    .append('g')
    .attr('transform', `translate(60, ${height})`)
    .call(xAxis)
    .attr('id', 'x-axis');
  svg.append('g').attr('transform', 'translate(60,0)').call(yAxis).attr('id', 'y-axis');

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => scaleX(d.Year) + 60)
    .attr('cy', (d) => scaleY(d.Time))
    .attr('r', 6)
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => d.Time.toISOString())
    .on('mouseover', (e, d) => {
      const cords = d3.pointer(e);

      popup
        .attr('id', 'tooltip')
        .style('height', '30px')
        .style('width', 10)
        .style('opacity', 1)
        .style('top', cords[1] + 'px')
        .style('left', cords[0] + 'px')
        .attr('data-year', d.Year).html(` <b>${d.Name}</b>
          <p>Time: ${d.Time}</p>
          <p>Year: ${d.Year}</p>
      `);
    })
    .on('mouseout', () => {
      popup.style('opacity', 0);
    });

  // svg
  //   .selectAll('text')
  //   .data(data)
  //   .enter()
  //   .append('text')
  //   .attr('y', (d) => scaleY(d.Time) + 20)
  //   .attr('x', (d) => scaleX(d.Year))
  //   .text((d) => `${d.Year}, ${d.Time}`);

  const legend = svg.append('g').attr('id', 'legend');
});

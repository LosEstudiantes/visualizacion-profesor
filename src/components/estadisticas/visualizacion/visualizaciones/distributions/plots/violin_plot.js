import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

let g = null;

const roundHalf = num => (num <= 1.5 ? 1.5 : Math.round(num * 2) / 2);

const distribucion = (calificaciones, atributo) => {
	// Se usa estas escalas = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
	const dist = [0, 0, 0, 0, 0, 0, 0, 0];
	calificaciones.map(calificacion => {
		const value = roundHalf(calificacion[atributo]);
		dist[value * 2 - 3] += 1;
	});
	return dist;
};

class ViolinPlot extends Component {
	state = {
		margin: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 50
		},
		distributions: {
			height: 225,
			width_per_viz: 225,
			margin_between_viz: 40,
			duration_animation: 1300,
			height_per_block: 30
		},
		colors: {
			general: 'rgb(55, 126, 184)',
			nota: 'rgb(77, 175, 74)',
			dificultad: 'rgb(228, 26, 28)'
		}
	};

	componentDidMount() {
		this.renderViz(this.props);
	}

	shouldComponentUpdate(props) {
		this.renderViz(props);
		return false;
	}

	renderViz = props => {
		const { calificaciones } = props;
		const { height } = this.state.distributions;
		g = d3.select('#violin_plot');

		// Setup data
		const distribucion_general = distribucion(calificaciones, 'general').reverse();
		const distribucion_nota = distribucion(calificaciones, 'nota').reverse();
		const distribucion_dificultad = distribucion(calificaciones, 'dificultad').reverse();

		// Visualizacion
		const inicial1 = this.renderBars(distribucion_general, 0, 'general');
		const inicial2 = this.renderBars(distribucion_nota, 1, 'nota');
		const inicial3 = this.renderBars(distribucion_dificultad, 2, 'dificultad');

		// Escala Y:
		const yScale = d3
			.scaleLinear()
			.domain([5, 1.5])
			.range([0, height]);

		const yAxis = d3.axisLeft().scale(yScale);

		g
			.append('g')
			.attr('transform', `translate(${this.state.margin.left - 5}, 15)`)
			.call(yAxis);

		// Escala X:
		const xScale = d3
			.scaleOrdinal()
			.domain(['Calificación general del profesor', 'Nota obtenida por el estudiante', 'Dificultad'])
			.range([inicial1, inicial2, inicial3]);

		const xAxis = d3.axisBottom().scale(xScale);

		g
			.append('g')
			.attr('transform', 'translate(0,260)')
			.attr('id', 'x_axis_bottom')
			.call(xAxis)
			.selectAll('path')
			.attr('fill', 'none')
			.attr('stroke', 'transparent');

		g
			.selectAll('rect')
			.on('mouseover', (e, i) => {
				console.log(i);
				d3.selectAll(`#linea_bloque_${7 - i}`).attr('opacity', 1);
			})
			.on('mouseout', () => {
				d3.selectAll('.linea_bloque').attr('opacity', 0);
			});
	};

	renderBars = (distribucion, order, atributo) => {
		const { left } = this.state.margin;
		const { width_per_viz, margin_between_viz } = this.state.distributions;
		const xMax = d3.max(distribucion);
		const xScale = d3
			.scaleLinear()
			.domain([0, xMax])
			.range([0, width_per_viz]);

		let bars = g
			.append('g')
			.selectAll('rect')
			.data(distribucion);

		const barsE = bars.enter().append('rect');

		// La visualización arranca en:
		const inicial = left + order * (width_per_viz + margin_between_viz) + width_per_viz / 2;

		bars = bars
			.merge(barsE)
			.attr('x', inicial)
			.attr('y', (d, i) => i * 32)
			.attr('width', 0)
			.attr('height', 30)
			.attr('fill', this.state.colors[atributo])
			.transition()
			.duration(1300)
			.attr('x', c => inicial - xScale(c) / 2)
			.attr('width', c => xScale(c));

		return inicial;
	};

	render() {
		return <g id="violin_plot" />;
	}
}

const mapStateToProps = state => {
	return {
		calificaciones: state.profesor.posts
	};
};

export default connect(mapStateToProps, null)(ViolinPlot);

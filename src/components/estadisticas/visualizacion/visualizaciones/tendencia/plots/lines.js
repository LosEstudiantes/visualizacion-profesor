import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

let g = null;

const roundHalf = num => (num <= 1.5 ? 1.5 : Math.round(num * 2) / 2);

// Quita intersemestrales y 'otro' y añade atributo fecha para ordenar, luego los ordena por fecha
const organizarDatos = calificaciones => {
	calificaciones = calificaciones.filter(calificacion => {
		return calificacion.periodo !== 'otro' && calificacion.periodo !== 'intersemestral';
	});
	calificaciones.map(calificacion => {
		calificacion.fecha = +calificacion.periodo.split('-').join('');
		calificacion.general = roundHalf(calificacion.general);
		calificacion.nota = roundHalf(calificacion.nota);
		calificacion.dificultad = roundHalf(calificacion.dificultad);
	});
	calificaciones.sort((a, b) => a.fecha - b.fecha);
	return calificaciones;
};

const dominioDadosPeriodos = (periodoInicial, periodoFinal) => {
	if (periodoInicial === periodoFinal) {
		return [periodoInicial];
	}
	const anioInicial = +periodoInicial.split('-')[0];
	const anioFinal = +periodoFinal.split('-')[0];
	const semestreInicial = +periodoInicial.split('-')[1];
	const semestreFinal = +periodoFinal.split('-')[1];

	const periodos = [];
	for (let i = anioInicial; i <= anioFinal; i++) {
		if (i === anioInicial && semestreInicial === 20) {
			periodos.push(anioInicial + '-20');
		} else if (i === anioFinal && semestreFinal === 10) {
			periodos.push(anioFinal + '-10');
		} else {
			periodos.push(i + '-10');
			periodos.push(i + '-20');
		}
	}
	return periodos;
};

class LinesPlot extends Component {
	state = {
		margin: {
			top: 10,
			right: 0,
			bottom: 0,
			left: 50
		},
		distributions: {
			height: 225,
			width_per_viz: 70,
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
		let { calificaciones } = props;
		const { height, width_per_viz } = this.state.distributions;

		calificaciones = organizarDatos(calificaciones);
		g = d3.select('#lines_plot');

		const min_age = calificaciones[0].periodo;
		const max_age = calificaciones[calificaciones.length - 1].periodo;

		const dominioX = dominioDadosPeriodos(min_age, max_age);
		this.escalaPeriodoArray = d3
			.scaleOrdinal()
			.domain(dominioX)
			.range(dominioX.map((x, i) => i));

		this.escalaIndicePeriodo = d3
			.scaleOrdinal()
			.domain(dominioX.map((x, i) => i))
			.range(dominioX);

		this.xScale = d3
			.scaleOrdinal()
			.domain(dominioX)
			.range(dominioX.map((x, i) => this.state.margin.left + i * width_per_viz));

		this.yScale = d3
			.scaleLinear()
			.domain([5, 1.5])
			.range([this.state.margin.top, height]);

		this.renderLine(calificaciones, 'general');
		this.renderLine(calificaciones, 'dificultad');
		this.renderLine(calificaciones, 'nota');

		const xAxis = d3.axisBottom().scale(this.xScale);

		g
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			.attr('id', 'x_axis_line_bottom')
			.call(xAxis);

		const yAxis = d3.axisLeft().scale(this.yScale);

		g
			.append('g')
			.attr('transform', `translate(${this.state.margin.left}, 0)`)
			.call(yAxis);
	};

	calculateAvgValue = (array, initialPos) => {
		let previousKnownValue;
		let previousKnownIndex;
		for (let i = initialPos; i >= 0; i--) {
			if (typeof array[i] !== 'undefined') {
				previousKnownValue = array[i].promedio;
				previousKnownIndex = i;
				i = -1;
			}
		}

		let nextKnownValue;
		let nextKnownIndex;
		for (let i = initialPos; i < array.length; i++) {
			if (typeof array[i] !== 'undefined') {
				nextKnownValue = array[i].promedio;
				nextKnownIndex = i;
				i = array.length;
			}
		}

		const total_items = nextKnownIndex - previousKnownIndex;
		const value_for_each = Math.abs(nextKnownValue - previousKnownValue) / total_items;

		if (nextKnownValue > previousKnownValue) {
			return previousKnownValue + value_for_each * (initialPos - previousKnownIndex);
		}
		return previousKnownValue - value_for_each * (initialPos - previousKnownIndex);
	};

	renderLine = (calificaciones, atributo) => {
		// Poner las calificaciones en un array organizado por periodos:
		const calificaciones_por_periodo = [];
		calificaciones.map(calificacion => {
			const posicion = this.escalaPeriodoArray(calificacion.periodo);
			if (calificaciones_por_periodo[posicion]) {
				calificaciones_por_periodo[posicion].push(calificacion);
			} else {
				calificaciones_por_periodo[posicion] = [calificacion];
			}
		});

		// Calcular el promedio por periodo:
		const promedios_por_periodo = calificaciones_por_periodo.map(calificaciones => {
			const promedio = {};

			promedio.periodo = calificaciones[0].periodo;
			let suma = 0;
			calificaciones.map(calificacion => {
				suma += calificacion[atributo];
			});
			promedio.promedio = suma / calificaciones.length;

			return promedio;
		});

		for (let i = 0; i < promedios_por_periodo.length; i++) {
			const valor_actual = promedios_por_periodo[i];
			if (!valor_actual) {
				const valor = {};
				valor.periodo = this.escalaIndicePeriodo(i);
				valor.promedio = this.calculateAvgValue(promedios_por_periodo, i);
				promedios_por_periodo[i] = valor;
			}
		}

		const line = d3
			.line()
			.x(d => this.xScale(d.periodo))
			.y(d => this.yScale(d.promedio));

		g
			.append('path')
			.datum(promedios_por_periodo)
			.attr('fill', 'none')
			.attr('stroke', this.state.colors[atributo])
			.attr('stroke-width', 4)
			.attr('d', line);
	};

	render() {
		return <g id="lines_plot" />;
	}
}

const mapStateToProps = state => {
	return {
		calificaciones: state.profesor.posts
	};
};

export default connect(mapStateToProps, null)(LinesPlot);

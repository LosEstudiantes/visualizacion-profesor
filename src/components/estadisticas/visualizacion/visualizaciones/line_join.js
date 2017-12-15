import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

let g = null;

const roundHalf = num => (num <= 1.5 ? 1.5 : Math.round(num * 2) / 2);

const roundHalfAll = calificaciones => {
	return calificaciones.map(calificacion => {
		const { general, nota, dificultad } = calificacion;
		calificacion.general = roundHalf(general);
		calificacion.nota = roundHalf(nota);
		calificacion.dificultad = roundHalf(dificultad);
		return calificacion;
	});
};

class LineJoin extends Component {
	componentDidMount() {
		this.renderViz(this.props);
	}

	shouldComponentUpdate(props) {
		this.renderViz(props);
		return false;
	}

	renderViz = props => {
		let { calificaciones } = props;
		calificaciones = roundHalfAll(calificaciones);
		g = d3.select('#line_join');

		const valores_general = this.ponerValoresCorrespondientes(calificaciones, 'general');
		const valores_nota = this.ponerValoresCorrespondientes(calificaciones, 'nota');
		const valores_dificultad = this.ponerValoresCorrespondientes(calificaciones, 'dificultad');
		console.log(valores_general);

		const valores_general_reducidos = this.reducirValores(valores_general, 'nota');
		// const valores_nota_reducidos = this.reducirValores(valores_nota, 'dificultad');
		// const valores_dificultad_reducidos = this.reducirValores(valores_dificultad, 'nota');

		console.log(valores_general_reducidos);

		valores_general_reducidos.map((valores_bloque, indice) => {
			valores_bloque.map(calificacion => {
				this.renderLine1(calificacion, indice);
			});
		});
	};

	ponerValoresCorrespondientes = (calificaciones, atributo) => {
		const array = [[], [], [], [], [], [], [], []];

		calificaciones.map(calificacion => {
			for (let i = 3; i < 11; i++) {
				if (calificacion[atributo] * 2 === i) {
					calificacion.count = 1;
					array[i - 3].push(calificacion);
				}
			}
		});
		return array;
	};

	// Reduce los valores a que el atributo count tenga la cantidad que salen de ese bloque al 'atributo' (el cual puede ser nota o dificultad)
	reducirValores = (valoresCorrespondientes, atributo) => {
		valoresCorrespondientes = valoresCorrespondientes.map(valores => {
			const valores_final = [];
			for (let i = 0; i < valores.length; i++) {
				valores_final.map((actual, j) => {
					if (actual[atributo] === valores[i][atributo]) {
						valores_final[j].count += 1;
					}
				});
				valores_final.push(valores[i]);
			}
			return valores_final;
		});
		return valoresCorrespondientes;
	};

	// El siguiente es algo complicado.
	// Se hace un ciclo por las calificaciones
	// Luego se hace un ciclo entre los posibles valores de cada atributo y se va sumando a la cuenta en que la pareja de esos atributos existen
	procesarCalificaciones = (calificaciones, atributo1, atributo2) => {
		const array = [[], [], [], [], [], [], [], []];

		for (let i = 0; i < calificaciones.length; i++) {
			for (let j = 3; j < 11; j++) {
				for (let k = 3; k < 11; k++) {
					const cuenta_actual = array[j - 3][k - 3];
					if (!cuenta_actual) {
						array[j - 3][k - 3] = { count: 0, [atributo1]: j / 2, [atributo2]: k / 2 };
					}
					if (calificaciones[i][atributo1] * 2 === j && calificaciones[i][atributo2] * 2 === k) {
						array[j - 3][k - 3].count += 1;
						array[j - 3][k - 3].count += 1;
					}
				}
			}
		}
		return array;
	};

	renderLine1 = (calificacion, numero) => {
		const { height } = this.props.distributions;

		const datos = [];
		datos.push(calificacion.general);
		datos.push(calificacion.nota);
		datos.push(calificacion.dificultad);

		const xScale = d3
			.scaleLinear()
			.domain([0, 1, 2])
			.range([162.5, 427.5, 692.5]);

		const yScale = d3
			.scaleLinear()
			.domain([5, 1.5])
			.range([15, height + 15]);

		const line = d3
			.line()
			.x((d, i) => xScale(i))
			.y(d => yScale(d));

		g
			.append('path')
			.datum(datos)
			.attr('id', `linea_bloque_${numero}`)
			.attr('class', 'linea_bloque')
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-width', calificacion.count)
			.attr('opacity', 0)
			.attr('d', line);
	};

	render() {
		return <g id="line_join" />;
	}
}

const mapStateToProps = state => {
	return { calificaciones: state.profesor.posts };
};
export default connect(mapStateToProps, null)(LineJoin);

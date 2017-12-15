import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showEstadisticas } from '../ducks/profesor';
import Estadisticas from './estadisticas/estadisticas';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Estadisticas />
				<center>
					<header className="App-header">
						<h1 className="App-title">Bienvenido! </h1>
					</header>
					<p className="App-intro">
						Aquí encontrará las estadísticas de los profesores de LosEstudiantes.co
						<br />
						Es completamente Open Source y puede ver el{' '}
						<a href="https://github.com/LosEstudiantes/visualizacion-profesor">código aquí:</a>
						<br />
						<br />
						Anímese a cacharrearle lo que quiera al código y a hacer las contribuciones que quiera y a
						usar lo que ya esta en otros proyectos suyos sin pedir permiso
						<br />
						<br />
						-Fabio.
					</p>

					<div>
						<p>
							El objetivo de las estadísticas es que los estudiantes puedan ver fácilmente qué profesores
							son exigentes (y por lo tanto no se llevan el mejor promedio en calificaciones) pero la
							forma de la distribución es definida (aquellos que lograron su nivel de exigencia lo
							califican bien y aquellos que les fue mal en la materia o no lograron el nivel de exigencia
							del profesor, lo suelen calificar mal) Entonces tenemos una distribución en forma de
							campana invertida
						</p>
					</div>
					<button onClick={this.props.showEstadisticas.bind(null, 'profesor1')}>
						Mostrar Estadisticas Profesor 1 (Exigente)
					</button>
					<br />
					<br />
					<button onClick={this.props.showEstadisticas.bind(null, 'profesor2')}>
						Mostrar Estadisticas Profesor 2 (Normal)
					</button>
					<br />
					<br />
					<button onClick={this.props.showEstadisticas.bind(null, 'profesor3')}>
						Mostrar Estadisticas Profesor 3 (Fácil)
					</button>
				</center>
			</div>
		);
	}
}

export default connect(null, { showEstadisticas })(App);

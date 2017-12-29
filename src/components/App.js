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
							El objetivo de las estadísticas es darle merito a aquellos profesores que son exigentes y
							por lo tanto no se suelen llevar las mejores calificaciones (los estudiantes vagos los
							suelen calificar mal).
						</p>
						<p>
							La forma de reconocer a este tipo de profesores es con la distribución de las
							calificaciones. Los Estudiantes que son buenos y lograron el nivel del profesor lo suelen
							calificar bien. Los vagos lo suelen calificar mal. De esta forma tenemos una distribución
							de campana invertida, que es lo que se espera mostrar en las estadísticas.
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

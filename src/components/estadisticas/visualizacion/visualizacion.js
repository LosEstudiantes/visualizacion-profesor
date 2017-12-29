import React, { Component } from 'react';
import Distributions from './visualizaciones/distributions/distributions';
import Tendencia from './visualizaciones/tendencia/tendencia';

class Visualizacion extends Component {
	render() {
		return (
			<div>
				<Tendencia />
				<Distributions />
			</div>
		);
	}
}

export default Visualizacion;

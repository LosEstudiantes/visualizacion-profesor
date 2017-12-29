import React, { Component } from 'react';
import Line from './plots/lines';

class Visualizacion extends Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		const style = {
			width: 900,
			height: 300
		};

		const margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 50
		};

		const distributions = {
			height: 225,
			width_per_viz: 225,
			margin_between_viz: 40,
			duration_animation: 1300,
			height_per_block: 30
		};

		return (
			<svg id="tendencia_viz" style={style}>
				<Line margin={margin} distributions={distributions} />
			</svg>
		);
	}
}

export default Visualizacion;

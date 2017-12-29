import React, { Component } from 'react';
import ViolinPlot from './plots/violin_plot';
import LineJoin from './plots/line_join';

class Visualizacion extends Component {
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
			<svg id="estadisticas_profesor" style={style}>
				<ViolinPlot margin={margin} distributions={distributions} />
				<LineJoin margin={margin} distributions={distributions} />
			</svg>
		);
	}
}

export default Visualizacion;

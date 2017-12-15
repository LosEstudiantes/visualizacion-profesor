import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

// import { hideEstadisticas } from '../../../../ducks/profesor/ui/main';
import { hideEstadisticas } from '../../ducks/profesor';

import VisualizacionDinamica from './visualizacion/visualizacion';

class Estadisticas extends Component {
	render() {
		return (
			<Modal
				show={this.props.show}
				onHide={this.props.hideEstadisticas}
				className="estadisticas"
				bsSize="lg">
				<Modal.Header closeButton>
					<Modal.Title>Estadisticas</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<VisualizacionDinamica />
					<center>
						<p>Diciembre 15: intenten poner el mouse sobre la calificación general</p>
					</center>
					<center>
						Estas estadísiticas aún les falta trabajo, hoy Diciembre 11 hago el primer cambio, para el 4
						de Enero espero que ya estén completas
						<p>
							Entre los planes esta: poder comparar con otro profesor y ver como ha cambiado las
							calificaciones a lo largo del tiempo de un profesor.
						</p>
						<p />
						<p>
							La idea es que sean Open Source, de código abierto, para que cualquiera pueda ver como se
							hicieron y si quiere colaborar, muy bienvenido. Y para que si alguien quiere usarlas en
							algún otro proyecto, tenga la libertad de hacerlo.
						</p>
					</center>
				</Modal.Body>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		show: state.profesor.ui.main.estadisticas
	};
}

export default connect(mapStateToProps, { hideEstadisticas })(Estadisticas);

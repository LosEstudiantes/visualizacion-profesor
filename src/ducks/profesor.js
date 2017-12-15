import data from '../data/calificaciones.json';

const SHOW_ESTADISTICAS = 'SHOW_ESTADISTICAS';
const HIDE_ESTADISTICAS = 'HIDE_ESTADISTICAS';

export const showEstadisticas = profesor => ({
	type: SHOW_ESTADISTICAS,
	payload: data[profesor]
});

export const hideEstadisticas = () => ({
	type: HIDE_ESTADISTICAS
});

const INITIAL_STATE = {
	ui: {
		main: {
			estadisticas: false
		}
	},
	posts: []
};

export default function(state = INITIAL_STATE, action) {
	const { type, payload } = action;
	switch (type) {
		case SHOW_ESTADISTICAS:
			return { ...state, posts: payload, ui: { main: { estadisticas: true } } };
		case HIDE_ESTADISTICAS:
			return { ...state, ui: { main: { estadisticas: false } } };
		default:
			return state;
	}
}

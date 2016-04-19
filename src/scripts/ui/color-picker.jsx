import React from 'react'
import ColorPicker from 'react-color';

export class ColorPickerComponent extends React.Component {
	constructor(props) {
		super();
		this.state = {
			displayColorPicker: false,
			currentColorSet: props.defaultColorsSet,
		};
		this.handleChange = this.handleChange.bind(this);
		this.onColorChangeStart = this.onColorChangeStart.bind(this);
		this.onColorsSetChanged = this.onColorsSetChanged.bind(this);
	}

	handleChange(color) {
		console.log({
			initialColor: {	
				hex: this.state.initialColor,
				setName: this.state.currentColorSet
			}, 
			color: '#'+color.hex
		});
	}

	onColorChangeStart(color) {
		this.setState({displayColorPicker: true, initialColor: color});
	}

	onColorsSetChanged(setName) {
		this.setState({displayColorPicker: false, currentColorSet: setName});
	}

	componentDidMount() {
		notificationCenter.subscribeListener('pick-color-for', this.onColorChangeStart);
		notificationCenter.subscribeListener('on-color-set-change', this.onColorsSetChanged, 'cp-on-color-set-change');
	}

	componentWillUnmount() {
		notificationCenter.unsubscribeListener('pick-color-for', this.onColorChangeStart);
		notificationCenter.unsubscribeListener('on-color-set-change', this.onColorsSetChanged, 'cp-on-color-set-change');
	}


	render() {
		return (
			<div style={{display: this.state.displayColorPicker ? 'block' : 'none' }} >
				<ColorPicker color={this.state.initialColor} onChange={this.handleChange} type="chrome" />
			</div>
		);
	}
}

ColorPickerComponent.propTypes = {
	defaultColorsSet: React.PropTypes.string.isRequired
}
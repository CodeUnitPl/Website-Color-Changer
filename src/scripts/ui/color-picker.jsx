import React from 'react'
import ColorPicker from 'react-color';

export class ColorPickerComponent extends React.Component {
	constructor(props) {
		super();
		this.state = {
			displayColorPicker: true,
			currentColorSet: props.defaultColorsSet
		};
		this.handleChange = this.handleChange.bind(this);
		this.onColorChangeStart = this.onColorChangeStart.bind(this);
		this.onColorsSetChanged = this.onColorsSetChanged.bind(this);
	}

	handleChange(color) {
		const rgba = color.rgb;
		const cssColor = !!rgba.a ? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` : `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;

		this.props.colors[this.state.currentColorSet].setNewColor(this.state.initialColor, cssColor);
		notificationCenter.emit('on-color-change', {
			colorsSet: this.state.currentColorSet,
			initialColor: this.state.initialColor,
			currentColor: cssColor
		});
	}

	onColorChangeStart(color) {
		const currentColor = this.props.colors[this.state.currentColorSet].getCurrentColor(color);
		this.setState({initialColor: color, currentColor: currentColor});
	}

	onColorsSetChanged(setName) {
		this.setState({currentColorSet: setName});
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
				<ColorPicker color={this.state.currentColor} onChange={this.handleChange} type="chrome" />
			</div>
		);
	}
}

ColorPickerComponent.propTypes = {
	defaultColorsSet: React.PropTypes.string.isRequired,
	colors: React.PropTypes.object.isRequired
}
import React from 'react'

class ColorListElement extends React.Component {
	onClick(e) {
		notificationCenter.emit('pick-color-for', this.props.color);
	}

	onReset(e) {
		this.props.colors.removeNewColor(this.props.color);
		this.forceUpdate();
	}

	render() {
		var newColors = this.props.colors.getNewColor(this.props.color);
		return (
			<li className={this.props.isSelected ? 'selected' : undefined} onClick={this.onClick.bind(this)}>
				<i style={{backgroundColor: this.props.color}}></i>
				<span>{this.props.color}</span>
				<span className='new-color'>
				{
					newColors.map(function(newColor) {
						return <i className='new-color' style={{backgroundColor: newColor}}></i>//
					})
				}
				{newColors.length ? <i className='back' onClick={this.onReset.bind(this)}>↩</i> : ''}
				</span>
			</li>//
		);
	}
}
ColorListElement.propTypes = {
	color: React.PropTypes.string.isRequired,
	elements: React.PropTypes.array
}


export class ColorsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			colorsSet: props.defaultColorsSet,
			selectedColor: undefined
		}
		this.onColorsSetChangeCallback = this.onColorsSetChange.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
		this.onColorPickingStart = this.onColorPickingStart.bind(this);
	}

	onColorsSetChange(setName) {
		this.setState({colorsSet: setName});
	}

	onColorChange() {
		this.forceUpdate();
	}

	onColorPickingStart(color) {
		this.setState({selectedColor: color});
	}

	componentDidMount() {
		notificationCenter.subscribeListener('on-color-set-change', this.onColorsSetChangeCallback, 'cl-on-color-set-change-listener');
		notificationCenter.subscribeListener('on-color-change', this.onColorChange, 'cl-on-color-change-listener');
		notificationCenter.subscribeListener('pick-color-for', this.onColorPickingStart, 'cl-on-color-pick-start-listener');
	}

	componentWillUnmount() {
		notificationCenter.unsubscribeListener('on-color-set-change', this.onColorsSetChangeCallback);
		notificationCenter.unsubscribeListener('on-color-change', 'cl-on-color-change-listener');
		notificationCenter.unsubscribeListener('pick-color-for', 'cl-on-color-pick-start-listener');
	}

	render() {
		let colors = this.props.colors[this.state.colorsSet];
		let selectedColor = this.state.selectedColor;
		return (
			<ul className="colors-list">
				{
					colors.__keys.map(function(color) {
						return <ColorListElement key={color} isSelected={selectedColor && selectedColor == color} color={color} colors={colors} />
					})
				}
			</ul>
		);
	}
}
ColorsList.propTypes = {
	colors: React.PropTypes.object.isRequired
}

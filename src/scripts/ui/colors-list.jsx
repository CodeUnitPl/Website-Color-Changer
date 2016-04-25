import React from 'react'
import {Colors} from '../utils.js'

class ColorListElement extends React.Component {
	constructor(props) {
		super(props);
		this.parent = this.props.parent;
	}

	onClick(e) {
		notificationCenter.emit('pick-color-for', this.props.color);
	}

	onMouseEnter(e) {
		notificationCenter.emit('on-color-hover', {
			initialColor: this.props.color,
			colorsSet: this.parent.state.colorsSet
		});
	}

	onMouseLeave() {
		notificationCenter.emit('on-color-leave', {
			initialColor: this.props.color,
			colorsSet: this.parent.state.colorsSet
		});
	}

	onReset(e) {
		this.props.colors.removeNewColor(this.props.color);
		notificationCenter.emit('on-color-change', {
			colorsSet: this.parent.state.colorsSet,
			initialColor: this.props.color,
			currentColor: this.props.color
		});
		this.forceUpdate();
	}

	render() {
		var newColors = this.props.colors.getNewColor(this.props.color);
		return (
			<li className={this.props.isSelected ? 'selected' : undefined} onClick={this.onClick.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
				<i style={{backgroundColor: this.props.color}}></i>
				<span>
					{this.props.format == 'RGBA' ? this.props.color : Colors.rgbaStringToHex(this.props.color)[0]}
				</span>
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
			selectedColor: undefined,
			colorFormat: 'RGBA'
		}
		this.onColorsSetChangeCallback = this.onColorsSetChange.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
		this.onColorPickingStart = this.onColorPickingStart.bind(this);
		this.onColorFormatChange = this.onColorFormatChange.bind(this);
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

	onColorFormatChange(colorFormat) {
		this.setState({colorFormat: colorFormat});
	}

	componentDidMount() {
		notificationCenter.emit('on-component-update');
		notificationCenter.subscribeListener('on-color-set-change', this.onColorsSetChangeCallback, 'cl-on-color-set-change-listener');
		notificationCenter.subscribeListener('on-color-change', this.onColorChange, 'cl-on-color-change-listener');
		notificationCenter.subscribeListener('pick-color-for', this.onColorPickingStart, 'cl-on-color-pick-start-listener');
		notificationCenter.subscribeListener('toggle-color-format', this.onColorFormatChange, 'cl-on-color-format-change-listener');
	}

	componentWillUnmount() {
		notificationCenter.unsubscribeListener('on-color-set-change', this.onColorsSetChangeCallback);
		notificationCenter.unsubscribeListener('on-color-change', 'cl-on-color-change-listener');
		notificationCenter.unsubscribeListener('pick-color-for', 'cl-on-color-pick-start-listener');
		notificationCenter.unsubscribeListener('toggle-color-format', 'cl-on-color-format-change-listener');
	}

	componentDidUpdate() {
		notificationCenter.emit('on-component-update');
	}

	render() {
		let colors = this.props.colors[this.state.colorsSet];
		let selectedColor = this.state.selectedColor;
		return (
			<ul className="colors-list">
			{
				colors.__keys.map(function(color) {
					return <ColorListElement parent={this} format={this.state.colorFormat} key={color} isSelected={selectedColor && selectedColor == color} color={color} colors={colors} />
				}, this)
			}
			</ul>
		);
	}
}
ColorsList.propTypes = {
	colors: React.PropTypes.object.isRequired
}

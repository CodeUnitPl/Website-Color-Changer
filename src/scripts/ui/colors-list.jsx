import React from 'react'

class ColorListElement extends React.Component {

	constructor(props) {
		super(props);
	}

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
			<li onClick={this.onClick.bind(this)}>
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
			colorsSet: props.defaultColorsSet
		}
		this.onColorsSetChangeCallback = this.onColorsSetChange.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
	}

	onColorsSetChange(setName) {
		this.setState({colorsSet: setName});
	}

	onColorChange() {
		this.forceUpdate();
	}

	componentDidMount() {
		notificationCenter.subscribeListener('on-color-set-change', this.onColorsSetChangeCallback, 'cl-on-color-set-change-listener');
		notificationCenter.subscribeListener('on-color-change', this.onColorChange, 'cl-on-color-change-listener');
	}

	componentWillUnmount() {
		notificationCenter.unsubscribeListener('on-color-set-change', this.onColorsSetChangeCallback);
		notificationCenter.unsubscribeListener('on-color-change', this.onColorChange, 'cl-on-color-change-listener');
	}

	render() {
		var colors = this.props.colors[this.state.colorsSet];
		return (
			<ul className="colors-list">
				{
					colors.__keys.map(function(color) {
						return <ColorListElement key={color} color={color} colors={colors} />
					})
				}
			</ul>
		);
	}
}
ColorsList.propTypes = {
	colors: React.PropTypes.object.isRequired
}

import React from 'react'

class ColorListElement extends React.Component {
	render() {
		return (
			<li>
				<i style={{backgroundColor: this.props.color}}></i>
				<span>{this.props.color}</span>
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
	}

	onColorsSetChange(setName) {
		this.setState({colorsSet: setName});
	}

	componentDidMount() {
		notificationCenter.subscribeListener('on-color-set-change', this.onColorsSetChangeCallback);
	}

	componentWillUnmount() {
		notificationCenter.unsubscribeListener('on-color-set-change', this.onColorsSetChangeCallback);
	}

	render() {
		var colors = this.props.colors[this.state.colorsSet];
		return (
				<ul className="colors-list">
					{
						colors.__keys.map(function(color) {
							return <ColorListElement key={color} color={color} elements={colors[color]} />
						})
					}
				</ul>
		);
	}
}
ColorsList.propTypes = {
	colors: React.PropTypes.object.isRequired
}
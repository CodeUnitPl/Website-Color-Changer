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
	}

	onColorsSetChange(setName) {
		this.setState({colorSet: setName});
	}

	componentDidMount() {
		notificationCenter.subscribeListener('on-color-set-change', this.onColorsSetChange);
	}

	componentWillUnmount() {
		notificationCenter.unsubscribeListener('on-color-set-change', this.onColorsSetChange);
	}

	render() {
		var colors = this.props.colors[this.state.colorsSet];
		return (
				<ul className="colors-list">
					{
						Object.keys(colors).map(function(color) {
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
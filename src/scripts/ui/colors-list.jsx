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
	render() {
		var colors = this.props.colors;
		return (
				<ul className="colors-list">
					{
						Object.keys(colors.background).map(function(color) {
							return <ColorListElement key={color} color={color} elements={colors.background[color]} />
						})
					}
				</ul>
		);
	}
}
ColorsList.propTypes = {
	colors: React.PropTypes.object.isRequired
}
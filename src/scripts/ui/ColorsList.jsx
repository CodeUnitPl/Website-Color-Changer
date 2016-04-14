import React from 'react'

class ColorListElement extends React.Component {

	componentDidMount() {
		console.log(this.props.colors)
	}

	render() {
		return (
			<li>
				<div style={{backgroundColor: this.props.color}}>
				|
				</div>
			</li>//
		);
	}
}
ColorListElement.propTypes = {
	color: React.PropTypes.string.isRequired,
	elements: React.PropTypes.array
}


export class ColorsList extends React.Component {

	componentDidMount() {
		console.log(this.props.colors)
	}

	render() {
		var colors = this.props.colors;
		return (
			<div>
				<ul>
					{
						Object.keys(colors.background).map(function(color) {
							return <ColorListElement key={color} color={color} elements={colors.background[color]} />
						})
					}
				</ul>
			</div>//
		);
	}
}
ColorsList.propTypes = {
	colors: React.PropTypes.object.isRequired
}
import React from 'react'

export class Console extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			displayConsole: false
		}
		this.onConsoleToggle = this.onConsoleToggle.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
	}

	onConsoleToggle() {
		this.setState({displayConsole: !this.state.displayConsole});
	}

	onColorChange() {
		this.forceUpdate();
	}

	componentDidMount() {
		notificationCenter.subscribeListener('toggle-console', this.onConsoleToggle, 'c-on-export-changes');
		notificationCenter.subscribeListener('on-color-change', this.onColorChange, 'console-on-color-change');
	}

	componentDidUnpount() {
		notificationCenter.unsubscribeListener('toggle-console', 'c-on-export-changes');
		notificationCenter.unsubscribeListener('on-color-change', 'console-on-color-change');
	}

	render() {
		return (
			<div className='console' style={{display: this.state.displayConsole ? 'block' : 'none' }} >
				<pre>
					{
						JSON.stringify(this.props.colors.all.newColorsObject, null, 3)
					}
				</pre>
			</div>	
		);
	}
}

Console.propTypes = { 
	colors: React.PropTypes.object.isRequired
}
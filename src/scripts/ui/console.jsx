import React from 'react'

export class Console extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			displayConsole: false
		}
		this.onExportChanges = this.onExportChanges.bind(this);
	}

	onExportChanges() {
		this.setState({displayConsole: !this.state.displayConsole});
	}

	componentDidMount() {
		notificationCenter.subscribeListener('toggle-console', this.onExportChanges, 'c-on-export-changes');
	}

	componentDidUnpount() {
		notificationCenter.unsubscribeListener('toggle-console', 'c-on-export-changes');
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
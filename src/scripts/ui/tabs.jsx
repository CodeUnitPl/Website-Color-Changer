import React from 'react'
import {ColorPickerComponent} from './color-picker.jsx'

export class Tabs extends React.Component{	
	constructor(props) {
		super(props);
		this.state =  { 
			selected: props.defaultItemName,
			consoleShown: false
		}
	}

	onTabClick(e) {
		const currentSelected = e.currentTarget.getAttribute('data-name');
		this.setState({selected: currentSelected});
		notificationCenter.emit('on-color-set-change', currentSelected);
	}

	onReportClick(e) {
		this.setState({consoleShown: !this.state.consoleShown});
		notificationCenter.emit('toggle-console');
	}

	render() {
		return (
			<ul>
				{this.props.items.map(function(item, index) {
					return <li data-name={item} key={index} className={item==this.state.selected ? 'selected' : undefined} onClick={this.onTabClick.bind(this)}> {item} </li>
				}, this)}

				<li>
					<button type='button' onClick={this.onReportClick.bind(this)} name='console'> {this.state.consoleShown ?  "Hide changes": "Show changes"} </button>
				</li>
			</ul>
		);
	}
}

Tabs.propTypes = {
	items: React.PropTypes.array.isRequired,
	defaultItemName: React.PropTypes.string.isRequired
}

import React from 'react'
import {ColorPickerComponent} from './color-picker.jsx'

export class Tabs extends React.Component{	
	constructor(props) {
		super(props);
		this.state =  { 
			selected: props.defaultItemName,
			consoleShown: false,
			colorFormatIndex: 0
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

	onColorFormatChange() {
		var newColorFormatState = (++this.state.colorFormatIndex, this.state.colorFormatIndex %= 2);
		this.setState({colorFormatIndex: newColorFormatState});
		notificationCenter.emit('toggle-color-format', ['RGBA', 'HEX'][newColorFormatState])
	}

	render() {
		return (
			<div>
				<ul className='left-panel'>
					{this.props.items.map(function(item, index) {
						return <li data-name={item} key={index} className={item==this.state.selected ? 'selected' : undefined} onClick={this.onTabClick.bind(this)}> {item} </li>
					}, this)}
				</ul>
				<ul className='right-panel'>
					<li onClick={this.onReportClick.bind(this)}> {this.state.consoleShown ?  "Hide changes": "Show changes"} </li>
					<li onClick={this.onColorFormatChange.bind(this)}>{['HEX', 'RGBA'][this.state.colorFormatIndex]}</li>
				</ul>
			</div>
		);
	}
}

Tabs.propTypes = {
	items: React.PropTypes.array.isRequired,
	defaultItemName: React.PropTypes.string.isRequired
}

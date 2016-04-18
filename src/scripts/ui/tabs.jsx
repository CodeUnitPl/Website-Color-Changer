import React from 'react'

export class Tabs extends React.Component{	
	constructor(props) {
		super(props);
		this.state =  { 
			selected: props.defaultItemName
		}
	}

	onTabClick(e) {
		const currentSelected = e.currentTarget.getAttribute('data-name');
		this.setState({selected: currentSelected});
		notificationCenter.emit('on-color-set-change', currentSelected);
	}

	render() {
		const _this = this;
		return (
			<ul>
				{this.props.items.map(function(item, index) {
					return <li data-name={item} key={index} className={item==_this.state.selected ? 'selected' : undefined} onClick={_this.onTabClick.bind(_this)}> {item} </li>
				})}
			</ul>

		);
	}
}

Tabs.propTypes = {
	items: React.PropTypes.array.isRequired,
	defaultItemName: React.PropTypes.string.isRequired
}

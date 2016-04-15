import React from 'react'

export class Tabs extends React.Component{	
	constructor(props) {
		super(props);
		this.state =  { 
			selected: props.default
		}
	}

	onTabClick(e) {
		const currentSelected = e.currentTarget.getAttribute('data-name');
		this.state.selected = currentSelected;
		//TODO: emit
	}

	render() {
		const _this = this;
		console.log(this.props.items);
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
	default: React.PropTypes.string.isRequired
}

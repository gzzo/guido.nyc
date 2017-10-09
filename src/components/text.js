import React from 'react';

const sizes = {
	'small': '12px',
	'medium': '16px',
	'subtitle': '24px',
	'title': '48px',
	'huge': '76px'
}


export default class Text extends React.Component {
	static defaultProps = {
		font: 'Arial',
		size: 'medium'
	}

	render() {
		return (
			<div style={{fontFamily: this.props.font, fontSize: sizes[this.props.size]}}>
				{this.props.children}
			</div>
		)
	}
}

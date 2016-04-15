import ChartJS from 'chart.js'

export class Chart {	
	chartJSDatasetForType(type) {
		const colors = this.colors[type];
		let result = {
			data: [],
			backgroundColor: [],
			label: type
		}

		for(let color in colors) {
			result.data.push(colors[color].length)
			result.backgroundColor.push(color)
		}

		return result;
	}

	chartJSDataFromColors(type) {
		let datasets = [];
		if(type == 'all') {
			for(let key of Object.keys(this.colors)) { 
				datasets.push(this.chartJSDatasetForType(key));
			}
		} else {
			datasets.push(this.chartJSDatasetForType(type));
		}

		return {
			datasets: datasets,
			labels: []
		};
	}

	onColorSetChange(setName) {
		this.setName = setName;
		this.chartJSData = this.chartJSDataFromColors(setName);
		this.chart.update()
	}

	constructor(colors, defaultSetName) {
		this.colors = colors;
		this.setName = defaultSetName;
		this.chartJSData = this.chartJSDataFromColors(defaultSetName)
		this.chart = this.createChart();
	}

	createChart() {
		var ctx = document.getElementById("chart-area").getContext("2d");
		var config = {
	        type: 'doughnut',
	        data: this.chartJSData,
		        options: {
		        	tooltips: {
		        		enabled: false
		        	}
		        }
		}
		return new ChartJS(ctx, config);
	}
}

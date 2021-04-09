import React, { Component } from 'react'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js';

class PlotCont extends Component {

    //Read the data from Redux and plot it
    render() {
        const {hourly_data} = this.props
        const x = Object.keys(hourly_data).splice(0,5000)
        const y = Object.values(hourly_data).splice(0,5000)
        return (
            <Plot
                data={[
                    {
                        x: x,
                        y: y,
                        type: 'scattergl',
                        mode: 'lines+markers+text',
                        marker: {
                            color: '#0bbfe3',
                            size: 1,
                            line: {
                            width: 0.5},
                            opacity: 0.8},
                    }
                ]}
                layout={{ width: 1500, height: 800, title: 'Air Temperature °C Hourly' }}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        hourly_data: state.mr.hourly_data,
    }
}

export default connect(mapStateToProps, null)(PlotCont)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreaters from '../../store/actions'
import { map, get, isUndefined, isEmpty } from 'lodash'
import '../Form/style.css'

class LocationsHistory extends Component {

    //Render a button of the city and bind it to function to retreive data
    renderButton = () => {
        const { locations_history, getHourlyData } = this.props
        return map(locations_history, (p, key) => {
            const name = get(p, 'display_name', undefined)
            if (!isUndefined(name)) {
                return <button
                    className="button_style"
                    key={key}
                    onClick={() => getHourlyData(p)}
                >
                    {name}
                </button>
            }
        })
    }
    
    renderInfo = () => {
        const { nearest_station } = this.props
        if (!isEmpty(nearest_station)) {
            const text = "Nearest station to your city is : " +
                nearest_station.Stationsname + " in " + nearest_station.Bundesland
            return <span className="input_cont">
                {text}
            </span>
        }

    }

    render() {
        return (
            <div>
                {this.renderButton()}
                {this.renderInfo()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        locations_history: state.mr.locations_history,
        nearest_station: state.mr.nearest_station
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getHourlyData: (d) => dispatch(actionCreaters.updateHourlyData(d))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LocationsHistory)

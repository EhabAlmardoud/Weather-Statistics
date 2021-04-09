import React, { Component } from 'react'
import Form from './Form'
import LocationHistory from './LocationHistory'
import Plot from './Plot'

class MainContainer extends Component {
    render() {
        return (
            <div>
                <div>
                    <Form />
                    <LocationHistory />
                    <Plot />
                </div>
            </div>
        )
    }
}

export default MainContainer

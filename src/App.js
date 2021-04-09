import React, { Component } from "react"
import { Switch, Route } from 'react-router-dom'
import globalAxios from './axios/axios.js'
import MainContainer from './components/mainContainer'
import './index.css'
import styles from './styles.less'

// Handle the axios intercepters and defuaults (baseURL)
globalAxios

// React Route using a <Switch> to to match the path and return the <Route>
// Only Components loaded through <Route> have access for the history,location,match props 
class App extends Component {
    render() {
        return <div>
            <Switch>
                <Route path='/' >
                    <div>
                        <MainContainer />
                    </div>
                </Route>
            </Switch>
        </div>
    }
}


export default App
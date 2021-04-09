import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import * as actionCreaters from '../../store/actions/'
import './style.css'

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = { form: {} };
        //Get stations ID and store them in Redux
        props.updateStationsF()
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        this.setState({ form: { [event.target.name]: event.target.value } });
    }

    handleSubmit(event) {
        const { form } = this.state
        const { submitForm, updateLocHisF } = this.props
        //Submit Form to redux
        submitForm(form)
        //Retrive data (info) from an API of the city from the form
        updateLocHisF(get(form, 'location', ''))
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="form_cont">
                    <label className="input_cont">
                        Enter City Name :
                        <input
                            className="button_style"
                            type="text"
                            name="location"
                            value={this.state.value}
                            onChange={this.handleChange}
                        />
                    </label>
                    <input type="submit" value="Submit" className="button_style" />
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (d) => dispatch(actionCreaters.updateForm(d)),
        updateLocHisF: (d) => dispatch(actionCreaters.updateLocHis(d)),
        updateStationsF: () => dispatch(actionCreaters.updateStations())
    }
}
export default connect(null, mapDispatchToProps)(Form)

import * as actionsTypes from '../actions/actions'

const initialState = {
    form: {},
    locations_history: {},
    stations: {},
    hourly_data: {},
    nearest_station: {}
}

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionsTypes.UPDATESTATINOS:
            return {
                ...state, stations: { ...action.payload }
            }
        case actionsTypes.UPDATEFORM:
            return {
                ...state, form: { ...action.payload }
            }
        case actionsTypes.UPDATELOCHIS:
            return {
                ...state, locations_history: { ...action.payload }
            }
        case actionsTypes.UPDATEHOURLYDATA:
            return {
                ...state, hourly_data: { ...action.payload }
            }
        case actionsTypes.UPDATENEARSTSTATION:
            return {
                ...state, nearest_station: { ...action.payload }
            }
    }
    return state
}

export default formReducer
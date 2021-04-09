import * as actionsTypes from './actions'
import { get, map, isUndefined } from 'lodash'
import axios from 'axios'
import JSZip from 'jszip'

const dwdURL = "http://ftp-cdc.dwd.de/climate_environment/CDC/observations_germany/climate/hourly/air_temperature/historical/"

// Fetch stations IDs and data from server using Thunk (saveResult()) to async and save in redux 
export const updateStations = () => {
    return (dispatch, getState) => {
        axios.get(dwdURL + 'TU_Stundenwerte_Beschreibung_Stationen.txt')
            .then(r => {
                // Proccess the data before saving in redux
                const stations = stationsTableProcess(r.data)
                dispatch(saveResult(stations, 'UPDATESTATINOS'));
            })
            .catch(error => { console.log(error) })
    }
}

export const updateForm = (payload) => {
    return {
        type: actionsTypes.UPDATEFORM,
        payload: payload
    }
}

export const updateNearstStation = (payload) => {
    return {
        type: actionsTypes.UPDATENEARSTSTATION,
        payload: payload
    }
}
// Fetch the city data from server using Thunk (saveResult()) to async and save in redux 
export const updateLocHis = (payload) => {
    return (dispatch, getState) => {
        axios.get('https://nominatim.openstreetmap.org/search?format=json&city=' + payload)
            .then(r => {
                dispatch(saveResult({ [payload]: r.data[0] }, 'UPDATELOCHIS'));
            })
            .catch(error => { console.log(error) })
    }
}

// Fetch the data of the selected city after finding the nearest station
export const updateHourlyData = (payload) => {
    return (dispatch, getState) => {
        // Find the nearest staion
        let smallstDist = 0
        let nearestStationID = ""
        map(getState().mr.stations, (s) => {
            const dist = distance(payload.lat, payload.lon, s.geoBreite, s.geoLaenge, "K")
            if (smallstDist == 0 || dist < smallstDist) {
                smallstDist = dist
                nearestStationID = s.Stations_id
            }
        })
        const nearestStation = get(getState().mr.stations, nearestStationID, {})
        console.log(nearestStation)
        // Fetch the list of the files and find the station file name using the station_id
        axios.get(dwdURL)
            .then(r => {
                const regex = new RegExp(">.*?" + nearestStationID + ".*?</a>", "g");
                const regexMatch = r.data.match(regex)
                const fileName = regexMatch[0].slice(1, regexMatch[0].length - 4)
                return fileName
            }).then(fileName => {
                // Fetch the zip file of the station
                axios.get(dwdURL + fileName, {
                    responseType: 'arraybuffer'
                }).then(body => {
                    // Unzip the file
                    var new_zip = new JSZip()
                    new_zip.loadAsync(body.data)
                        .then(function (zip) {
                            return zip.file(Object.keys(zip.files).pop()).async("string")
                        }).then(function (content) {
                            // Process the data before saving in redux
                            const dataFinal = hourlyDataProcess(content)
                            dispatch(saveResult(dataFinal, 'UPDATEHOURLYDATA'))
                            dispatch(saveResult(nearestStation, 'UPDATENEARSTSTATION'))
                        })
                })
            })

    }
}


export const saveResult = (payload, actionTyp) => {
    const typ = get(actionsTypes, actionTyp, '')
    console.log(typ,payload)
    return {
        type: typ,
        payload: payload
    };
}


// Used to process the table of statios from the API to json
const stationsTableProcess = (stationsString) => {
    const rows = stationsString.split(/\n/)
    const keysList = rows[0].split(/\s+/)
    keysList.pop()
    const objectList = {}
    const stations = rows.slice(2, rows.length - 1)
    map(stations, (station) => {
        const tokens = station.split(/\s+/)
        tokens.pop()
        const handleStationName = tokens.splice(7, tokens.length - 1).join(' ')
        const lastElement = tokens.pop()
        tokens.push(handleStationName, lastElement)
        let ctr = 0
        let tempObj = {}
        map(tokens, (e) => {
            let keyN = keysList[ctr]
            tempObj[[keyN]] = e
            ctr += 1
        })
        objectList[tokens[0]] = tempObj
    })
    return objectList
}

// Find the distance between two GPS coordnations
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}


// Process the data and find date and temperature 
const hourlyDataProcess = (dataString) => {
    const rows = dataString.split(/\n/)
    const objectList = {}
    map(rows.slice(1, rows.length -1), (entry) => {
        const arr = entry.split(';')
        const date = arr[1]
        if (!isUndefined(arr[3])) {
            const dateFormat = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8) + ' : ' + date.slice(8, 10)
            const val = parseFloat(arr[3].replace(/\s/g, ''))
            objectList[dateFormat] = val
        }
    })
    return objectList
}
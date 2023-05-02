/*
rsc -> functional component
arf -> arrow function
*/

import React, {useEffect, useState} from "react";
import {Circle, MapContainer, TileLayer, Polyline, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Button, Grid, Slider} from "@mui/material";
import Parse from 'parse/dist/parse.min.js';
import GeneticAlgorithm from "./GeneticAlgorithm/index";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const App = () => {
    const [stations, setStations] = useState([])
    const [cities, setCities] = useState([])
    const [states, setStates] = useState([])
    const [statuses, setStatuses] = useState({
        "stations": false,
        "cities": false,
        "states": false,
        "neighborhoods": false
    })
    const [startEnd, setStartEnd] = useState({"rank": true, "start": null, "end": null})
    const [selection, setSelection] = React.useState("elit");
    const [crossover, setCrossover] = React.useState("pmx");
    const [path, setPath] = React.useState();

    useEffect(() => {

        const PARSE_APPLICATION_ID = 't1gxmiqaY7rLluwnd8qn79hMQPMSZoR4NAWPhbh1';
        const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
        const PARSE_JAVASCRIPT_KEY = '88o1WbCKnCSuY2uCjotrPPIEnTWhUykDdJBZOO6Y';
        Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
        Parse.serverURL = PARSE_HOST_URL;

        fetchGet("stations").then(res => {
            let new_dict = res.map(c => ({
                "latitude": c.attributes.latitude,
                "longitude": c.attributes.longitude
            }))
            setStations(new_dict)
        })
        fetchGet("cities").then(res => {
            let new_dict = res.map(c => ({
                "plaka": c.attributes.plaka,
                "latitude": c.attributes.lat,
                "longitude": c.attributes.lon,
                "komsular": c.attributes.komsular
            }))
            setCities(new_dict)
        })
        fetchGet("states").then(res => {
            let new_dict = res.map(c => ({
                "latitude": c.attributes.lat,
                "longitude": c.attributes.lon
            }))
            setStates(new_dict)
        })

    }, [])

    async function fetchGet(table) {
        const query = new Parse.Query(table);
        return await query.findAll();
    }

    const DrawStations = () => {
        return stations.map((x, index) =>
            <Circle key={index} center={[x.latitude, x.longitude]}
                    pathOptions={{color: 'blue'}}></Circle>)
    }
    const DrawCities = () => {
        return cities.map((x, index) =>
            <Circle key={index} center={[x.latitude, x.longitude]} pathOptions={{color: 'red'}}></Circle>)
    }
    const DrawStates = () => {
        return states.map((x, index) =>
            <Circle key={index} center={[x.latitude, x.longitude]} pathOptions={{color: 'green'}}></Circle>)
    }

    const DrawPath = () => {
        let lines = [];
        for (let i = 0; i < path.length - 1; i++) {
            lines.push(
                <Polyline
                    positions={[[path[i].latitude, path[i].longitude], [path[i + 1].latitude, path[i + 1].longitude]]}></Polyline>
            )
        }
        return lines;
    }

    const DrawNeighborhoods = () => {
        let lines = [];
        // let ankara = cities.find(x => x.plaka === 25)
        // ankara.komsular.forEach((l, index2) => {
        //     let city = cities.find(c => c.plaka === l)
        //     lines.push(<Polyline
        //         positions={[[ankara.latitude, ankara.longitude], [city.latitude, city.longitude]]}></Polyline>)
        // })
        cities.map((x, index1) =>
            x.komsular.map((l, index2) => {
                let city = cities.find(c => c.plaka === l)
                lines.push(<Polyline key={index1 + "_" + index2}
                                     positions={[[x.latitude, x.longitude], [city.latitude, city.longitude]]}></Polyline>)
            })
        )
        return lines
    }

    const switch_handle = (event) => {
        setStatuses(prev => ({...prev, [event.target.id]: !statuses[event.target.id]}))
    }

    const MyComponent = () => {
        useMapEvents({
            click: (e) => {
                if (startEnd["rank"])
                    setStartEnd(prev => ({
                        ...prev, "rank": !startEnd["rank"],
                        "start": e.latlng
                    }))
                else
                    setStartEnd(prev => ({
                        ...prev, "rank": !startEnd["rank"],
                        "end": e.latlng
                    }))
            }
        });
        return null;
    }

    const DrawClick = () => {
        if (startEnd["start"] && !startEnd["end"])
            return <Circle index={"start"} center={startEnd["start"]} radius={10000} color={"red"}/>
        else if (startEnd["start"] && startEnd["end"])
            return [<Circle index={"start"} center={startEnd["start"]} radius={10000} color={"red"}/>,
                <Circle index={"end"} center={startEnd["end"]} radius={10000} color={"blue"}/>]
    }

    const handleSelection = (event, newSelection) => {
        setSelection(newSelection);
    };

    const handleCrossover = (event, newCrossover) => {
        setCrossover(newCrossover);
    };

    const start = () => {
        let GA = new GeneticAlgorithm(100, 100, selection, crossover, startEnd, cities)
        GA.start()
        setPath(GA.path)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <MapContainer eventHandlers={{}} center={[36, 36]} zoom={6} style={{height: '100vh', width: '100wh'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {statuses["stations"] ? <DrawStations/> : ""}
                    {statuses["cities"] ? <DrawCities/> : ""}
                    {statuses["neighborhoods"] ? <DrawNeighborhoods/> : ""}
                    {statuses["states"] ? <DrawStates/> : ""}
                    {path ? <DrawPath/> : ""}
                    <MyComponent/>
                    <DrawClick/>
                </MapContainer>
            </Grid>
            <Grid item xs={3}>
                <Grid item xs>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Switch id={"stations"} onChange={switch_handle} color="info"/>}
                            label="Stations"/>
                        <FormControlLabel
                            control={<Switch id={"cities"} onChange={switch_handle} color="error"/>}
                            label="Cities"/>
                        <FormControlLabel
                            control={<Switch id={"states"} onChange={switch_handle} color="success"/>}
                            label="States"/>
                        <FormControlLabel
                            control={<Switch id={"neighborhoods"} onChange={switch_handle} color="success"/>}
                            label="Neighborhoods"/>
                    </FormGroup>
                </Grid>
                <Grid item xs>
                    <label>Population Size</label>
                </Grid>
                <Grid item xs>
                    <Slider/>
                </Grid>
                <Grid item xs>
                    <label>Selection Methods</label>
                </Grid>
                <Grid item xs>
                    <ToggleButtonGroup
                        color="primary"
                        exclusive
                        aria-label="Platform"
                        value={selection}
                        onChange={handleSelection}
                    >
                        <ToggleButton value="roulette">Roulette Wheel Selection</ToggleButton>
                        <ToggleButton value="rank">Rank Selection</ToggleButton>
                        <ToggleButton value="torunament">Tournament Selection</ToggleButton>
                        <ToggleButton value="elit">Elitist Selection</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs>
                    <label>Crossover Methods</label>
                </Grid>
                <Grid item xs>
                    <ToggleButtonGroup
                        color="primary"
                        exclusive
                        aria-label="Platform"
                        value={crossover}
                        onChange={handleCrossover}
                    >
                        <ToggleButton value="pmx">PMX</ToggleButton>
                        <ToggleButton value="ox1">OX1</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs>
                    <Button onClick={start} variant="contained">Start</Button>
                </Grid>
            </Grid>


        </Grid>
    )
}

export default App;
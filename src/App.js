/*
rsc -> functional component
arf -> arrow function
*/

import React, {useEffect, useState} from "react";
import {Circle, MapContainer, TileLayer, Polyline, useMapEvents, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Button, Grid, Slider} from "@mui/material";
// import Parse from 'parse/dist/parse.min.js';
import GeneticAlgorithm from "./GeneticAlgorithm/index";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import randomColor from "randomcolor";
import RoutingMachine from "./RoutingMachine";
import {findNearest} from 'geolib'

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
    const [GA, setGA] = React.useState(null);
    const [selection, setSelection] = React.useState("elit");
    const [crossover, setCrossover] = React.useState("pmx");
    const [populationSize, setPopulationSize] = React.useState(20);
    const [iterationSize, setIterationSize] = React.useState(20);
    const [speed, setSpeed] = React.useState(0);
    const [best, setBest] = React.useState();
    const [iterator, setIterator] = React.useState(0);
    const [status, setStatus] = React.useState(false);

    useEffect(() => {

        // const PARSE_APPLICATION_ID = 't1gxmiqaY7rLluwnd8qn79hMQPMSZoR4NAWPhbh1';
        // const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
        // const PARSE_JAVASCRIPT_KEY = '88o1WbCKnCSuY2uCjotrPPIEnTWhUykDdJBZOO6Y';
        // Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
        // Parse.serverURL = PARSE_HOST_URL;
        // "latitude": c.attributes.lat, // Örnek
        // fetchGet("stations")

        fetchMongoDbOnline("stations").then(res => {
            let new_dict = res.map(c => ({
                "latitude": c.latitude,
                "longitude": c.longitude
            }))
            setStations(new_dict)
        })
        fetchMongoDbOnline("cities").then(res => {
            let new_dict = res.map(c => ({
                "plaka": c.plaka,
                "il_adi": c.il_adi,
                "latitude": c.lat,
                "longitude": c.lon,
                "komsular": c.komsular
            }))
            setCities(new_dict)
        })
        fetchMongoDbOnline("states").then(res => {
            let new_dict = res.map(c => ({
                "latitude": c.lat,
                "longitude": c.lon
            }))
            setStates(new_dict)
        })


    }, [])

    // async function fetchGet(table) {
    //     const query = new Parse.Query(table);
    //     return await query.findAll();
    // }

    async function fetchMongoDbOnline(table) {
        return await fetch("http://localhost:8080/api/planner/" + table)
            .then(r => r.json())
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

    const DrawBestPath = () => {
        let lines = [];
        for (let i = 0; i < best.path.length - 1; i++) {
            lines.push(
                <Polyline
                    positions={[[best.path[i].latitude, best.path[i].longitude],
                        [best.path[i + 1].latitude, best.path[i + 1].longitude]]}
                    color={"red"}
                >
                </Polyline>
            )
        }

        return lines;
    }

    const DrawNeighborhoods = () => {
        let lines = [];
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
                if (startEnd["rank"]) {
                    const start = findNearest({latitude: e.latlng.lat, longitude: e.latlng.lng}, cities)
                    setStartEnd(prev => ({
                        ...prev, "rank": !startEnd["rank"],
                        "start": start
                    }))
                } else {
                    const end = findNearest({latitude: e.latlng.lat, longitude: e.latlng.lng}, cities)
                    setStartEnd(prev => ({
                        ...prev, "rank": !startEnd["rank"],
                        "end": end
                    }))
                }
            }
        });
        return null;
    }

    const DrawClick = () => {
        if (startEnd["start"] && !startEnd["end"])
            return <Circle index={"start"} center={[startEnd["start"].latitude, startEnd["start"].longitude]}
                           radius={10000} color={"red"}/>
        else if (startEnd["start"] && startEnd["end"])
            return [<Circle index={"start"} center={[startEnd["start"].latitude, startEnd["start"].longitude]}
                            radius={10000} color={"red"}/>,
                <Circle index={"end"} center={[startEnd["end"].latitude, startEnd["end"].longitude]} radius={10000}
                        color={"blue"}/>]
    }

    const handleSelection = (event, newSelection) => {
        setSelection(newSelection);
    };

    const handleCrossover = (event, newCrossover) => {
        setCrossover(newCrossover);
    };

    const handleSlider = (event, newValue) => {
        if (event.target.name === "population_slider")
            setPopulationSize(newValue);
        else if (event.target.name === "iteration_slider")
            setIterationSize(newValue);
        else if (event.target.name === "speed")
            setSpeed(newValue);
    }

    const start = () => {
        if (!status) {
            setStatus(true);
            let tempGA = new GeneticAlgorithm(iterationSize, populationSize, selection, crossover, startEnd, cities)
            const props = {"setBest": setBest, "speed": speed, "iterator": iterator, "setIterator": setIterator, "setStatus": setStatus}
            tempGA.start(props)
            setGA(tempGA)
        } else {
            setStatus(false);
            GA.stop()
        }

    }

    const DrawRoute = () => {
        var lines = []
        const waypoints = best.path.map(c => [c.latitude, c.longitude])
        lines.push(
            <RoutingMachine waypoints={waypoints}/>
        )
        return lines
    }


    return (
        <Grid container xs={12} spacing={{xs: 2, md: 3}}>
            <Grid item xs={9}>
                <MapContainer center={[36, 36]} zoom={6} style={{height: '100vh', width: '100wh'}}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {statuses["stations"] ? <DrawStations/> : ""}
                    {statuses["cities"] ? <DrawCities/> : ""}
                    {statuses["neighborhoods"] ? <DrawNeighborhoods/> : ""}
                    {statuses["states"] ? <DrawStates/> : ""}
                    {best ? <DrawBestPath/> : ""}
                    {/*{best ? DrawRoute() : ""}*/}
                    <MyComponent/>
                    <DrawClick/>
                </MapContainer>
            </Grid>
            <Grid item xs={3}>
                <Grid item xs>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Switch id={"stations"} onChange={switch_handle} color="info"/>}
                            label="Stations"
                        />
                        <FormControlLabel
                            control={<Switch id={"cities"} onChange={switch_handle} color="error"/>}
                            label="Cities"
                        />
                        <FormControlLabel
                            control={<Switch id={"states"} onChange={switch_handle} color="success"/>}
                            label="States"
                        />
                        <FormControlLabel
                            control={<Switch id={"neighborhoods"} onChange={switch_handle} color="success"/>}
                            label="Neighborhoods"
                        />
                    </FormGroup>
                </Grid>
                <Grid item xs>
                    <label>Population Size</label>
                </Grid>
                <Grid item xs>
                    <Slider name="population_slider" min={20} max={300} valueLabelDisplay="auto" onChange={handleSlider}/>
                </Grid>
                <Grid item xs>
                    <label>Iteration Size</label>
                </Grid>
                <Grid item xs>
                    <Slider name="iteration_slider" min={20} max={1000} valueLabelDisplay="auto" onChange={handleSlider}/>
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
                        <ToggleButton value="tournament">Tournament Selection</ToggleButton>
                        <ToggleButton value="elitist">Elitist Selection</ToggleButton>
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
                    <label>Iteration Speed</label>
                </Grid>
                <Grid item xs>
                    <Slider name="speed" aria-label="Speed" defaultValue={0} valueLabelDisplay="auto" step={50} marks min={0} max={1000} onChange={handleSlider}/>
                </Grid>
                <Grid item xs>
                    <Button onClick={start} variant="contained">{status ? "Stop" : "Start"}</Button>
                </Grid>
                <Grid item xs>
                    <label>{iterator}</label>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default App;
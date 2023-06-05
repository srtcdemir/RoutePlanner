import {useEffect} from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import {useMap} from "react-leaflet";


export default function Routing(props) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints: props.waypoints,
            lineOptions: {
                styles: [{color: "#6FA1EC", weight: 4}]
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            showAlternatives: false,
        }).addTo(map);

        routingControl.on('routesfound', function (e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            console.log(summary.totalDistance / 1000)
            // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
        });

        return routingControl;
    }, [map]);

    return null;
}

// import L from "leaflet";
// import {createControlComponent} from "@react-leaflet/core";
// import "leaflet-routing-machine";
//
// const createRoutingMachineLayer = (props) => {
//     return  L.Routing.control({
//         waypoints: [
//             L.latLng(props.start),
//             L.latLng(props.target)
//         ],
//         lineOptions: {
//             styles: [{color: "#6FA1EC", weight: 4}]
//         },
//         show: false,
//         addWaypoints: false,
//         routeWhileDragging: false,
//         draggableWaypoints: false,
//         fitSelectedRoutes: false,
//         showAlternatives: false,
//     });
// };
//
// // const RoutingMachine = createControlComponent(createRoutingMachineLayer);
//
// export default createRoutingMachineLayer;
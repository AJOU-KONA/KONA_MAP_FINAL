import React, {useEffect, useState} from 'react';
import {MarkerClusterer, Marker} from "@react-google-maps/api";

const initialPosition = {lat: 37.284315, lng: 127.044504};

const getPosition = (bundle) => {
    if (bundle.placeList) return bundle.placeList[0].position;
    else if (bundle.roadList) return bundle.roadList[0].roadInfo[0];
    else if (bundle.buildingList) {
        let position = {
            lat: bundle.buildingList[0].buildingPosition.north,
            lng: bundle.buildingList[0].buildingPosition.east};
        return position;
    } else return initialPosition;
};

const ClusterMarkerContainer = ({type, zoom, info}) => {

    useEffect(() => {
        console.dir(info);
    }, [info]);

    if (!info) return null;

    return (
        <>
            {zoom <= 13 && type === 'place' &&
            <MarkerClusterer minimumClusterSize={1} averageCenter={true}>
                {(clus) => info.map(place => <Marker visible={false} key={place._id} position={place.position}
                                                     clusterer={clus}/>)}
            </MarkerClusterer>}
            {zoom <= 13 && type === 'road' &&
            <MarkerClusterer minimumClusterSize={1} averageCenter={true}>
                {clus => info.map(road => <Marker visible={false} key={road._id} position={road.roadInfo[0]}
                                                  clusterer={clus}/>)}
            </MarkerClusterer>}

            {zoom <= 13 && type === 'building' &&
            <MarkerClusterer minimumClusterSize={1} averageCenter={true}>
                {clus => info.map(building => <Marker visible={false} key={building._id}
                                                      position={building.buildingPosition[0]}
                                                      clusterer={clus}/>)}
            </MarkerClusterer>}

            {zoom <= 13 && type === 'bundle' &&
            <MarkerClusterer minimumClusterSize={1} averageCenter={true}>
                {clus => info.map(bundle => <Marker visible={false} key={bundle._id}
                                                    position={getPosition(info)}
                                                    clusterer={clus}/>)}
            </MarkerClusterer>}


        </>
    );
};

export default ClusterMarkerContainer;

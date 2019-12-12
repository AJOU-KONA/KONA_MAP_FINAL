import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchUserBuildingStatistics,
    fetchUserBundleStatistics,
    fetchUserPlaceStatistics,
    fetchUserRoadStatistics
} from '../modules/userPlace';
import UserPlaceStatisticsComponent from "../components/UserPlaceStatisticsComponent";

const UserPlaceStatisticsContainer = () => {
    const {userPlaceStatistics, userRoadStatistics, userBuildingStatistics,
        userBundleStatistics} = useSelector(({userPlace}) => ({
        userPlaceStatistics: userPlace.userPlaceStatistics,
        userRoadStatistics: userPlace.userRoadStatistics,
        userBuildingStatistics: userPlace.userBuildingStatistics,
        userBundleStatistics: userPlace.userBundleStatistics,
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserPlaceStatistics());
        dispatch(fetchUserRoadStatistics());
        dispatch(fetchUserBuildingStatistics());
        dispatch(fetchUserBundleStatistics());
    }, []);

    if(!userPlaceStatistics || !userRoadStatistics || !userBuildingStatistics || !userBundleStatistics)
        return null;

    return(
        <UserPlaceStatisticsComponent userPlaceStatistics={userPlaceStatistics}
        userRoadStatistics={userRoadStatistics}
        userBuildingStatistics={userBuildingStatistics}
        userBundleStatistics={userBundleStatistics}/>
    );
};

export default UserPlaceStatisticsContainer;

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchUserCommentStatistics
} from '../modules/userPlace';
import UserPlaceStatisticsComponent from "../components/UserPlaceStatisticsComponent";
import UserCommentStatisticsComponent from "../components/UserCommentStatisticsComponent";

const UserCommentStatisticsContainer = () => {
    const {userCommentStatistics} = useSelector(({userPlace}) => ({
        userCommentStatistics: userPlace.userCommentStatistics,
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserCommentStatistics());
    }, []);

    if(!userCommentStatistics) return null;

    return(
        <UserCommentStatisticsComponent userCommentStatistics={userCommentStatistics}/>
    );
};

export default UserCommentStatisticsContainer;

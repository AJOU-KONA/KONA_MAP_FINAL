import React, {useEffect} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import UserRoadManageComponent from "../components/UserRoadManageComponent";
import {fetchUserRoadList} from "../modules/userPlace";

const StyledWrapper = styled.div`
    padding-left : 60px;
`;

const UserRoadManageContainer = () => {
    const {userRoadList} = useSelector(({userPlace}) => ({
        userRoadList: userPlace.userRoadList
    }));
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(fetchUserRoadList());
    }, []);

    if(!userRoadList) return null;

    return (
        <StyledWrapper>
            <UserRoadManageComponent userRoadList={userRoadList}/>
        </StyledWrapper>
    )
};

export default UserRoadManageContainer;

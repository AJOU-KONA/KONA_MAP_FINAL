import React, {useEffect} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserBuildingList} from "../modules/userPlace";
import UserBuildingManageComponent from "../components/UserBuildingManageComponent";

const StyledWrapper = styled.div`
    padding-left : 60px;
`;

const UserBuildingManageContainer = () => {
    const {userBuildingList} = useSelector(({userPlace}) => ({
        userBuildingList: userPlace.userBuildingList
    }));
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(fetchUserBuildingList());
    }, []);

    if(!userBuildingList) return null;

    return (
        <StyledWrapper>
            <UserBuildingManageComponent userBuildingList={userBuildingList}/>
        </StyledWrapper>
    )
};

export default UserBuildingManageContainer;

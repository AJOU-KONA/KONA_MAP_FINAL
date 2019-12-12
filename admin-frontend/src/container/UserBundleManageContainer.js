import React, {useEffect} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserBundleList} from "../modules/userPlace";
import UserBuildingManageComponent from "../components/UserBuildingManageComponent";
import UserBundleManageComponent from "../components/UserBundleManageComponent";

const StyledWrapper = styled.div`
    padding-left : 60px;
`;

const UserBundleManageContainer = () => {
    const {userBundleList} = useSelector(({userPlace}) => ({
        userBundleList: userPlace.userBundleList
    }));
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(fetchUserBundleList());
    }, []);

    useEffect(() => {
        console.dir(userBundleList);
    }, [userBundleList]);

    if(!userBundleList) return null;

    return (
        <StyledWrapper>
            <UserBundleManageComponent userBundleList={userBundleList}/>
        </StyledWrapper>
    );
};

export default UserBundleManageContainer;

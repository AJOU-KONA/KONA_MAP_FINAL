import React, {useEffect} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserCommentList} from "../modules/userPlace";
import UsercommentManageComponent from "../components/UserCommentManageComponent";

const StyledWrapper = styled.div`
    padding-left : 60px;
`;

const UserCommentManageContainer = () => {
    const {userCommentList} = useSelector(({userPlace}) => ({
        userCommentList: userPlace.userCommentList
    }));
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(fetchUserCommentList());
    }, []);

    if(!userCommentList) return null;

    return (
        <StyledWrapper>
            <UsercommentManageComponent userCommentList={userCommentList}/>
        </StyledWrapper>
    );
};

export default UserCommentManageContainer;

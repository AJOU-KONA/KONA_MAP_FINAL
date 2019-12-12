import React, {useEffect, useReducer} from 'react';
import SideNav, {Nav, NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import {Route} from 'react-router-dom';
import {
    faHome,
    faCommentDots,
    faMapMarker,
    faRoad,
    faList,
    faUser, faAddressCard, faEdit, faComment, faBuilding, faStreetView, faPoll, faCheck
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import UserStatisticsContainer from "./UserStatisticsContainer";
import UserManageContainer from "./UserManageContainer";
import UserPlaceStatisticsContainer from "./UserPlaceStatisticsContainer";
import UserPlaceManageContainer from "./UserPlaceManageContainer";
import UserRoadManageContainer from "./UserRoadManageContainer";
import UserBuildingManageContainer from './UserBuildingManageContainer';
import UserBundleManageContainer from "./UserBundleManageContainer";


const StyledSideBar = styled.div`
    height: 100%;
`;

const initialState = {
    addInfoOnMap: false,
    addRoadOnMap: false,
    addBookMark: false
};

const infoReducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return initialState
        }
        case 'addInfoOnMap': {
            return {...state, addInfoOnMap: action.addInfoOnMap}
        }
        case 'addRoadOnMap': {
            return {...state, addRoadOnMap: action.addRoadOnMap}
        }
        case 'addBookMark' : {
            return {...state, addBookMark: action.addBookMark}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const SideBarContainter = ({history}) => {
    const [localInfo, setLocalInfo] = useReducer(infoReducer, initialState);
    /*
    const {username} = useSelector(({user}) => ({
        username: user.user.username,
    }));
    */
    const dispatch = useDispatch();

    return (
        <StyledSideBar>
            <Route render={({history}) => (
                <React.Fragment>
                    <SideNav
                        onSelect={(selected) => {
                            let route = false;
                            const to = '/' + selected;
                            switch (to) {
                                case "/" :
                                case "/home":
                                case "/userInfo/statistics" :
                                case "/userInfo/manageUser":
                                case "/userInfo/comment":
                                case "/placeInfo/managePlace":
                                case "/placeInfo/manageRoad":
                                case "/placeInfo/manageBuilding":
                                case "/placeInfo/manageBundle":
                                case "/placeInfo/statistics":
                                case "/geo" :
                                    history.push(to);
                                    route = true;
                                    break;
                            }
                        }}
                    >
                        <SideNav.Toggle/>
                        <SideNav.Nav defaultSelected="home">
                            <NavItem eventKey="home">
                                <NavIcon>
                                    <FontAwesomeIcon icon={faHome} size="2x"/>
                                </NavIcon>
                                <NavText>
                                    메인 화면
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="userInfo">
                                <NavIcon>
                                    <FontAwesomeIcon icon={faUser} size="2x"/>
                                </NavIcon>
                                <NavText>
                                    마이페이지
                                </NavText>

                                <NavItem eventKey="userInfo/statistics">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faPoll} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        사용자 통계
                                    </NavText>

                                </NavItem>

                                <NavItem eventKey="userInfo/manageUser">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faUser} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        사용자 관리
                                    </NavText>
                                </NavItem>

                            </NavItem>
                            <NavItem eventKey="placeInfo">
                                <NavIcon>
                                    <FontAwesomeIcon icon={faList} size="2x"/>
                                </NavIcon>
                                <NavText>
                                    게시글
                                </NavText>
                                <NavItem eventKey="placeInfo/statistics">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faPoll} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        위치 게시글 통계
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="placeInfo/managePlace">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faMapMarker} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        위치 게시글 관리
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="placeInfo/manageRoad">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faRoad} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        경로 게시글 관리
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="placeInfo/manageBuilding">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faBuilding} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        건물 게시글 관리
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="placeInfo/manageBundle">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faBuilding} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        모음 게시글 관리
                                    </NavText>
                                </NavItem>
                            </NavItem>

                            <NavItem eventKey="comment">
                                <NavIcon>
                                    <FontAwesomeIcon icon={faCommentDots} size="2x"/>
                                </NavIcon>
                                <NavText>
                                    댓글 관리
                                </NavText>
                                <NavItem eventKey="comment/statistics">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faPoll} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        댓글 통계
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="comment/manageComment">
                                    <NavIcon>
                                        <FontAwesomeIcon icon={faCommentDots} size="2x"/>
                                    </NavIcon>
                                    <NavText>
                                        댓글 관리
                                    </NavText>
                                </NavItem>
                            </NavItem>
                        </SideNav.Nav>
                    </SideNav>
                    <main>
                        {/*<Route path={["/", "/home"]} exact component={MapPage}/>*/}
                        <Route path={"/userInfo/statistics"} exact component={UserStatisticsContainer}/>
                        <Route path={"/userInfo/manageUser"} exact component={UserManageContainer}/>
                        <Route path={"/placeInfo/statistics"} exact component={UserPlaceStatisticsContainer}/>
                        <Route path={"/placeInfo/managePlace"} exact component={UserPlaceManageContainer}/>
                        <Route path={"/placeInfo/manageRoad"} exact component={UserRoadManageContainer}/>
                        <Route path={"/placeInfo/manageBuilding"} exact component={UserBuildingManageContainer}/>
                        <Route path={"/placeInfo/manageBundle"} exact component={UserBundleManageContainer}/>
                    </main>
                </React.Fragment>
            )}/>
        </StyledSideBar>

    );
};

export default SideBarContainter;

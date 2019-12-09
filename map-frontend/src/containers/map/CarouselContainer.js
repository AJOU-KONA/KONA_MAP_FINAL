import React, {useCallback, useEffect, useReducer} from 'react';
import {Button, Carousel, Nav, NavDropdown} from "react-bootstrap";
import styled from "styled-components";
import YoutubeContainer from "../common/YoutubeContainer";
import {useDispatch} from "react-redux";
import {setFloorRedux} from '../../modules/map';

const StyledWrapper = styled.div`
    z-index: 10;
`;

const BottomLine = styled.div`
    padding-top: 5px;
    border-bottom: black solid;
`;

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

const InfoWindowReducer = (state, action) => {
    switch (action.type) {
        case 'reset' : {
            return initialState
        }
        case 'toggleTabYoutube' : {
            return {...state, visibleOnTabYoutube: true, visibleOnTabMap: false, visibleOnTabPictures: false}
        }
        case 'toggleTabPictures' : {
            return {...state, visibleOnTabPictures: true, visibleOnTabYoutube: false, visibleOnTabMap: false}
        }
        case 'toggleTabMap' : {
            return {...state, visibleOnTabMap: true, visibleOnTabPictures: false, visibleOnTabYoutube: false}
        }
        case 'setFloor': {
            return {...state, floor: action.floor}
        }
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const initialState = {
    visibleOnTabMap: false,
    visibleOnTabYoutube: false,
    visibleOnTabPictures: true,
    floor: 0,
};


const CarouselContainer = ({info, type}) => {
    const [localInfo, setLocalInfo] = useReducer(InfoWindowReducer, initialState);
    const dispatch = useDispatch();

    const toggleTabMap = useCallback(() => {
        setLocalInfo({type: 'toggleTabMap'})
    }, [localInfo]);
    const toggleTabYoutube = useCallback(() => {
        setLocalInfo({type: 'toggleTabYoutube'})
    }, [localInfo]);
    const toggleTabPictures = useCallback(() => {
        setLocalInfo({type: 'toggleTabPictures'})
    }, [localInfo]);
    const setFloor = useCallback((value) => {
        setLocalInfo({type: 'setFloor', floor: value});
    }, [localInfo]);

    const onSelect = (e) => {
        setFloor(e);
    };

    useEffect(() => {
        dispatch(setFloorRedux(localInfo.floor));
    }, [localInfo.floor]);

    useEffect(() => {
        console.dir(info);
    }, [info]);

    if (!info) return null;

    return (
        <div>
            <div>
                <Nav fill justify variant="pills" defaultActiveKey="info-position">
                    <Nav.Item>
                        <Nav.Link eventKey="info-position" onSelect={toggleTabPictures}>사진</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="estimate-user" onSelect={toggleTabYoutube}>동영상</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="comment-user" disabled={!info.buildingPosition}
                                  onSelect={toggleTabMap}>약도</Nav.Link>
                    </Nav.Item>
                    {info.floorArray ?
                        <NavDropdown title={localInfo.floor + "층"} id="nav-dropdown" onSelect={onSelect}>
                            {info.floorArray && arr.slice(0, info.floor + 1).map(
                                (inf, index) => index === 0 ?
                                    <NavDropdown.Item eventKey={index}>
                                        요약
                                    </NavDropdown.Item> :
                                    <NavDropdown.Item eventKey={index}>
                                        {index}층
                                    </NavDropdown.Item>)}
                        </NavDropdown>
                        : null}
                </Nav>
            </div>
            <BottomLine/>
            <div>
                {localInfo.visibleOnTabPictures &&
                <Carousel>
                    {!info.floorArray && info.imageUrl ? info.imageUrl.map(url => (
                        <Carousel.Item key={url}>
                            <img
                                width="100%"
                                height="auto"
                                src={url}
                            />
                        </Carousel.Item>
                    )) : null}
                    {info.floorArray && info.floorArray[localInfo.floor].imageUrl.map(
                        url => url ? (
                            <Carousel.Item key={url}>
                                <img
                                    width="100%"
                                    height="auto"
                                    src={url}
                                />
                            </Carousel.Item>
                        ) : null)}
                </Carousel>}
                {localInfo.visibleOnTabYoutube && ( info.floorArray ?
                <YoutubeContainer youtubeVideoId={info.floorArray[localInfo.floor].youtubeVideoId}/>
                : <YoutubeContainer youtubeVideoId={info.youtubeVideoId}/>
                )}

                {localInfo.visibleOnTabMap && info.floorArray &&
                <Carousel>
                    {info.floorArray[localInfo.floor].roughMapUrl.map(
                        (url => (
                            <Carousel.Item key={url}>
                                <img width="100%"
                                     height="auto"
                                     src={url}
                                />
                            </Carousel.Item>
                        )))}
                </Carousel>}

            </div>
        </div>
    );
};

export default CarouselContainer;

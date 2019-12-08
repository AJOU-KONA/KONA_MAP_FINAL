import React, {useCallback, useReducer} from 'react';
import {Button, Carousel, Nav} from "react-bootstrap";
import styled from "styled-components";
import YoutubeContainer from "../common/YoutubeContainer";

const StyledWrapper = styled.div`
    z-index: 10;
`;

const BottomLine = styled.div`
    padding-top: 5px;
    border-bottom: black solid;
`;

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
        default: {
            throw new Error(`unexpected action.type: ${action.type}`)
        }
    }
};

const initialState = {
    visibleOnTabMap: false,
    visibleOnTabYoutube: false,
    visibleOnTabPictures: true,
};


const CarouselContainer = ({info}) => {
    const [localInfo, setLocalInfo] = useReducer(InfoWindowReducer, initialState);

    const toggleTabMap = useCallback(() => {
        setLocalInfo({type: 'toggleTabMap'})
    }, [localInfo]);
    const toggleTabYoutube = useCallback(() => {
        setLocalInfo({type: 'toggleTabYoutube'})
    }, [localInfo]);
    const toggleTabPictures = useCallback(() => {
        setLocalInfo({type: 'toggleTabPictures'})
    }, [localInfo]);

    return (
        <div>
            <div >
                <Nav fill justify variant="pills" defaultActiveKey="info-position">
                    <Nav.Item>
                        <Nav.Link eventKey="info-position" onSelect={toggleTabPictures}>사진</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="estimate-user" onSelect={toggleTabYoutube}>동영상</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="comment-user" onSelect={toggleTabMap}>{info.buildingPosition ? "약도" : "지도" }</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <BottomLine/>
            <div>
                {localInfo.visibleOnTabPictures &&
                <Carousel>

                    {info.imageUrl ? info.imageUrl.map(url => (
                        <Carousel.Item key={url}>
                            <img
                                width="100%"
                                height="auto"
                                src={url}
                            />
                        </Carousel.Item>
                    )) : null}
                </Carousel>}
                {localInfo.visibleOnTabYoutube &&
                <YoutubeContainer youtubeVideoId={info.youtubeVideoId}/>}
                {localInfo.visibleOnTabMap && info.roughMapUrl &&
                <Carousel>
                    {info.roughMapUrl.map(url => (
                        <Carousel.Item key={url}>
                            <img width="100%"
                                 height="auto"
                                 src={url}
                                 />
                        </Carousel.Item>
                    ))}
                </Carousel>}
            </div>
        </div>
    );
};

export default CarouselContainer;

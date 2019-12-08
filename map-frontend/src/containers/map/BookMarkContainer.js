import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import BundleModal from "../../components/map/BundleModal";

const StyledBookMarkWrapper = styled.div`
    z-index : 10;
    position: fixed;
    background-color : white;
    left: 30;
    margin : 20px 20px 20px 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 30px;
    padding-bottom: 20px;
    border : dotted black;
`;

const BookMarkContainer = () => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const {buildingList, roadList, placeList, username} = useSelector(({map, user}) => ({
        username : user.user.username,
        buildingList: map.bookMark.buildingList,
        roadList: map.bookMark.roadList,
        placeList: map.bookMark.placeList,
    }));

    const onClick = useCallback(()=>{
        if(!visibleModal) setVisibleModal(true);
        else setVisibleModal(false);
    }, [visibleModal]);

    useEffect(() => {
        console.dir(placeList);
        console.dir(roadList);
        console.dir(buildingList);
    }, [roadList, placeList, buildingList]);

    return (
        <StyledBookMarkWrapper>
            {visibleModal && <BundleModal placeList={placeList}
                                          roadList={roadList} buildingList={buildingList}/>}
            {placeList && <BookMarkPlace placeList={placeList}/>}
            <hr/>
            {roadList && <BookMarkRoad roadList={roadList}/>}
            <hr/>
            {buildingList && <BookMarkBuilding buildingList={buildingList}/>}
            <hr/>
            <Button variant="primary" onClick={onClick}>저장</Button>
        </StyledBookMarkWrapper>
    );
};

const BookMarkPlace = ({placeList}) => {
    return (
        placeList.map(place => (<p key={place._id}>{place.name}</p>))
    );
};

const BookMarkRoad = ({roadList}) => {
    return (
        roadList.map(road => (<p key={road._id}>{road.name}</p>))
    );
};

const BookMarkBuilding = ({buildingList}) => {
    return (
        buildingList.map(building => (<p key={building._id}>{building.name}</p>))
    );
};

export default BookMarkContainer;

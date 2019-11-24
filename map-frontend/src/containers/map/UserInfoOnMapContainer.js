import React, {useEffect, useState} from "react";
import client from "../../lib/api/client";
import {setCommentList} from '../../modules/map';
import {useDispatch, useSelector} from "react-redux";
import InfoWindowList from "../../components/map/InfoWindowList";


const UserInfoOnMapContainer = ({zoom}) => {
    const [loading, setLoading]= useState(false);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [roadInfo, setRoadInfo] = useState(null);
    const [bundleInfo, setBundleInfo] = useState(null);
    const [visible, setVisible] = useState(null);
    const dispatch = useDispatch();
    const { commentList,searchQuery, searchQueryType, searchQueryOption } = useSelector(({map, loading}) => ({
        commentList : map.commentList,
        searchQueryType: map.searchQuery.searchQueryType,
        searchQuery: map.searchQuery.searchQuery,
        searchQueryOption: map.searchQuery.searchQueryOption
    }));

    const onClick = () => {
        if(!visible) setVisible(true);
        else setVisible(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.dir(searchQueryType);
            try {
                if(searchQueryType === 'place') {
                    const response = await client.get('/api/map/userPlace');
                    setPlaceInfo(response.data);
                } else if ( searchQueryType === 'road'){
                    const response = await client.get('/api/map/userRoad');
                    setRoadInfo(response.data);
                } else{
                    const response = await client.get('api/map/userBundle');
                    setBundleInfo(response.data);
                }
            } catch (e) {
                console.dir(e);
            }
            setLoading(false);
        };
        fetchData();
    }, [searchQueryType]);

    useEffect(() => {
        console.dir(placeInfo);
        if(placeInfo) dispatch(setCommentList(placeInfo));
    }, [placeInfo]);

    useEffect(() => {
        console.dir(bundleInfo);
    }, [bundleInfo]);

    if (loading) return <h2>로딩중...</h2>;
    if (searchQueryType === 'place' && !placeInfo ) return null;
    if (searchQueryType === 'road' && !roadInfo) return null;
    if( searchQueryType === 'bundle' && !bundleInfo) return null;

    return (
        <>
            {searchQueryType === 'place' && <InfoWindowList placeInfo={placeInfo} roadInfo={null} zoom={zoom}/>}
            {searchQueryType === 'road' && <InfoWindowList roadInfo={roadInfo} placeInfo={null} zoom={zoom}/>}
            {searchQueryType === 'bundle'&&
            bundleInfo.map(bundle => (<InfoWindowList placeInfo={bundle.placeList} roadInfo={bundle.roadList}
                zoom={zoom} key={bundle._id}/>))}
        </>
    );
};

export default UserInfoOnMapContainer;

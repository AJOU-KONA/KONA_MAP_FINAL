import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import client from "../../lib/api/client";
import UserPostShowForm from "../../components/auth/UserPostShowForm";
import styled from "styled-components";

const UserPostShowWrapper = styled.div`
    padding-left: 60px;
`;

const UserPostShowContainer = () => {
    const [loading, setLoading] = useState(false);
    const [postList, setPostList] = useState(null);
    const [roadList, setRoadList] = useState(null);
    const [buildingList, setBuildingList]= useState(null);
    const [bundleList, setBundleList] = useState(null);

    const {username} = useSelector(({user}) => ({
       username : user.user.username,
    }));

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try{
                const response = await client.get(`/api/map/username/${username}`);
                const response2 = await client.get(`/api/map/userRoad/username/${username}`);
                const response3 = await client.get(`/api/map/userBuilding/username/${username}`);
                const response4 = await client.get(`/api/map/userBundle/username/${username}`);
                setPostList(response.data);
                setRoadList(response2.data);
                setBuildingList(response3.data);
                setBundleList(response4.data);
            }catch(e){
                console.dir(e);
            }
            setLoading(false);
        };
        fetchPost();
    }, []);

    useEffect(() => {
        console.dir(postList);
        console.dir(roadList);
        console.dir(buildingList);
        console.dir(bundleList);
    }, [postList, roadList, buildingList, bundleList]);

    if(loading) return <h2>로딩중...</h2>;
    if(!postList || !roadList || !buildingList || !bundleList ) return null;

    return(
        <UserPostShowWrapper>
            <UserPostShowForm postList={postList} roadList={roadList} buildingList={buildingList}
            bundleList={bundleList} setPostList={setPostList} setBuildingList={setBuildingList}
            setRoadList={setRoadList} setBundleList={setBundleList}/>
        </UserPostShowWrapper>
    )
};

export default UserPostShowContainer;

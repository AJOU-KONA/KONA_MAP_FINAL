import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';

import {Navbar, Nav, Form, FormControl, Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {clearMap, setSearchQuery} from "../../modules/map";
import {FiMapPin, FaRoad, FaRegBuilding} from "react-icons/all";

const StyledHeader = styled.div`
    padding-left: 60px;
`;

const Header = ({user, onLogout, setAddInfo, setAddRoad, setAddBuilding}) => {
    const dispatch = useDispatch();
    const {searchQueryOnMap, isClearMap} = useSelector(({map}) => ({
        searchQueryOnMap: map.searchQuery.searchQueryOnMap,
        isClearMap : map.isClearMap
    }));

    const [optionValue, setOptionValue] = useState('');
    const [type, setType] = useState('place');
    const [option, setOption] = useState('name');

    const onChangeSearchQuery = useCallback(
        e => {
            setOptionValue(e.target.value);
        }, [optionValue]);

    const onChangeSearchOption = useCallback(
        e => {
            setOption(e.target.value);
        }, [option]);

    const onChangeSearchQueryType = useCallback(
        e => {
            //console.dir(e.target.value);
            setType(e.target.value);
        }, [type]);

    const onSubmit = useCallback(
        e => {
            console.dir('검색');
            e.preventDefault();
            dispatch(clearMap(false));
            dispatch(setSearchQuery({
                searchQuery: optionValue,
                searchQueryType: type,
                searchQueryOnMap: true,
                searchQueryOption: option,
                }));
        }, [dispatch, optionValue, option, type]);

    return (
        <StyledHeader>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/map">KONA MAP SERVICE</Navbar.Brand>
                <Nav className="mr-auto">
                    {user && <Nav.Link onClick={onLogout}>로그아웃</Nav.Link>}
                    {!user && <Nav.Link href="/login">로그인</Nav.Link>}
                </Nav>
                <Form inline onKeyPress={onSubmit}>
                    <Form.Group style={{paddingRight: 10}}>
                        <Button onClick={setAddInfo}><FiMapPin/></Button>
                        <div style={{paddingRight: 10}}/>
                        <Button onClick={setAddRoad}><FaRoad/></Button>
                        <div style={{paddingRight: 10}}/>
                        <Button onClick={setAddBuilding}><FaRegBuilding/></Button>
                    </Form.Group>
                    <Form.Group>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2"
                        value={optionValue} onChange={onChangeSearchQuery}/>
                        <Form.Control as="select" value={type} onChange={onChangeSearchQueryType}>
                            <option value="place">위치 검색</option>
                            <option value="road">경로 검색</option>
                            <option value="building">건물 검색</option>
                            <option value="bundle">모음 검색</option>
                        </Form.Control>
                        <Form.Control as="select" value={option} onChange={onChangeSearchOption}>
                            <option value="name">이름</option>
                            <option value="tag">태그</option>
                            <option value="description">설명</option>
                        </Form.Control>
                        <div style={{paddingLeft: 10}}/>
                        <Button variant="primary"
                        onSubmit={onSubmit} onClick={onSubmit}>검색</Button>
                    </Form.Group>
                </Form>
            </Navbar>
        </StyledHeader>
    );
};

/*
        <>
            <HeaderBlock>
                <Wrapper>
                    <Link to="/map" className="logo">KONA MAP SERVICE</Link>
                    {user ?
                        ( <div className="right">
                            <UserInfo>{user.username}</UserInfo>
                                <Button to='/userInfo'>유저정보</Button>
                            <Button onClick={onLogout}>로그아웃</Button>
                        </div>
                        ):
                        ( <div className="right">
                                <Button to="/login">로그인</Button>
                            </div>
                        )}
                </Wrapper>
            </HeaderBlock>
            <Spacer/>
        </>
        */

export default Header;


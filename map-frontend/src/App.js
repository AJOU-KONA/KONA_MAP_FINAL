import React, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import SideBarContainter from "./containers/map/SideBarContainer";
import HeaderContainer from "./containers/common/HeaderContainer";
import AlertModal from "./components/common/AlertModal";
import {useSelector} from "react-redux";
import {withRouter} from 'react-router-dom';


const App = ({history}) => {
    const {user} = useSelector(({user}) => ({
        user: user.user
    }));

    useEffect(() => {
        if(!user){
            history.push('/login');
        }
    }, [user]);

    return (
        <>
            <AlertModal bodyText="helhelh" titleText="asdfasdf"/>
            <HeaderContainer/>
            <SideBarContainter/>
            <>
                <Helmet>
                    <title>KONA</title>
                </Helmet>
            </>

        </>
    );
};

export default withRouter(App);

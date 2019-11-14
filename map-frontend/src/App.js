import React from 'react';
import {Route} from 'react-router-dom';
import PostPage from "./pages/PostPage";
import PostListPage from "./pages/PostListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WritePage from "./pages/WritePage";
import MapPage from "./pages/MapPage";
import {Helmet} from 'react-helmet-async';
import UserInfoPage from "./pages/UserInfoPage";
import UserPlacePage from "./pages/UserPlacePage";
import CommentContainer from "./components/map/CommentContainer";
import GeoPage from "./pages/GeoPage";

const App = () => {
    return (
        <>
            <Helmet>
                <title>KONA</title>
            </Helmet>
            <Route component={PostListPage} path={[`/@:username`]} exact/>
            <Route component={LoginPage} path="/login"/>
            <Route component={RegisterPage} path="/register"/>
            <Route component={WritePage} path="/write"/>
            <Route component={PostPage} path="/@:username/:postId"/>
            <Route component={MapPage} path={["/map"]} />
            <Route component={UserInfoPage} path={"/userInfo"}/>
            <Route component={UserPlacePage} path={"/userplace"}/>
            <Route component={GeoPage} path={"/geo"}/>
        </>
    );
};

export default App;

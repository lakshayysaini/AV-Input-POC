import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainAVPage from '../pages/MainAVPage';
import TalkingAvatarPage from '../pages/TalkingAvatarPage';

function RoutesContainer() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <MainAVPage /> } />
                <Route path="/talking_avatar" element={ <TalkingAvatarPage /> } />
            </Routes>
        </Router>
    );
}

export default RoutesContainer;
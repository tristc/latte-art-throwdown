import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Bracket from './pages/Bracket';
import Match from './pages/Match';
import CheckIn from './pages/CheckIn';
import Profile from './pages/Profile';
import MyEvents from './pages/MyEvents';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
          <Route path="/bracket/:eventId" element={<Layout><Bracket /></Layout>} />
          <Route path="/match/:id" element={<Layout><Match /></Layout>} />
          
          {/* Protected Routes */}
          <Route path="/create-event" element={
            <Layout>
              <ProtectedRoute requireOrganizer>
                <CreateEvent />
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/checkin/:eventId" element={
            <Layout>
              <ProtectedRoute>
                <CheckIn />
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/profile" element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/my-events" element={
            <Layout>
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            </Layout>
          } />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

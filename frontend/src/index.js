import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import './index.css'
import useAuth, { AuthProvider } from './utils/useAuth'
import PropTypes from 'prop-types'
import Landing from './routes/landing'
import Register from './routes/register'
import ResetForm from './routes/reset-form'
import Dashboard from './routes/dashboard'
import AccountDetails from './components/account-details'
import GroupList from './components/groups/group-list'
import reportWebVitals from './reportWebVitals'
import GroupSettings from './routes/group-settings'
import Members from './components/group-settings/members'

function RequireAuth({ children }) {
  const { isAuthed, isLoading, setCb } = useAuth()
  const location = useLocation()
  const path = location.pathname
  const navigate = useNavigate()

  if (isLoading) {
    setCb((authed) => {
      if (authed && path != '/dashboard') navigate(path)
    })
  }

  return isAuthed() ? children : <Navigate to="/" replace state={{ path }} />
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
}

function RequireUnauth({ children }) {
  const { isAuthed } = useAuth()
  return isAuthed() ? <Navigate to="/dashboard" replace /> : children
}

RequireUnauth.propTypes = {
  children: PropTypes.node.isRequired,
}

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <RequireUnauth>
              <Landing />
            </RequireUnauth>
          } />
          <Route path="register" element={
            <RequireUnauth>
              <Register />
            </RequireUnauth>
          } />
          <Route path="reset" element={
            <RequireUnauth>
              <ResetForm />
            </RequireUnauth>
          } />
          <Route path="/dashboard/" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } >
            <Route path="" element={<AccountDetails />} />
            <Route path="groups" element={<GroupList />} />
          </Route>
          <Route path="/groups/:groupId" element={
            <RequireAuth>
              <GroupSettings />
            </RequireAuth>
          }>
            <Route path="" />
            <Route path="members" element={<Members />} />
            <Route path="disband" />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import api, { getMe, userLogout } from '../../api';
import logoutApi from '../../api'

const scopes = {
  'admin': ['dispatch', 'routing', 'inbound_app', 'dashboard'],
  'super-admin': ['dispatch', 'routing', 'inbound_app', 'dashboard', 'admin_app'],
  'courier': ['dsp_app'],
  'client': ['client_app'],
  'client-admin': ['client_app'],
  'client-read-only': ['client_app'],
  'dispatcher': ['dispatch'],
  'warehouse-staff': ['inbound_app', 'outbound_dashboard'],
  'warehouse-manager': ['inbound_app', 'outbound_dashboard'],
  'warehouse-clerk': ['inbound_app', 'outbound_dashboard'],
  'finance-admin': ['payment_app'],
  'finance-manager': ['payment_app']
}
const appDataList = {
  'dispatch': {
    label: 'Dispatch App',
    color: 'purple',
    url: process.env.REACT_APP_DISPATCH_APP_URL,
  },
  'routing': {
    label: 'Routing App',
    color: 'blue-l',
    url: process.env.REACT_APP_ROUTING_APP_URL,
  },
  'dashboard': {
    label: 'Dashboard',
    color: 'orchid',
    url: process.env.REACT_APP_DASHBOARD_APP_URL,
  },
  'dsp_app': {
    label: 'DSP App',
    color: 'yellow-d',
    url: process.env.REACT_APP_DSP_APP_URL,
  },
  'client_app': {
    label: 'Client App',
    color: 'yellow-l',
    url: process.env.REACT_APP_CLIENT_APP_URL,
  },
  'admin_app': {
    label: 'Admin App',
    color: 'green-l',
    url: process.env.REACT_APP_ADMIN_APP_URL,
  },
  'inbound_app': {
    label: 'Inbound App',
    color: 'black',
    url: process.env.REACT_APP_INBOUND_APP_URL,
  },
  'outbound_dashboard': {
    label: 'Outbound Dashboard',
    color: 'brrown',
    url: process.env.REACT_APP_DASHBOARD_OUTBOUND_APP_URL,
  },
  'payment_app': {
    label: 'Payment App',
    color: 'red',
    url: process.env.REACT_APP_PAYMENT_APP_URL,
  }
}

export default function DashboardContainer() {
  const [login, setLogin] = useState(true);
  const [appList, setAppList] = useState([])
  const [username, setUsername] = useState([])
  
  useEffect(() => {
    
    getMe().then(res => {
      if(res.ok || res.status === 200) {
        const appSet = new Set()
        res.data.scopes.forEach(e => {
          if (scopes[e]) {
            scopes[e].forEach(f => appSet.add(f))
          }
        })
        setUsername(res.data.username)
        setAppList(Array.from(appSet))
        setLogin(true);
        return true;
      } else {
        setLogin(false);
        if (res.status === 400 && res.data.error_code !== null && res.data.error_code === "CHANGE_PASSWORD_REQUIRED") {
          window.location.href = '/change_password';
        } else {
          window.location.href = '/login';
        }
        return false;
      }
    });
  },[]);

  return login ? <DashboardComponent appList={appList} username={username}/> : null;
}

function DashboardComponent({ appList, username }) {
  return (<div className="background">
      <div className="container body-container">
        <div className="text-center app-container">
          <div className={`user-navigation`} >
            <button className={`navigation-button`} onClick={changePassword}>{`Change Password`}</button>
            <button className={`navigation-button`} onClick={logout}>{`Logout`}</button>
          </div>
          <div className="img">
            <img src="/static/assets/favicon.svg" alt="Axlehire" className="favicon" />
          </div>
          <div className="text text-center">Logged in as <b>{username}</b></div>
          <div className="text text-center">Choose the app you would like to access:</div>
          <div id="toastr"></div>
        <div className="box">
          {appList.map(e => <a key={e} href={appDataList[e].url} className={`btn-box ${appDataList[e].color}`}
            onClick={(e) => toastr(e)}>{appDataList[e].label}</a>)}
        </div>
        </div>
      </div>
    </div>);
}

function toastr(element) {
  var text = element.target.getAttribute('title'),
    url = element.target.getAttribute('href');

  var toastr = document.getElementById('toastr');
  toastr.innerHTML = 'Redirecting...';
  toastr.classList.add('fade');

  setTimeout(function() {
    toastr.classList.remove('fade');
    toastr.innerHTML = '';
    window.location.href = url;
  }, 800);

  return false;
}

function logout() {
  userLogout().then(res => {
    if(res.ok || res.status === 200) {
      window.location.href = '/login';
    }
  })
}

function changePassword() {
  window.location.href = '/change_password';
}

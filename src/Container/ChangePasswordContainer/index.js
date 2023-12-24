import React, { useEffect, useState, useRef } from 'react';
import api, { getMe, userLogout } from '../../api';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation
} from "react-router-dom";
//styles
import styles from './styles';


export default function ChangePasswordContainer() {
  const query = new URLSearchParams(window.location.search);
  const inputRef = useRef();
  useEffect(() => {
    getMe().then(res => {
      if(res.ok || res.status === 200 || 
        (res.status === 400 && res.data.error_code !== null && res.data.error_code === "CHANGE_PASSWORD_REQUIRED")
        || res.status === 202
        ) {
          return true;
      } else {
        window.location.href = '/login';
        return false;
      }
    });
    inputRef.current.focus();
  });
  return  <ChangePasswordComponent focus={inputRef} expire={query.get("expire") === "true"}/>;
}

function ChangePasswordComponent({focus: inputRef, expire}) {  
  // const inputRef = useRef();
  // inputRef.current.focus();
  
  function changePassword () {
    if (newPassword !== '' && newPassword === newPasswordConfirm) {
      api.post('/v1/change_password', {'new_password': newPassword }).then(
        response => {
          if (response.status === 200) {
            setSucceed(true);
            setChangePasswordStatus("Changed password succeed!");
            logout()
          } else {
            setSucceed(false);
            setChangePasswordStatus("Change password failed!\n" + response.data.message);
            setNewPasswordConfirm("");
            setNewPassword("");
            inputRef.current.focus();
          }
        }
      );
    } else {
      setChangePasswordStatus("Passwords mismatch!");
      setSucceed(false);
    }
  }

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [changePasswordStatus, setChangePasswordStatus] = useState("");
  const [succeed, setSucceed] = useState(true);

  const onPasswordChanged = (e) => {
    setNewPassword(e.target.value);
  }

  return (
    <div className="background">
      <div className="container body-container">
        <div className="text-center login-container">          
          <div className="img">
            <img src="/static/assets/favicon.svg" alt="Axlehire" className="favicon" />
          </div>
          {
            expire && <div className="text text-center alert-error expired">
              Your password has expired, please update your password.
            </div> 
          }
          <div className="text text-center" style={{margin:'15px 0px'}}>Please type your new password here</div>
          <form className="form-login" onSubmit={e => e.preventDefault()}>
            <input placeholder={`New Password`} type="password" value={newPassword} onChange={onPasswordChanged}  ref={inputRef} ></input>
            <input placeholder={`Confirm New Password`} type="password" value={newPasswordConfirm} onChange={e => setNewPasswordConfirm(e.target.value)} ></input>
            {!!changePasswordStatus && <div>
                { succeed ? (
                  <span className="alert-success text-alert">{changePasswordStatus}</span>
                ) : (
                  <span className="alert-error text-alert">
                    {
                      changePasswordStatus.split('\n').map((i,key) => {
                        return <div key={key}>{i}</div>;
                      })
                    }
                  </span>
                )}
              </div>}
            <button disabled={!newPassword} id="sm" type="submit" className="u-full-width button-primary" value="Change Password" onClick={changePassword}>{`Change Password`}</button>
              
          </form>
        </div>
      </div>
    </div>);
}
function logout() {
  userLogout().then(res => {
    if(res.ok || res.status === 200) {
      window.location.href = '/login';
    }
  })
}

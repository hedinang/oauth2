import React from 'react';
import styles from './styles';
import api from "../../api";

export const ListUserUnAuthorization = ({users, wraning = null, backToLogin = () => {}, tokenId = null, ...props}) => {

  const login = (tokenId, userId) => {
    if (!tokenId) {
      return;
    }
    const confirmAction = window.confirm(`Are you sure login user - ${userId}`);

    if (!confirmAction) {
      return false;
    }

    const that = this;
    api.post('/v1/login/google', {
      'google_token_id': tokenId,
      selected_user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res)
      if (res.ok || res.status === 200) {
        window.location.href = '/'
      }
    });
  }

  return <div style={styles.container}>
    <div style={styles.inner}>
      {wraning && <div style={styles.textWraning}>{wraning}</div>}
      <br />
      <div style={styles.textIntro}>{`Select account would you like login:`}</div>
      <br />
      <div style={styles.scrollList}>
        <div style={styles.wrap}>
          {users.map((user, index) => <div style={styles.boxWrap} key={index} onClick={() => login(tokenId, user.id)}>
            <div style={styles.box}>
              <div style={styles.textName}>{user.username}</div>
              <div>
                <div style={styles.text}>
                  <b style={styles.label}>{`ID:`}</b>
                  <span style={styles.textOver}>{user.id}</span>
                </div>
                <div style={styles.text}>
                  <b style={styles.label}>{`Email:`}</b>
                  <span style={styles.textOver}>{user.email}</span>
                </div>
                <div style={styles.text}>
                  <b style={styles.label}>{`Phone:`}</b>
                  <span style={styles.textOver}>{user.phone_number}</span>
                </div>
              </div>
            </div>
          </div>)}
        </div>
      </div>
      <br />
      <button type="submit" className="u-max-full-width button-secondary" value="Login" onClick={backToLogin}>{`Back to Login`}</button>
    </div>
  </div>;
}

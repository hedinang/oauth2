import React, { useEffect } from 'react';
import api, { getMe } from '../../api';
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AuthorizedContainer() {
  const query = useQuery();
  const params = {
    "response_type": "code",
    "client_id": query.get("client_id"),
    "redirect_uri": query.get("redirect_uri") || '/',
    "next": query.get("next") || '/',
  };

  useEffect(() => {
    getMe().then(res => {
      if(res.ok || res.status === 200) {
        api.post("v1/authorize", params).then(res => {
          if(res.ok || res.status === 200) {
            window.location.href = query.get("next");
          }
        });
        return true;
      } else {
        if (res.status === 400 && res.data.error_code !== null && res.data.error_code === "CHANGE_PASSWORD_REQUIRED") {
          window.location.href = '/change_password';
        } else {
          window.location.href = '/login';
        }
        return false;
      }

    });
  });
  return(<div />);
}

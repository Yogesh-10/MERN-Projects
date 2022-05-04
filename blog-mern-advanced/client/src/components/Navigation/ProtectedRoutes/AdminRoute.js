import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  //check if user is logged in
  const user = useSelector((state) => state?.users);
  const { userAuth } = user;
  return (
    <Route
      {...rest}
      render={(props) =>
        userAuth?.isAdmin ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default AdminRoute;

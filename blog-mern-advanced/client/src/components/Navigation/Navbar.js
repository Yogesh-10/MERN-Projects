import React from 'react';
import { useSelector } from 'react-redux';

import AdminNavbar from './Admin/AdminNavbar';
import AccountVerificationAlertWarning from './Alerts/AccountVerificationAlertWarning';
import AccountVerificationSuccessAlert from './Alerts/AccountVerificationSuccessAlert';
import PrivateNavbar from './Private/PrivateNavbar';
import PublicNavbar from './Public/PublicNavbar';

const Navbar = () => {
  //ge user from store
  const state = useSelector((state) => state.users);
  const { userAuth } = state;
  const isAdmin = userAuth?.isAdmin;

  //account verification
  const account = useSelector((state) => state?.accountVerification);
  const { loading, appErr, serverErr, token } = account;

  return (
    <>
      {isAdmin ? (
        <AdminNavbar userAuth={userAuth} />
      ) : userAuth ? (
        <PrivateNavbar userAuth={userAuth} />
      ) : (
        <PublicNavbar />
      )}

      {/* Display alert */}
      {userAuth && !userAuth.isVerified && <AccountVerificationAlertWarning />}
      {/* display success msg */}
      {loading && <h2 className='text-center'>Loading please wait...</h2>}
      {token && <AccountVerificationSuccessAlert />}
      {appErr || serverErr ? (
        <h2 className='text-center text-red-500'>
          {serverErr} {appErr}
        </h2>
      ) : null}
    </>
  );
};

export default Navbar;

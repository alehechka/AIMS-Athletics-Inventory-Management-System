import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

export default ({ component: Component, accessGranted, ...rest }) => {
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={props => context.authorized && accessGranted ? (
            <Component {...props} />
          ) : (
            <Redirect to={{
              pathname:'/home'
            }} />
          )}
        />
      )}
    </Consumer>
  );
};
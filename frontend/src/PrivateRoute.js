import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={props => context.authorized ? (
            <Component {...props} />
          ) : (
            <Redirect to={{
              pathname:'/login',
              state: { from: props.location},
            }} />
          )}
        />
      )}
    </Consumer>
  );
};
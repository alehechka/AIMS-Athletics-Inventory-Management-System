import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(NavLink)`
  text-decoration: none;
  &:focus {
    color: #696969;
    background: #696969;
  },
  &:hover {
    color: #696969;
    background: #696969;
  },
  &:visited {
    color: #696969;
    background: #696969;
  },
  &:link {
    color: #696969;
    background: #696969;
  },
  &:active {
    text-decoration: none;
    color: #696969;
    background: #696969;
  }
`;
export default (props) => <StyledLink {...props} />;

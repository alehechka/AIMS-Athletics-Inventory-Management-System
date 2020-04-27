import React from "react";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

/**
 * Special chip item with icon to be rendered.
 * 
 * @param {Object} props - passed down from Users.js
 * @param {Object} props.sport - Sport object to be converted to chip with name and icon.
 */
export default function SportsChip({ sport }) {
  return (
    <Chip
      label={sport.displayName}
      style={{ margin: 2 }}
      icon={sport.icon && <Icon className={sport.icon}>{sport.icon}</Icon>}
    ></Chip>
  );
}

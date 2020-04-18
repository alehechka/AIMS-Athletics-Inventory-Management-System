import React from "react";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

export default function SportsChip({ sport }) {
  return (
    <Chip
      label={sport.displayName}
      style={{ margin: 2 }}
      icon={sport.icon && <Icon className={sport.icon}>{sport.icon}</Icon>}
    ></Chip>
  );
}

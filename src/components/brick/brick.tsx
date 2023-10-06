import { BeaterBrickCollision } from "../../events/event-map";
import "./brick.scss";

import React from "react";

interface BrickProps {
  data: BeaterBrickCollision;
}

export const Brick: React.FC<BrickProps> = ({ data }) => {
  const { brickName } = data;

  return <div className={"brick " + brickName}></div>;
};

import { BrickName } from "../../types/brick-name";
import "./brick.scss";

import React from "react";

interface BrickProps {
  brickName: BrickName;
}

export const Brick: React.FC<BrickProps> = ({ brickName }) => {
  return <div className={"brick " + brickName}></div>;
};

import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type ModuleCardProps = {
  module: Models.Document;
};

const ModuleCard = ({ module }: ModuleCardProps) => {
  return (
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          @{module.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{module.discription}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{module.studylevel}
        </p>
      </div>
  );
};

export default ModuleCard;

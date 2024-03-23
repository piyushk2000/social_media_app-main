import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { useGetModules, useGetModulesById, useGetPostById } from "@/lib/react-query/queries";
import ModuleForm from "@/components/forms/ModuleForm";
import { useEffect } from "react";

const EditModule = () => {
  const { id } = useParams();
  const { data: module, isLoading } = useGetModulesById(id);

  // useEffect(() => {
  //   console.log(module)
  // }, [isLoading,module])


  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );



  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Module</h2>
        </div>

        {isLoading ? <Loader /> : <ModuleForm action="Update" module={module} />}
      </div>
    </div>
  );
};

export default EditModule;

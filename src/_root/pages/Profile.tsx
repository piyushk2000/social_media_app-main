import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queries";
import { GridPostList, Loader } from "@/components/shared";
import { useEffect, useState } from "react";
import React from "react";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);



const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const [otherField, setOtherField] = useState(null)

  const [selected, setSelected] = React.useState<string[]>([]);
  const [selectedQualifications, setSelectedQualifications] = React.useState<string[]>([]);
  const [CurrentBio, setBio] = React.useState(null)

  const qualifications: OptionType[] = [
    { label: 'GCSE (General Certificate of Secondary Education)', value: 'gcse' },
    { label: 'A-levels (Advanced Level)', value: 'a_levels' },
    { label: 'BTEC (Business and Technology Education Council)', value: 'btec' },
    { label: 'Foundation Degree', value: 'foundation_degree' },
    { label: "Bachelor's Degree", value: 'bachelors_degree' },
    { label: "Master's Degree", value: 'masters_degree' },
    { label: 'Doctorate (Ph.D.)', value: 'phd' },
    { label: 'HND (Higher National Diploma)', value: 'hnd' },
    { label: 'NVQ (National Vocational Qualification)', value: 'nvq' },
    { label: 'PGCE (Postgraduate Certificate in Education)', value: 'pgce' }
  ];

  const subjects: OptionType[] = [
    { label: 'Mathematics', value: 'mathematics' },
    { label: 'English Language', value: 'english_language' },
    { label: 'Sciences', value: 'sciences' },
    { label: 'History', value: 'history' },
    { label: 'Geography', value: 'geography' },
    { label: 'Literature', value: 'literature' },
    { label: 'Foreign Languages', value: 'foreign_languages' },
    { label: 'Computer Science', value: 'computer_science' },
    { label: 'Art and Design', value: 'art_and_design' },
    { label: 'Music', value: 'music' },
    { label: 'Physical Education', value: 'physical_education' },
    { label: 'Religious Studies or Ethics', value: 'religious_studies_or_ethics' },
    { label: 'Home Economics', value: 'home_economics' },
    { label: 'Psychology', value: 'psychology' },
    { label: 'Technology', value: 'technology' }
  ];

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  // console.log(currentUser)

  useEffect(() => {
    if (currentUser && currentUser.hasOwnProperty('bio')) {
      try {
        const bioObject = JSON.parse(currentUser.bio);
        setSelectedQualifications(bioObject?.qualifications)
        setSelected(bioObject?.subject)
        setBio(bioObject?.bio)
        setOtherField(bioObject)
      } catch {
        console.log('json invalid')
      }
    }
  }, [currentUser])





  useEffect(() => {
    if (currentUser && currentUser.hasOwnProperty('bio')) {
      try {
        const bioObject = JSON.parse(currentUser.bio);
        console.log('qualifications', bioObject.qualifications)
        setOtherField(bioObject)
      } catch {
        console.log('json invalid')
      }
    }
  }, [currentUser])


  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );



  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              {/* <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" /> */}
            </div>
            <>


              {(CurrentBio) &&
                (<>
                  <div className="App mt-5">
                    <label className="shad-form_label -mb-2">Bio</label>
                    <p className="small-medium md:base-medium text-center xl:text-left max-w-screen-sm">
                      {CurrentBio}
                    </p>
                  </div>
                </>
                )}

              {(selected.length !== 0) &&
                (<>
                  <div className="App mt-5">
                    <label className="shad-form_label -mb-2">Subjects</label>
                    <div className="flex gap-1 flex-wrap">
                      {selected.map((item) => (
                        <Badge
                          // variant="outline"
                          key={item}
                          className="mr-1 mb-1 mt-1"

                        >
                          {Object.values(subjects).find((subject) => subject.value === item)?.label || item}
                          <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          </button>
                        </Badge>
                      ))}

                    </div>
                  </div>
                </>)}
              {(selectedQualifications.length !== 0) &&
                (<>
                  <div className="App mt-5">
                    <label className="shad-form_label -mb-2">Qualifications</label>
                    <div className="flex gap-1 flex-wrap">
                      {selectedQualifications.map((item) => (
                        <Badge
                          // variant="outline"
                          key={item}
                          className="mr-1 mb-1 mt-1"

                        >
                          {Object.values(qualifications).find((qualification) => qualification.value === item)?.label || item}
                          <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>)}



            </>

          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.$id && "hidden"
                  }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;

import React from "react";
import BucketList from "../../components/Lead/bucket/leadBucket";

const index = () => {
  // const user = useSelector((store: RootState) => store.auth.user);

  return (
    <div className="container-fluid">
      <BucketList />
      {/* <ForwardLeadList />
      <PickedLeadList /> */}
    </div>
  );
};

export default index;

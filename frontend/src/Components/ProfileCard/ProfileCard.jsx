import React from 'react';
import './ProfileCard.scss';
import img from './profile.jpg';

const ProfileCard = ({profilename}) => {
  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <img src={img} alt= "" className="profile-picture"/><br />
        <h3 className="profile-name"><span>{profilename}</span></h3>
        
      </div>
      <div className="profile-card-stats">
        <div className="profile-card-stat1">
          {/* {followers} */}
          <span><span>0 </span>Followers</span>
        </div>
        <div className="profile-card-stat2">
          {/* {followings} */}
          <span><span>0 </span>Following</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
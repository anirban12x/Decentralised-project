import React from "react";
import "./RepoCard.scss";
import { Link } from "react-router-dom";

const RepoCard = ({profileName,repoName}) => {
    return(
        <Link to = {`/${profileName}/${repoName}`}>
            <div className="repo-card-2">
                <div className="repo-card-2-header">
                    <h3 className="repo-card-2-name">{repoName}</h3>
                    <p className="repo-card-2-description">New Project</p>
                </div>
                <div className="repo-card-2-footer">
                    <span className="repo-card-2-stat">Created Today</span>
                    <div className="repo-card-2-language">
                        <span className="repo-card-2-language-badge">Javascript</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default RepoCard;
import React from "react";

const NewsItem = (props) => {
  const { title, description, imageUrl, newsUrl, author, date, source } = props;

  const defaultImage =
    "https://imgs.search.brave.com/UVF7ihMrfRhGAX550YBTeOwIGALZvnkkY9s47mFlDAU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZWltZy5vcmcv/YXNzZXRzL2ltYWdl/cy9wb3N0cy9mYWtl/L3RodW1iLzY5YjNk/Y2Y5MGY3YjNfYnVz/aW5lc3Mtd29tYW4t/YW5hbHl6aW5nLWdy/YXBocy1vbi1sYXB0/b3AucG5n";

  const formattedDate = date
    ? new Date(date).toGMTString()
    : "Date not available";

  return (
    <div className="my-3">
      <div className="card">
        {/* Source Badge */}
        <span
          className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
          style={{
            left: "85%",
            zIndex: "1",
          }}
        >
          {source || "News"}
        </span>

        {/* News Image */}
        <img
          src={imageUrl || defaultImage}
          className="card-img-top"
          alt="news"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />

        <div className="card-body">
          {/* Title */}
          <h5 className="card-title">{title}</h5>

          {/* Description */}
          <p className="card-text">{description}</p>

          {/* Author and Date */}
          <p className="card-text">
            <small className="text-danger">
              By {author || "Unknown"} on {formattedDate}
            </small>
          </p>

          {/* Read More */}
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-dark"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;

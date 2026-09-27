import React, { useState, useEffect, useRef, useCallback } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [progress, setProgress] = useState(30);
  const [error, setError] = useState(null);

  const isFetching = useRef(false);

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchNews = useCallback(
    async (pageNumber) => {
      if (isFetching.current) {
        return;
      }

      isFetching.current = true;

      setLoading(true);
      setProgress(30);
      setError(null);

      try {
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;

        if (!apiKey) {
          throw new Error("API key not found. Check your .env file.");
        }

        const url =
          `https://newsapi.org/v2/top-headlines` +
          `?country=${props.country}` +
          `&category=${props.category}` +
          `&apiKey=${apiKey}` +
          `&page=${pageNumber}` +
          `&pageSize=${props.pageSize}`;

        setTimeout(() => {
          if (isFetching.current) {
            setProgress(70);
          }
        }, 300);

        const response = await fetch(url);

        const data = await response.json();

        console.log("NewsAPI Response:", data);

        if (data.status !== "ok") {
          const apiMessage = data.message || "Unable to fetch news.";

          console.error("NewsAPI Error:", apiMessage);

          setLoading(false);
          setProgress(100);
          setError(apiMessage);
          setHasMore(false);

          isFetching.current = false;
          return;
        }

        const newArticles = data.articles || [];
        const total = data.totalResults || 0;

        setArticles((previousArticles) =>
          pageNumber === 1
            ? newArticles
            : [...previousArticles, ...newArticles],
        );

        setPage(pageNumber);
        setTotalResults(total);
        setProgress(100);

        setHasMore(
          newArticles.length > 0 && pageNumber * props.pageSize < total,
        );

        setError(null);

        setTimeout(() => {
          setLoading(false);
        }, 200);
      } catch (err) {
        console.error("Failed to fetch news:", err);

        setLoading(false);
        setProgress(100);
        setError(err.message || "Failed to fetch news.");
        setHasMore(false);
      }

      isFetching.current = false;
    },
    [props.country, props.category, props.pageSize],
  );

  const loadNextPage = useCallback(async () => {
    if (isFetching.current || !hasMore || error) {
      return;
    }

    setLoading(true);
    setProgress(30);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const nextPage = page + 1;

    await fetchNews(nextPage);
  }, [hasMore, error, page, fetchNews]);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore || error || isFetching.current) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const windowHeight = window.innerHeight;

    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 300) {
      loadNextPage();
    }
  }, [loading, hasMore, error, loadNextPage]);

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;

    setArticles([]);
    setLoading(true);
    setPage(1);
    setTotalResults(0);
    setHasMore(true);
    setProgress(30);
    setError(null);

    fetchNews(1);
  }, [props.category, props.country, fetchNews]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            backgroundColor: "transparent",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "3px",
              backgroundColor: "red",
              transition: "width 0.4s ease",
              boxShadow: "0 0 8px red",
            }}
          />
        </div>
      )}

      <div className="container my-3">
        <h1
          className="text-center"
          style={{
            margin: "35px 0px",
            marginTop: "90px",
          }}
        >
          NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
        </h1>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            <strong>Unable to load news</strong>
            <br />
            {error}
            <br />
            <small>
              Please check your API key, NewsAPI limit, or internet connection.
            </small>
          </div>
        )}

        <div className="row">
          {articles.map((element, index) => (
            <div
              className="col-md-4"
              key={element.url || `${element.title}-${index}`}
            >
              <NewsItem
                title={element.title || ""}
                description={element.description || ""}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
                author={element.author}
                date={element.publishedAt}
                source={element.source?.name || ""}
              />
            </div>
          ))}
        </div>

        {loading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              minHeight: "180px",
              width: "100%",
            }}
          >
            <Spinner />
          </div>
        )}

        {!loading && !hasMore && !error && articles.length > 0 && (
          <div className="text-center my-4">
            <p className="text-muted">You have reached the end of the news.</p>
          </div>
        )}
      </div>
    </div>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 6,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;

const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  const articleQuery =
    "SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count " +
    "FROM articles " +
    "LEFT JOIN comments " +
    "ON articles.article_id = comments.article_id " +
    "GROUP BY articles.article_id " +
    "ORDER BY created_at DESC;"

  return db.query(articleQuery).then(({ rows }) => {
    return rows;
  });
};

const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");



afterAll(() => {
  if (db.end) return db.end();
});

beforeEach(() => {
  return seed(testData);
});



describe("app", () => {
  it("should error with a 404: Not Found, when route doesnt exist", () => {
    return request(app)
      .get("/*")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not Found");
      });
  });
});

describe("/api/topics", () => {
  it("200: should respond with an array of topic objects, including properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: topics }) => {
        const topicsArr = topics.topics;
        expect(topicsArr).toHaveLength(3);
        topicsArr.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/articles", () => {
  it("200: should respond with an array of topic articles, including properties author, title, article_id, topic, created_at, votes and comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        const articlesArr = articles.articles;
        expect(articlesArr).toHaveLength(12);
        articlesArr.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  it("should return the articles ordered by creation date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        const articlesArr = articles.articles;
        expect(
            articlesArr.every((article, index) => {
            return index === 0 || article.created_at <= articlesArr[index - 1].created_at;
          })
        ).toBe(true);
      });
  });

});

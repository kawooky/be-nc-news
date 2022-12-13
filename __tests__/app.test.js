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

describe("GET /api/topics", () => {
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

describe("GET /api/articles", () => {
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
            return (
              index === 0 ||
              article.created_at <= articlesArr[index - 1].created_at
            );
          })
        ).toBe(true);
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  it("should respond with a status 200 with the article object with the corresponding article_id", () => {
    const articleId = 2;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: articleId,
          title: "Sony Vaio; or, The Laptop",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
        });
      });
  });

  describe("errors", () => {
    it("should return a 404 Not Found error when endpoint provided an id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Not Found" });
        });
    });

    it('should return a 400 Bad Request error when endpoint provided an id that is the wrong data type', () => {
        return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        const body = res.body;
        expect(body).toEqual({ message: "Bad Request" });
      });
    });
  });
});


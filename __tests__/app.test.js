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

describe("GET /api/articles/:article_id", () => {
  it("should respond with a status 200 with the article object with the corresponding article_id", () => {
    const articleId = 2;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
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

    it("should return a 400 Bad Request error when endpoint provided an id that is the wrong data type", () => {
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

describe("GET /api/articles/:article_id/comments", () => {
  it("should return an array of comments with the corresponding article_id with properties comment_id, votes, created_at author, body", () => {
    const articleId = 3;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        const commentsArr = body.comments;
        expect(commentsArr).toHaveLength(2);
        commentsArr.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
      });
  });

  it("should return the comments with the most recent comment first (created_at in descending order)", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        const commentsArr = body.comments;
        expect(
          commentsArr.every((comment, index) => {
            return (
              index === 0 ||
              comment.created_at <= commentsArr[index - 1].created_at
            );
          })
        ).toBe(true);
      });
  });

  it("should respond with a empty array when the id exists but there are no comments", () => {
    const articleId = 2;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });

  describe("errors", () => {
    it("should return a 404 Not Found error when endpoint provided an id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Not Found" });
        });
    });

    it("should return a 400 Bad Request error when endpoint provided an id that is the wrong data type", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Bad Request" });
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should respond with the created row and status 201", () => {
    const requestBody = {
      username: "butter_bridge",
      body: "I buttered a butter bridge",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(201)
      .then((res) => {
        const postedComment = res.body.comment;
        expect(postedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });

  describe("errors", () => {
    describe("errors involving id", () => {
      it("should return a 404 Not Found error when endpoint provided an id that doesnt exist", () => {
        const requestBody = {
          username: "butter_bridge",
          body: "I buttered a butter bridge",
        };
        return request(app)
          .post("/api/articles/99999/comments")
          .send(requestBody)
          .expect(404)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Not Found" });
          });
      });

      it("should return a 400 Bad Request error when endpoint provided an id that is the wrong data type", () => {
        return request(app)
          .post("/api/articles/hello/comments")
          .expect(400)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
    });

    it("should respond with a status 400 and error message Bad Request when sent a object with a malformed body", () => {
      const requestBody = {};
      return request(app)
        .post("/api/articles/2/comments")
        .send(requestBody)
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Bad Request" });
        });
    });

    it("should respond with a status 400 and error message Bad Request when the user sends a comment object with incorrect data types", () => {
      const requestBody = {
        username: "butter_bridge",
        body: { wad: 22 },
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(requestBody)
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Bad Request" });
        });
    });

    describe("username error", () => {
      it("responds with a 404 Not Found when passed a username which is the correct data type but doesnt exist", () => {
        const requestBody = {
          username: "butter",
          body: "string",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(requestBody)
          .expect(404)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Not Found" });
          });
      });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("should respond with a status 200 and the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((res) => {
        const updatedArticle = res.body.article;
        expect(updatedArticle).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  it("should respond with a status 200 and the updated article when the inc_votes value is negative", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((res) => {
        const updatedArticle = res.body.article;
        expect(updatedArticle).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  describe("errors", () => {
    describe("errors involving id", () => {
      it("should return a 404 Not Found error when endpoint provided an id that doesnt exist", () => {
        return request(app)
          .patch("/api/articles/99999")
          .send({ inc_votes: 5 })
          .expect(404)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Not Found" });
          });
      });

      it("should return a 400 Bad Request error when endpoint provided an id that is the wrong data type", () => {
        return request(app)
          .patch("/api/articles/hello")
          .expect(400)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
    });

    describe("PATCH errors", () => {
      it("should respond with a status 400 and error message Bad Request when sent a object with a malformed body", () => {
        const requestBody = {};
        return request(app)
          .patch("/api/articles/2")
          .send(requestBody)
          .expect(400)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Bad Request" });
          });
      });

      it("should respond with a status 400 and error message Bad Request when the user sends a comment object with incorrect data types", () => {
        const requestBody = { inc_votes: "not today" };
        return request(app)
          .patch("/api/articles/2")
          .send(requestBody)
          .expect(400)
          .then((res) => {
            const body = res.body;
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
    });
  });
});

describe("GET /api/users", () => {
  it("200: should respond with an array of user objects, including properties username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: users }) => {
        const usersArr = users.users;
        expect(usersArr).toHaveLength(4);
        usersArr.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles (queries)", () => {
  it("should respond with status 200 and an array with only articles with the topic provided", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: articles }) => {
        const articlesArr = articles.articles;
        expect(articlesArr).toHaveLength(11);
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
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("should respond with status 200 and an array sorted by the column provided in the query in descending order by default", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id")
      .expect(200)
      .then(({ body: articles }) => {
        const articlesArr = articles.articles;
        expect(
          articlesArr.every((article, index) => {
            return (
              index === 0 ||
              article.article_id <= articlesArr[index - 1].article_id
            );
          })
        ).toBe(true);
      });
  });

  it("should respond with status 200 and an array sorted by the column provided in the query in the order provided (asc)", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: articles }) => {
        const articlesArr = articles.articles;
        expect(
          articlesArr.every((article, index) => {
            return (
              index === 0 ||
              article.article_id >= articlesArr[index - 1].article_id
            );
          })
        ).toBe(true);
      });
  });

  describe("errors", () => {
    it("should return a 400 Invalid topic Query error when passed a topic doesnt exist", () => {
      return request(app)
        .get("/api/articles?topic=youssef")
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Invalid topic Query" });
        });
    });

    it("should return a 400 Invalid sort_by Query error when passed an invalid sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=Youssef")
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Invalid sort_by Query" });
        });
    });

    it("should return a 400 Invalid order Query error when passed an invalid order", () => {
      return request(app)
        .get("/api/articles?order=DROP nc_news_test")
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Invalid order Query" });
        });
    });
  });
});



describe("/api/comments/:comment_id", () => {
	it("should respond with a status 204 with no content", () => {
		return request(app).delete("/api/comments/2").expect(204);
	});

	it("should return a 404 Not Found error when endpoint provided an id that doesnt exist", () => {
		return request(app)
			.delete("/api/comments/99999")
			.expect(404)
			.then((res) => {
				const body = res.body;
				expect(body).toEqual({ message: "Not Found" });
			});
	});

	it("should return a 400 Bad Request error when endpoint provided an id that is the wrong data type", () => {
		return request(app)
			.delete("/api/comments/hello")
			.expect(400)
			.then((res) => {
				const body = res.body;
				expect(body).toEqual({ message: "Bad Request" });
			});
	});
});
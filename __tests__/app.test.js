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
        expect(topicsArr).toBeInstanceOf(Array);
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

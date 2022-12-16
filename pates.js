
app.post("/api/articles/:article_id/comments", postCommentByArticleId);


exports.postCommentByArticleId = (req, res, next) =>{}

//   .......................................

describe("POST /api/articles/:article_id/comments", () => {
  it("should respond with the created row and status 201", () => {
    const requestBody = {
      username: "butter_bridge",
      body: "I buttered a butter bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
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

  describe('errors', () => {
    it("should respond with a status 400 and error message Bad Request when sent a object with a malformend body", () => {
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
  
    it("status:400, responds with an appropriate error message when the user sends a restaurant object with incorrect data types", () => {
      const requestBody = {
        username: 12,
        body: ['this is a body?'],
      };
      return request(app)
      .post("/api/articles/2/comments")
      .send(requestBody)
        .expect(400)
        .then((res) => {
          const body = res.body;
          expect(body).toEqual({ message: "Bad request" });
        });
    });
  });
});

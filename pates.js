// TESTSSSSSS
exports.testerrr = () => {
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
              avatar_url: expect.any(String)
            })
          );
        });
      });
    }

//MODELLLL

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};


// CONTROOOOOLAAAA
exports.getUsers= (req, res) => {
  selectUsers().then((topics) => {
    res.status(200).send({ topics });
  });
};

//APPPPP
app.get("/api/users", getUsers);
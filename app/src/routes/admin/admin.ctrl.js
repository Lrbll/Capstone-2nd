"use strict";
let db = require("../../config/db");

const output = {
  admin: (req, res) => {
    const is_logined = req.session.is_logined;
    const is_who = req.session.is_who;
    
    if (is_who == "admin") {
      // 사용자 목록 조회 쿼리
      const query1 = 'SELECT * FROM users';
      const query2 = 'SELECT * FROM results_info';

      // 쿼리1 실행
      db.mysql.query(query1, (error1, results1) => {
        if (error1) {
          console.error('쿼리 실행 실패:', error1);
          return;
        }

        // 쿼리2 실행
        db.mysql.query(query2, (error2, results2) => {
          if (error2) {
            console.error('쿼리 실행 실패:', error2);
            return;
          }

          res.render("home/Admin/admin", {
            is_logined: is_logined,
            users: results1,
            results_info: results2
          });
        });
      });
    } else {
      res.send(`<script type="text/javascript">alert("접근할 수 없습니다."); 
              document.location.href="/";</script>`);
    }
  },

  adminLogin: (req, res) => {
    const is_logined = req.session.is_logined;
    const is_who = req.session.is_who;
    if (is_who == "admin") {
      res.redirect(302,`/admin`);
    } else {
      res.render("home/Admin/adminLogin", { is_logined: is_logined });
    }
  },

  userList: (req, res) => {
    const is_logined = req.session.is_logined;
    const is_who = req.session.is_who;
    
    if (is_who == "admin") {
      // 사용자 목록 조회 쿼리
      const query1 = 'SELECT * FROM users';

      // 쿼리1 실행
      db.mysql.query(query1, (error1, results1) => {
        if (error1) {
          console.error('쿼리 실행 실패:', error1);
          return;
        }
        res.render("home/Admin/userList", {
          is_logined: is_logined,
          users: results1,
        });
      });
    } else {
      res.send(`<script type="text/javascript">alert("접근할 수 없습니다."); 
              document.location.href="/";</script>`);
    }
  },

  requestList: (req, res) => {
    const is_logined = req.session.is_logined;
    const is_who = req.session.is_who;
    
    if (is_who == "admin") {
      // 사용자 목록 조회 쿼리
      const query2 = 'SELECT * FROM results_info';

      // 쿼리2 실행
      db.mysql.query(query2, (error2, results2) => {
        if (error2) {
          console.error('쿼리 실행 실패:', error2);
          return;
        }

        res.render("home/Admin/requestList", {
          is_logined: is_logined,
          results_info: results2
        });
      });
    } else {
      res.send(`<script type="text/javascript">alert("접근할 수 없습니다."); 
              document.location.href="/";</script>`);
    }
  },

  userInfo: (req, res) => {
    const is_logined = req.session.is_logined;
    const user = req.params.user;
    console.log(user);
    // 데이터베이스 쿼리를 실행하여 해당 세션의 nickname과 일치하는 행을 조회합니다.
    const query1 = `SELECT DISTINCT url FROM results_info WHERE id = '${user}'`;
    const query2 = `SELECT * FROM users WHERE id = '${user}'`;
    const query3 = `SELECT * FROM results_info WHERE id = '${user}'`;

    db.mysql.query(query1, (error, results1) => {
      if (error) {
        console.error("Failed to fetch data:", error);
        res
          .status(500)
          .json({ error: "서버 오류가 발생했습니다.", detail: error });
        return;
      } else {
        db.mysql.query(query2, (error, results2) => {
          if (error) {
            console.error("Failed to fetch data:", error);
            res
              .status(500)
              .json({ error: "서버 오류가 발생했습니다.", detail: error });
            return;
          } else {
            db.mysql.query(query3, (error, results3) => {
              if (error) {
                console.error("Failed to fetch data:", error);
                res
                  .status(500)
                  .json({ error: "서버 오류가 발생했습니다.", detail: error });
                return;
              }
              // 결과에서 고유한 url 값들을 추출합니다.
              const urls = results1.map((row) => row.url);
              const userInfo = results2[0];
              const resultsInfo = results3;
              res.render("home/Admin/userInfo", { user, userInfo: userInfo, resultsInfo: resultsInfo, urls: urls, is_logined: is_logined });
            });
          }
        });
      }
  });
  },
};

const process = {
  login: (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;
    // db에서 사용자가 입력한 아이디를 조회한다.
    if (id && pw) {
      // id와 pw가 입력되었는지 확인
      db.mysql.query(
        "SELECT * FROM admin WHERE admin_id = ? AND admin_pw = ?",
        [id, pw],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            // db에서의 반환값이 있으면 로그인 성공
            req.session.is_logined = true; // 세션 정보 갱신
            req.session.is_who = "admin";
            req.session.nickname = id;
            req.session.save(function () {
              res.redirect(`/admin`);
            });
          } else {
            res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
              document.location.href="/admin/login";</script>`);
          }
        }
      );
    } else {
      res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
      document.location.href="/admin/login";</script>`);
    }
  },

  deleteUser: (req, res) => {
    const user = req.body.user;
    db.mysql.query(
      "DELETE FROM users WHERE id = ?",
      [user],
      (error, result) => {
        if (error) {
          console.error(error);
          res.redirect("/"); // 에러 발생 시 인덱스 페이지로 리다이렉션
        } else {
          res.send(`<script type="text/javascript">alert("회원 탈퇴가 완료되었습니다."); 
            document.location.href="/admin";</script>`);
        }
      }
    );
  },
};

module.exports = {
  output,
  process,
};

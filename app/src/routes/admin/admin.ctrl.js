"use strict";
let db = require("../../config/db");
const moment = require("moment-timezone");
const fs = require("fs");

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
  
  resultInfo: (req, res) => {
    const is_logined = req.session.is_logined;
    const user = req.params.user;
    const resultNumber = req.params.resultNumber;
    console.log(user);

    // 데이터베이스 쿼리를 실행하여 해당 세션의 nickname과 일치하는 행을 조회합니다.
    const query = `SELECT url, results, DATE_FORMAT(date, "%Y-%m-%d %H:%i:%s") AS formattedDate
    FROM results_info 
    WHERE num = '${resultNumber}'`;

    db.mysql.query(query, (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        // 해당하는 결과가 없는 경우 처리
        res.status(404).send("Results not found");
        return;
      }

      // 첫 번째 행의 결과
      const formattedDate1 = moment(results[0].formattedDate).format(
        "YYYY-MM-DD"
      );
      const url = results[0].url;
      const jsonData1 = JSON.parse(results[0].results);
      const {
        AE: AE1,
        BA: BA1,
        BF: BF1,
        BS: BS1,
        DL: DL1,
        SF: SF1,
        SM: SM1,
        DOR: DOR1,
        RFA: RFA1,
        XSS: XSS1,
        Base: Base1,
        CSRF: CSRF1,
        LDAP: LDAP1,
        Cookie: Cookie1,
        PHP_CI: PHP_CI1,
        Redirect: Redirect1,
        SI_Login: SI_Login1,
        SI_Search: SI_Search1,
        XML_XPATH: XML_XPATH1,
        XSS_Stored: XSS_Stored1,
      } = jsonData1;

      const riskKeys = Object.keys(jsonData1).filter(
        (key) => jsonData1[key] === "risk"
      );

      // 파일에서 점검항목 info 가져오기
      fs.readFile("src/scripts_info/scripts.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error reading JSON file");
          return;
        }

        const scripts = JSON.parse(data);
        console.log(url);
        res.render("home/Admin/resultInfo", {
          is_logined: is_logined,
          url,
          user: user,
          formattedDate1,
          scripts: scripts,
          riskKeys,
          AE1,
          BA1,
          BF1,
          BS1,
          DL1,
          SF1,
          SM1,
          DOR1,
          RFA1,
          XSS1,
          Base1,
          CSRF1,
          LDAP1,
          Cookie1,
          PHP_CI1,
          Redirect1,
          SI_Login1,
          SI_Search1,
          XML_XPATH1,
          XSS_Stored1,
        });
      });
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

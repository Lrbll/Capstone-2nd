"use strict";
let db = require("../../config/db");

const output = {
  admin: (req, res) => {
    const is_logined = req.session.is_logined;
    const is_who = req.session.is_who;
    if (is_who == "admin") {
      res.render("home/admin", { is_logined: is_logined });
    } else {
      res.send(`<script type="text/javascript">alert("접근할 수 없습니다."); 
              document.location.href="/";</script>`);
    }
    
  },
  adminLogin: (req, res) => {
    const is_logined = req.session.is_logined;
    const is_who = req.session.is_who;
    if (is_who == "admin") {
      res.redirect(`/admin`);
    }
    res.render("home/adminLogin", { is_logined: is_logined });
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
};

module.exports = {
  output,
  process,
};

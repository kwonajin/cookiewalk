var express = require('express');
const router = express.Router();
const session = require('express-session')

var passport = require('passport')
var NaverStrategy = require('passport-naver').Strategy;

router.route('/naver').get(passport.authenticate('naver',null), function(req,res){
  console.log("/auth/naver");
});

router.route('/naver/callback').get(passport.authenticate('naver',{
  successRedirect:'/',
  failureRedirect:'/auth/naver'
}));
const callbackURL="/auth/naver/callback"

passport.use(new NaverStrategy({
  clientID: process.env.NAVER_ID,
  clientSecret: process.env.NAVER_SECRET,
  callbackURL: callbackURL
}, 
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {

      var user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.displayName,
          provider: 'naver',
          naver: profile._json
      };
      console.log("user=");
      console.log(user);
    
      return done(null, user);
    });
}
));


//failed to serialize user into session 에러 발생 시 아래의 내용을 추가 한다.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(req, user, done) {

// passport로 로그인 처리 후 해당 정보를 session에 담는다.
req.session.sid = user.name;
console.log("Session Check :" +req.session.sid);
  done(null, user);
});


module.exports=router
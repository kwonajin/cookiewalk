require("dotenv").config();
const supabase = require("./config/supabaseClient")
async function main(){
const { user, error } = await supabase.auth.signUp({
  email: 'dustkscjswo@naver.com',
  password: '12341234',
})
console.log(user)
console.log(error)
}

main()
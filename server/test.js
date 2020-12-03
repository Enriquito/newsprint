
const User = require('./models/User')


async function test(){
  try{
    const pw = await User.createPassword('Test1234');

    console.log(pw);
  }
  catch(error){
    console.log(error);
  }
}

test();


const User = require('./models/User')


async function test(){
  try{
    const user = await User.findOneByEmail('test@test.com');

    // await user.updatePassword('hoi1234');
    // user.registerPasswordReset();
    console.log(true);
  }
  catch(error){
    console.log(error);
  }
}

test();

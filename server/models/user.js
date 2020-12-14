const database = require('../database');
const bcrypt = require('bcryptjs');

class User{
      constructor(){
            this.id = null;
            this.username = null;
            this.email = null;
            this.image = null;
            this.lastLogin = null;
            this.created = null;
        }

        static findOne(id){
            return new Promise((resolve, reject) => {
                  database.query("SELECT * FROM users WHERE id = ?",[id],(error, result) => {
                        if(error){
                              reject(error);
                              console.log(param)
                        }

                        if(result === null){
                              reject(null)
                        }

                        result = result[0];
                        const user = new User();

                        user.id = result.id;
                        user.username = result.username;
                        user.email = result.email;
                        user.lastLogin = result.last_login;
                        user.created = result.created;

                        resolve(user);
                  });
            });
        }

        static findOneByUsername(username){
            return new Promise((resolve, reject) => {
                  database.query("SELECT * FROM users WHERE username = ?",[username],(error, result) => {
                        if(error){
                              reject(error);
                              console.log(param)
                        }

                        if(result === null || result === undefined || result.length === 0){
                              reject(null);
                              return;
                        }

                        result = result[0];
                        const user = new User();

                        user.id = result.id;
                        user.username = result.username;
                        user.email = result.email;
                        user.lastLogin = result.last_login;
                        user.created = result.created;

                        resolve(user);
                  });
            });
        }

        static async createPassword(password){
            return new Promise((resolve, reject) => {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, function(error, hash) {
                    if(error)
                        reject(error);

                    resolve(hash);
                });
            })
        }

        create(hash){
            return new Promise((resolve, reject) => {
                const data = {
                    username : this.username,
                    email : this.email,
                    password : hash
                };

                database.query("INSERT INTO users SET ?", data, (error, result) => {
                    if(error)
                        reject({success : false, error : error});

                    this.id = result.insertId;

                    resolve({success : true});
                });
            });
        }

        delete(){
            return new Promise((resolve, reject) => {
                database.query(`DELETE FROM users WHERE id = ?`,[this.id], (error, result) => {
                    if(error)
                        reject(error);

                    resolve(this);
                });
            })
        }

        async validPassword(password){
            const getPassword = new Promise((resolve, reject) => {
                database.query(`SELECT password FROM users WHERE id = ${this.id}`, (error, result) => {
                    if(error)
                        reject(null);

                    if(result.length === 1)
                        resolve(result[0].password);
                    else
                        reject(null)
                });
            });

            try{
                  const hash = await getPassword;
                  const result =  await bcrypt.compareSync(password, hash);

                  return result;
            }
            catch(error){
                  console.log(error);
            }


        }
}

module.exports = User;
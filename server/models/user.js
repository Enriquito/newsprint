const database = require('../database');
const bcrypt = require('bcryptjs');

class User{
      constructor(){
            this.id = null;
            this.username = null;
            this.email = null;
            this.lastLogin = null;
            this.created = null;
        }

        static findOne(id){
            return new Promise((resolve, reject) => {
                  database.query("SELECT * FROM users WHERE id = ?",[id],(error, result) => {
                        if(error){
                              reject(error);
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

        updatePreference(articleDeleteInterval,articleScanInterval,darkmode){
            return new Promise((resolve, reject) => {
                const data = {
                    article_delete_interval: articleDeleteInterval,
                    article_scan_interval: articleScanInterval,
                    darkmode: darkmode
                }

                database.query(`UPDATE user_preferences SET ? WHERE user = ?`,[data,this.id], (error, result) => {
                    if(error){
                        reject(error);
                        return;
                    }

                    resolve();
                });
            })
        }

        getPreference(){
            return new Promise((resolve, reject) => {
                database.query("SELECT * FROM user_preferences WHERE user = ?",[this.id],(error, result) => {
                      if(error){
                            reject(error);
                            console.log(param)
                      }

                      if(result === null || result.length === 0){
                            reject(null)
                      }

                      result = result[0];

                      const data = {
                        articleDeleteInterval: result.article_delete_interval,
                        articleScanInterval: result.article_scan_interval,
                        darkmode: result.darkmode
                      }

                      resolve(data);
                });
          });
        }

        create(){
            const createUser = () => {
                return new Promise((resolve, reject) => {
                    const data = {
                        username : this.username,
                        email : this.email,
                        password : this.password
                    };

                    database.query("INSERT INTO users SET ?", data, (error, result) => {
                        if(error)
                            reject(error);

                        this.id = result.insertId;

                        resolve();
                    });
                });
            }

            const createPreferenceRow = () => {
                return new Promise((resolve, reject) => {
                    const data = {
                        user : this.id
                    };

                    database.query("INSERT INTO user_preferences SET ?", data, (error, result) => {
                        if(error){
                            // console.log(error);
                            reject();
                            return;
                        }

                        resolve();
                    });
                });
            }

            const createDefaultFolder = () => {
                return new Promise((resolve, reject) => {
                    const data = {
                        user : this.id,
                        name: "No folder",
                        show_order: 0
                    };

                    database.query("INSERT INTO folders SET ?", data, (error, result) => {
                        if(error)
                            reject();

                        resolve();
                    });
                });
            }

            return new Promise(async (resolve, reject) => {
                try{
                    await createUser();
                    await createPreferenceRow();
                    await createDefaultFolder();

                    resolve();
                }
                catch(error){
                    console.log(error);
                    reject();
                }
            })
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
                  const result = bcrypt.compareSync(password, hash);

                  return result;
            }
            catch(error){
                  console.log(error);
            }
        }
}

module.exports = User;
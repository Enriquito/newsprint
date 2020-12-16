const moment = require('moment-timezone');
const fs = require('fs');

class Log{
    constructor(file){
        this.time = moment();
        this.content;
        this.method;
        this.user;
        this.logFile = `./logs/${file}.json`;
    }

    haveValidData(){
        if(this.method === undefined)
            return {success: false, error: "No method specified"};
        else if(this.content === undefined)
            return {success: false, error: "No content specified"};
        else if(this.logFile === `./logs/undefined`)
            return {success: false, error: "No log file specified"};
        else
            return {success: true};
    }

    write(){
        const check = this.haveValidData();

        if(!check.success){
            throw new Error(check.error);
        }

        const file = fs.readFileSync(this.logFile, 'utf8');
        const json = JSON.parse(file);

        json.data.push(this);

        fs.writeFileSync(this.logFile,JSON.stringify(json));
    }
}

module.exports = Log;
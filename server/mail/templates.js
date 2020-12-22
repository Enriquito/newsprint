module.exports.passwordResetMail = (username, url) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Password reset</title>
            <meta charset="utf-8">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
            <style>
            body{
                width: 100%;
            }
            header{
                width: 100%;
                height: 200px;
            }
            header h1{
                text-align:center;
                font-size: 5em;
            }
            #content{
                width: 500px;
            }
            #content main{
                padding: 20px;
            }
            a{
                font-weight: 900;
                width: 100%;
                border-radius: 5px;
                padding: 10px;
                display: block;
                text-align: center;
            }
            @media (prefers-color-scheme: light) {
                body{
                    background: rgb(238, 234, 234);
                }
                header{
                    background: #5867FC;
                }
                header h1{
                    color: #FFF;
                }
                #content{
                    background: #FFF;
                }

                a{
                    background: #5867FC;
                    color: #FFF;
                }
            }
            @media (prefers-color-scheme: dark) {
                body{
                    background: rgb(238, 234, 234);
                }
                header{
                    background: rgb(161, 157, 157);
                }
                header h1{
                    color: #5867FC;
                }
                #content{
                    background: #FFF;
                }

                a{
                    border: 1px solid #5867FC;
                    color: #5867FC;
                }
            }
            </style>
        </head>
        <body>
            <div style="width: 100%;" class="d-flex justify-content-center">
                <div id="content">
                    <header class="d-flex justify-content-center  align-items-center">
                        <h1>Newsprint</h1>
                    </header>
                    
                    <main>
                        <h2>Hi, ${username}</h2>
                        <h4>There was a requested to change your password.</h4>
                        <p>
                            <span>If you did not make this request, just ignor this email. Otherwise please click the button below to change your password.</span>
                        </p>
                        <a href="${url}">Change Password</a>
                    </main>
                </div>
            </div>
        </body>
    </html>
    `;
}
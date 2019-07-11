 function extract_token(req) {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader && bearerHeader.split(' ')[0] === 'Bearer'){
        return bearerHeader.split(' ')[1];
    } else if(req.query && req.query.token) {
        return req.query.token
    }
    return null;
 }

 function extract_credentials(req){
     const bearerHeader = req.headers['authorization'];
     console.log("Req.headers: " + req.headers);
     console.log("Req.headers[authorization]: " + req.headers['authorization']);
     if(bearerHeader && bearerHeader.split(' ')[0] === 'Basic'){
         let auth = bearerHeader.split(' ')[1];
         let buf = new Buffer.from(auth, 'base64');
         let plain_auth = buf.toString();
         let username = plain_auth.split(':')[0];
         let password = plain_auth.split(':')[1];
         return {username, password};
     }
     return null;
 }
 module.exports = {
     extract_token,
     extract_credentials
 }
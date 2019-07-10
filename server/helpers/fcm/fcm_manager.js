const fcm_admin = require('firebase-admin');
let fcm_service_account;

if(process.env.NODE_ENV === 'TEST'){
		fcm_service_account = require('../../config/water-meter-reader-a9db4-firebase-adminsdk-2mcki-e8a1ad48cb.json');
}

function fcmInit(){
    return new Promise( async (resolve, reject)=>{
        try {
                let app = await fcm_admin.initializeApp({
                credential: fcm_admin.credential.cert(
                    process.env.NODE_ENV === 'TEST' ? fcm_service_account : JSON.parse(process.env.FCM_SERVICE_ACCOUNT)
                    ),
                databaseURL: process.env.FCM_DATABASE_URL
            });
            resolve(app);
        } catch (error) {
            reject(error);
        }
    });
}

function subscribeToTopics(registrationTokens, topics){
    return new Promise(async (resolve, reject)=>{
        try {
            let response = [];
            topics.forEach((topic)=>{
                response.push(await fcm_admin.messaging().subscribeToTopic(registrationTokens, topic));
            })
            resolve(response);
        } catch (error) {
            reject(error);            
        }
    });
}

function unsubscribeFromTopic(registrationTokens, topic){
    return new Promise(async(resolve, reject)=>{
        try {
            let response = await fcm_admin.messaging().unsubscribeFromTopic(registrationTokens, topic);
            resolve(response);
        } catch (error) {
            reject(error);            
        }
    });
}

function sendMessageToSingleDevice(data, token){
    let message = {
        data: data,
        token: token
    };
    return new Promise(async(resolve, reject)=>{
        try {
            let response = await fcm_admin.messaging().send(message);
            resolve(response);            
        } catch (error) {
            reject(error);
        }
    });
}

function sendMessageToMultipleDevices(data, tokens){
    let message = {
        data: data,
        tokens: tokens
    };
    return new Promise(async(resolve, reject)=>{
        try {
            let response = await fcm_admin.messaging().sendMulticast(message);
            console.log(response.successCount + ' messages were sent successfully');
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                  if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                  }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
              }
            resolve(response);            
        } catch (error) {
            reject(error);
        }
    });
}

function sendMessageToSingleTopic(data, topic){
    let message = {
        data: data,
        topic: topic
    };
    return new Promise(async(resolve, reject)=>{
        try {
            let response = await fcm_admin.messaging().send(message);
            console.log(' messages were sent successfully to '+response + 'topic');
            resolve(response);            
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    fcmInit,
    subscribeToTopics,
    unsubscribeFromTopic,
    sendMessageToSingleDevice,
    sendMessageToMultipleDevices,
    sendMessageToSingleTopic
}



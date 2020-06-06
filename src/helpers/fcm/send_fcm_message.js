function send_fcm_message(fcm_admin, message_payload){
    // Send a message to the device corresponding to the provided registration token.
    fcm_admin.messaging().send(message_payload)
    .then((response)=>{
        //Response is message ID string
        console.log('Successfully sent fcm message: ', response);
    })
    .catch((error)=>{
        console.log('Error sending fcm message: ', error);
    });
}
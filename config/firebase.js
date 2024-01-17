const admin = require("firebase-admin");

const secretAccessKey = require("./../fireBaseCredentials.json");
admin.initializeApp({
  credential: admin.credential.cert(secretAccessKey),
});

exports.verifyFirebaseToken = async (tokenKey) => {
  try {
    const decodeValue = await admin.auth().verifyIdToken(tokenKey);
    if (decodeValue) {
      return decodeValue;
    }

    return "UnAuthorize";
  } catch (e) {
    console.log(e);
    return e;
  }
};

exports.getUserData = async (uid) => {
  return await admin.auth().getUser(uid);
};

exports.sendNotification = (mgsTitle, mgsBody, token, data) => {
  var payload = {
    notification: {
      title: mgsTitle,
      body: mgsBody,
    },
    data,
  };
  const registrationToken = token;
  var options = data;
  if (mgsTitle && mgsBody && token && data) {
    admin
      .messaging()
      .sendToDevice(registrationToken, payload, options)
      .then(function (response) {
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });
  }
};

exports.sendNotificationToAll = (mgsTitle, mgsBody, topic) => {
  var payload = {
    notification: {
      title: mgsTitle,
      body: mgsBody,
    },
  };

  admin
    .messaging()
    .sendToTopic(topic, payload)
    .then(function (response) {
      // console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
};

exports.sendNotificationToAllWithImage = (mgsTitle, mgsBody, image, topic) => {
  var payload = {
    notification: {
      title: mgsTitle,
      body: mgsBody,
      image: image,
    },
  };

  admin
    .messaging()
    .sendToTopic(topic, payload)
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
};

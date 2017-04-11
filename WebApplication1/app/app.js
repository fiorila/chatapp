"use strict";

var app = angular.module('chatApp', ['firebase']);

app.controller('chatController', ['$scope', '$q', '$firebaseArray', function ($scope, $q, $firebaseArray) {

    console.log(firebase.app().name);  

    var msgUser = "";
    $scope.msgText = "";
    $scope.image = null;
  
    var auth = firebase.auth();
    var provider = new firebase.auth.GoogleAuthProvider();
    var messagesRef = firebase.database().ref('messages/');

    var User = {
        username : null,
        profilePicUrl: 'images/profile_placeholder.png',
        uid: null
    };

    $scope.user = User;

    $scope.login = function () {           
        auth.signInWithPopup(provider).then(function (result) {
            console.log(result);
            //User signed in!
            User.uid = result.user.uid;          
            User.username = result.user.displayName;
            User.profilePicUrl = result.user.photoURL;
            console.log("USER:", User);
            startListening();
        }).catch(function (error) {
            //an error occurred
            console.log(error);
        });
    }

    $scope.logout = function () {
        auth.signOut();
        User.username = null;
        User.profilePicUrl = 'images/profile_placeholder.png';
        User.uid = null;
        this.msgText = "";
    }

    var startListening = function () {      
        // create a query for the most recent 25 messages on the server
        var query = messagesRef.limitToLast(25);
        var obj = $firebaseArray(query);
        obj.$loaded().then(function (data) {
            console.log("obj",obj);
            $scope.messages = obj;
        })
        .catch(function (error) {
            consoler.error("Error:", error);
        });
    }

    $scope.post = function () {
        messagesRef.push({
            username: User.username,
            text: this.msgText,
            photoUrl: User.profilePicUrl,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).catch(function (error) {
            console.error('Error pushing new message to Firebase Database', error);
        });
        this.msgText = '';
    };

    
    $scope.embed = {
        fontSmiley: true,    // toggle converting ascii smileys into font smileys
        sanitizeHtml: true,   // toggle converting html code into text
        emoji: true,    // toggle converting emojis short names into images
        link: true,    // toggle converting urls into anchor tags
        linkTarget: '_self'  //_blank|_self|_parent|_top|framename|cordova
    }

}]);


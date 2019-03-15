var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    data: {
    },

    methods:{
        handleClientLoad() {
            // Load the API's client and auth2 modules.
            gapi.load('client:auth2', authClient);

            function authClient() {
                gapi.auth2.authorize({
                    client_id: '136129714002-ppsnkh4o55ai8bq6ttgrpfker688s4u4.apps.googleusercontent.com',
                    scope: 'https://www.googleapis.com/auth/fitness.activity.read',
                    response_type: 'id_token permission'
                }, function (response) {
                    if (response.error) {
                        // An error happened!
                        alert('Token Error!');
                        return;
                    }
                    //save token to local storage
                    localStorage.setItem('token', response.access_token);
                });
            }
        },
        getData(){
            var authCode = 'Bearer ' + localStorage.getItem('token');
            // console.log(authCode);
            // console.log(accessToken);
            // var req_url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
            //get today's date
            var req_url = "https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=2019-03-06T00:00:00.000Z&endTime=2019-03-13T23:59:59.999Z"
            $.ajax({
                type: "GET",
                url: req_url,
                beforeSend : function( xhr ) {
                    xhr.setRequestHeader('Authorization', authCode);
                },
                success: function (response) {
                    var dss = response['session'];
                    var dsname = [];
                    for (i = 0; i < dss.length; i++) {
                        dsname.push(dss[i]);
                    }
                    var d = new Date(response.session[0].startTimeMillis);
                    console.log(response);
                },
                failure: function(){
                    //get new access token
                }
            });
        },
        postData(){
            var authCode = 'Bearer ' + localStorage.getItem('token');
            // we use different device uid to distinguish different data sources of a same type.
            var req_url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
            // You may need dsId.
            // var dsId = "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps";
            $.ajax({
                type: "POST",
                url: req_url,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "aggregateBy": [{
                        "dataTypeName": "com.google.step_count.delta",
                        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                    }],
                    "bucketByTime": { "durationMillis": 86400000 },
                    "startTimeMillis": 1551830401000,
                    "endTimeMillis": 1552089540000
                }),

                beforeSend : function( xhr ) {
                    xhr.setRequestHeader('Authorization', authCode);
                },
                success: function (response) {
                    console.log(response);
                },
                failure: function(errMsg) {
                    //get new access token
                    alert(errMsg);
                }

            });
        }

    },

    computed:{

    },
    watch:{

    }
});
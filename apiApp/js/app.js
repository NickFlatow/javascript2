var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    data: {
        weeklySession: new Session(),
        message:'Hello'
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
            // this.weeklySession = new Session(["jello","pudding","pops"]);
            // console.log(authCode);
            // console.log(accessToken);
            // var req_url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
            //get today's date

            //get the first day of the current week
            var sunday = new Date(this.getSunday());
            //get the last day of the current week
            var saturday = new Date(this.getSaturday());

            var req_url = "https://www.googleapis.com/fitness/v1/users/me/sessions?"+
                "startTime="+sunday.getFullYear()+'-'+(sunday.getMonth() + 1)+'-'+sunday.getDate()+"T00:00:00.000Z"+
                "&endTime="+saturday.getFullYear()+'-'+(saturday.getMonth() + 1)+'-'+saturday.getDate()+"T23:59:59.999Z";

            axios.get(req_url, { headers: { Authorization: authCode } }).then(response => {
                this.weeklySession = new Session(response.data.session);
                console.log(response.data.session);
                })
                .catch((error) => {
                    console.log('token error ' + error);
                    //refresh token
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
        },
        //Returns the Sunday at the beginning of current in milliseconds
        getSunday(){
            var date = new Date();
            var today = date.getDay();
            var sunday;
            //if today is sunday
            if(date.getDay() == 0){
                sunday = new Date().setDate(date.getDate());
            }
            else{
                sunday = new Date().setDate(date.getDate() - today);
            }

            return sunday;
        },
        //Returns the Saturday at the end of the current week in milliseconds
        getSaturday(){
            var date = new Date();
            var today = date.getDay();
            var saturday;
            //if the day is Saturday
            if (date.getDay == 6){
                saturday = new Date().setDate(date.getDate());
            }
            else{
                saturday = new Date().setDate((date.getDate() - today) + 6)
            }
            return saturday;
        }

    },
    computed: {
        //return all activies in nested arrays with in the millisecond range of current monday
        //monday:
        sundayList: function(){
            return this.weeklySession.filter(function(item){
               return item.endTimeMillis < 1552885141000;
            });
        }
            // 1552798801000 am
            // 1552885141000
    },
    mounted: function(){

    },
    watch:{

    }
});
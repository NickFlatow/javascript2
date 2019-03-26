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
            // console.log(authCode);
            // console.log(accessToken);
            // var req_url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
            //get today's date

            //get the first day of the current week
            var sunday = new Date(this.getDayOfWeek(0));
            //get the last day of the current week
            var saturday = new Date(this.getDayOfWeek(7));
            // console.log("Sunday: " + sunday + " " + "Saturday: " + saturday);

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
        // getSunday(){
        //     var date = new Date();
        //     var today = date.getDay();
        //     var sunday;
        //     //if today is sunday
        //     if(date.getDay() == 0){
        //         sunday = new Date().setDate(date.getDate());
        //     }
        //     else{
        //         sunday = new Date().setDate(date.getDate() - today);
        //     }
        //
        //     return sunday;
        // },
        // //Returns the Saturday at the end of the current week in milliseconds
        // getSaturday(){
        //     var date = new Date();
        //     var today = date.getDay();
        //     var saturday;
        //     //if the day is Saturday
        //     if (date.getDay == 6){
        //         saturday = new Date().setDate(date.getDate());
        //     }
        //     else{
        //         saturday = new Date().setDate((date.getDate() - today) + 6)
        //     }
        //     return saturday;
        // },
        //Returns day of the week
        //day is an int 0-6 representing the day; Sunday = 0, Saturday = 6
        getDayOfWeek(day){
            var date = new Date();
            var today = date.getDay();
            var dayOfWeek;
            //if the day is Saturday
            if (date.getDay == day){
                dayOfWeek = new Date().setDate(date.getDate());
            }
            else{
                dayOfWeek = new Date().setDate((date.getDate() - today) + day)
            }
            return dayOfWeek;
        },
        getDayList(day){
            //get day of the week
            let theDay = new Date(this.getDayOfWeek(day));
            // get start of day in milliseconds
            let startOfDay = theDay.setHours(0,0,0,0)
            // get end of the day in milliseconds
            let endOfDay = theDay.setHours(23,59,59,999);
            console.log("End of day: " + day + " " + endOfDay);
            console.log("Start of day: "+ day + " " + startOfDay);
            return this.weeklySession.filter(function(item){
                return item.endTimeMillis < endOfDay && item.startTimeMillis > startOfDay;
            });

        }

    },
    computed: {
        //return all activies in nested arrays with in the millisecond range of current monday
        //monday:
        // sundayList: function(){
        //     let endOfDay = new Date(this.getDayOfWeek(0));
        //     endOfDay.setHours(23,59,59,999);
        //     console.log(endOfDay);
        //     return this.weeklySession.filter(function(item){
        //        return item.endTimeMillis < endOfDay;
        //     });
        // }
        sundayList: function() {
            return this.getDayList(0);
        },
        mondayList: function(){
            return this.getDayList(1);
        },
        tuesdayList: function(){
            return this.getDayList(2);
        },
        wednesdayList: function(){
            return this.getDayList(3);
        },
        thursdayList: function(){
            return this.getDayList(4);
        },
        fridayList: function(){
            return this.getDayList(5);
        },
        saturdayList: function(){
            return this.getDayList(6)
        }
    },
    mounted: function(){

    },
    watch:{

    }
});
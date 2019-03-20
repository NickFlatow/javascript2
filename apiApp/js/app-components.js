Vue.component('day', {
    //props: ['items'] or
    props: {
        dayofweek: {
            type: Array,
            required: true
        },
        name:{
            type: String,
            default: 'Blarg'
        },
    },
    data: function() {
      return {
          medMins: 0
      }
    },
    methods: {
        addMed: function(day){
            // alert((day.endTimeMillis - day.startTimeMillis)/60000);
            this.medMins += Number(day.endTimeMillis/60000).toFixed()-Number(day.startTimeMillis/60000).toFixed()
            // this.medMins += Number((day.endTimeMillis).toFixed(1)) - Number((day.startTimeMillis).toFixed(1))/60000;
        }

    },
    template: ''+
        '         <div>'+
        '           <h1>{{name}}</h1>\n' +
        '            <div class = "row">\n' +
        '                <div class ="col" v-for="day in dayofweek">{{day.activityType}}' +
        '                   <div v-if="`${day.activityType}` == 45" v-on="addMed(day)"></div>' +
        '                </div>' +
        '            </div>' +

        '            <h1>{{medMins}}</h1>'+
        '         </div>',
    computed: {

    }
});
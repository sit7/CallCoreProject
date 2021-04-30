Vue.component("eating-time-form", {
    template: "#eating-time-form",
    mixins:[crossdMixins],
    data: function () {
        return {
            hello: "hello",
            model: {
                EatingCategoryID: null,
                Name: null,
                hours:[]
            },
            eatingTimes:[]

        }
    },
    props: {
        eatingCategories: Array,
        eatingTimeToEdit: Object
    },

    computed: {
        hoursToDisplay: function () {
            return this.model.hours.filter(function (item) {
                return item.RecordStatusID == 1;
            });
        }
    },

    methods: {

        addEatingHour: function () {

            var vm = this;
            var hour = {
                ObjectEatingTimeHoursID: vm.generateUid(),
                Hours: new Date(0, 0, 0, 8, 0, 0, 0),
                HoursControl: new Date(0, 0, 0, 8, 0, 0, 0),
                EatingCategoryID: vm.model.EatingCategoryID,
                EatingTimeID: null,
                RecordStatusID: 1
            };
            vm.model.hours.push(hour);
            this.generateUid();
        },
        
        eatingCategoryChanged: function (value) {
            
            this.model.hours.forEach(function (item) {
                item.EatingCategoryID = value;
            });
        },

        

        removeEatingHour: function (item, index) {
            if (item.ObjectEatingTimeHoursID > 0) {
                item.RecordStatusID = 2;
            } else {
                this.model.hours.splice(index, 1);
            }
        },

        cancelRemoveEatingHour: function (item, index) {
            item.RecordStatusID = 1;
        },
        
        getEatingTimes: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooEatingTime/GetEatingTime",
                success: function (response) {
                    vm.eatingTimes = response;
                }
            });
        },
        
        getAllowedEatingTime: function (item) {
            var usedEatingTimes = this.model.hours.filter(function (time) {
                return time.RecordStatusID!==2
            });
            return this.eatingTimes.filter(function (time) {
                return !usedEatingTimes.some(function (ut) {
                    return ut.EatingTimeID === time.EatingTimeID;
                }) || item.EatingTimeID == time.EatingTimeID;
                   
            });

        },
        saveEatingTime: function () {
            console.log(this.model);
            var vm = this;
            vm.$refs.form.validate(function (valid) {
                if (valid) {
                    console.log(valid);
                    vm.model.hours.forEach(function (item) {
                        if (item.Hours instanceof Date) {

                            console.log(item.Hours, "as date");
                        }
                        if (item.Hours instanceof String) {
                            console.log(item.Hours, "as string");
                        }
                        
                        item.HourAsDate = moment(item.Hours).format("HH:mm");
                        item.HourControlAsDate = moment(item.HoursControl).format("HH:mm");
                    });
                    $.ajax({
                        method: "post",
                        dataType: "json",
                        contentType: "application/json, charset=utf-8",
                        url: "/fooEatingTime/SaveEatingTimeHours",
                        data: JSON.stringify({
                            hours: vm.model.hours
                        }),
                        success: function (responce) {
                            vm.$emit("eating-times-saved", vm.model);
                        }
                    });
                }
            });
        }
    },
    
    watch: {
        eatingTimeToEdit: function (value) {
            
            //this.model = value;
            var vm = this;
            
            if (this.eatingTimeToEdit) {
                var clone = this.cloneData(this.eatingTimeToEdit);
                console.log(clone);
                clone.hours.forEach(function (h) {
                    //console.log(new Date(Date.parse(moment(h.Hours).toISOString())))
                    h.Hours = new Date(1, 1, 1, moment(h.Hours).hours(), moment(h.Hours).minutes(), 0);
                    h.HoursControl = new Date(1, 1, 1, moment(h.HoursControl).hours(), moment(h.HoursControl).minutes(), 0);
                });
                console.log(clone);
                this.model = clone;
            }
        }
    },
    created: function () {
        var vm = this;
        this.getEatingTimes();
        if (this.eatingTimeToEdit) {
            var clone = this.cloneData(this.eatingTimeToEdit);
            console.log(clone);
            clone.hours.forEach(function (h) {
                //console.log(new Date(Date.parse(moment(h.Hours).toISOString())))
                h.Hours = new Date(1, 1, 1, moment(h.Hours).hours(), moment(h.Hours).minutes(), 0);
                h.HoursControl = new Date(1, 1, 1, moment(h.HoursControl).hours(), moment(h.HoursControl).minutes(), 0);
            });
            console.log(clone);
            this.model = clone;
        }
    }
});
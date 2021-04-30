Vue.component("responsible-person-form",{
    template: "#responsible-person-form",
    mixins: [crossdMixins],
    data: function () {
        return {
            model: {
                ObjectPersonID: -1,
                PersonID: null,
                BeginDate:Date.now(),
                EndDate: null,
                IsMain: 1,
                Comment: null
            },
            persons: []
        }
    },
    props: {
        personToEdit: Object,
        storeType: Number
    },

    computed: {
        personsForSelect: function () {
            var vm = this;
            if (vm.personToEdit) {
                return vm.persons.filter(function (item) {
                    return item.PersonID !== vm.personToEdit.PersonID;
                });
            }
            return vm.persons;

        }
    },

    methods: {
        getObjectPersons: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/Food/GetPersons",
                success: function (response) {
                    vm.persons = response;
                }
            });
        },

        positionEndDateValidator: function (rule, value, callback) {
            console.log(this.model.BeginDate);
            if (value) {
                if (moment(value).isBefore(this.model.BeginDate, "day")) {

                    callback(new Error("Дата освобождения от должности не можеть быть меньше даты вступления"));
                }
            }
            
            callback();
        },

        positionBeginDateValidator: function (rule, value, callback) {
            var previousPersonEndDate = new Date(this.personToEdit.EndDate);
            var previousPersonBeginDate = this.personToEdit.BeginDate !== null
                ? new Date(this.personToEdit.BeginDate)
                : null;
            var currentValue = new Date(value);
            console.log(value);
            console.log(previousPersonEndDate);
            console.log(previousPersonBeginDate);
            if (currentValue < previousPersonBeginDate) {
                callback(new Error("Дата вступления в должность не может быть меньше даты втупления в должность предыдущего МОЛ"));
            }
            callback();
        },

        prepareToChange: function (person) {
            var vm = this;
            console.log(vm.storeType);
            console.log(person);
            if (person) {
                var beginDate = person.EndDate
                    ? moment(person.EndDate).add(1, "days").toDate()
                    : Date.now();
                console.log(beginDate);
                //model.PersonID = person.PersonID;
                vm.model.IsMain = vm.storeType;
                vm.model.BeginDate = beginDate;
            } else {
                vm.model = {
                    ObjectPersonID: -1,
                    PersonID: null,
                    BeginDate: Date.now(),
                    EndDate: null,
                    IsMain: vm.storeType,
                    Comment: null
                };
            }

        },

        save: function () {
            var vm = this;
            //console.log("save");
            //console.log(vm.model);
            var sendData = this.cloneData(vm.model);
            
            vm.$refs.form.validate(function (valid, model) {
                console.log(model);
                sendData.BeginDate = new Date(sendData.BeginDate).toISOString();
                sendData.EndDate = sendData.EndDate !== null
                    ? new Date(sendData.EndDate).toISOString()
                    : null;

                if (valid) {
                    $.ajax({
                        method: "post",
                        url: "/fooResponsiblePersons/SavePerson",
                        dataType: "json",
                        data: sendData,
                        success: function (data) {
                           
                            vm.$message({
                                showClose: true,
                                type: "success",
                                message: "МОЛ успешно изменен"
                            });
                            vm.$emit("responsiblePersonChanged");
                            
                            vm.model = {
                                ObjectPersonID: -1,
                                PersonID: null,
                                BeginDate: Date.now(),
                                EndDate: null,
                                IsMain: vm.storeType,
                                Comment: null
                            };
                        }
                    });
                } else {
                    return false;
                }
            });
        }

    },

    watch: {
        "personToEdit": function (value) {
            this.prepareToChange(value);
        },

        "storeType": function (value) {
            this.prepareToChange(this.personToEdit);
        }
    },

    created: function () {
        this.getObjectPersons();
        console.log(this.personToEdit);
        this.prepareToChange(this.personToEdit);
    }
});
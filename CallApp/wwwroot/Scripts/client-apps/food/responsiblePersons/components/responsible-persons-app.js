Vue.component("responsible-persons-app", {
    template: "#responsible-persons-app",
    mixins: [crossdMixins],
    data: function () {
        return {
            hello: "hello",
            persons: [],
            showFormDialog: false,
            personToEdit: null,
            storeType: 1
        };
    },

    computed: {
        storePerson: function () {
            if (!this.persons.length) {
                return null;
            }

            var store = this.persons.find(function (person) { return person.Key === 1 }) || null;
            
            if (store) {
                
                return store.History[0]
            }
            return null;
        },

        storePersonHistory: function () {
            var vm = this;
            if (this.persons.length) {
                var history = this.persons.find(function (person) { return person.Key === 1 }).History;
                
                if (history.length > 1) {
                    return history.filter(function (item) { return item.ObjectPersonID !== vm.storePerson.ObjectPersonID });
                }
            }
            return [];
        },

        pharmacyPerson: function () {
            if (!this.persons.length) {
                return null;
            }

            var store = this.persons.find(function (person) { return person.Key === 2 }) || null;
            if (store) {
                return store.History[0];
            }
            return null;
            
        },
        
        pharmacyPersonHistory: function () {
            var vm = this;
            if (this.persons.length) {
                var history = this.persons.find(function (person) { return person.Key === 2 }).History;
                
                if (history.length > 1) {
                    return history.filter(function (item) { return item.ObjectPersonID !== vm.pharmacyPerson.ObjectPersonID });
                }
            }
            return [];
        }

    },

    methods: {
        editPerson: function (person, number) {
            
            this.storeType = number;
            this.personToEdit = person;
            this.showFormDialog = true;
        },
        
        getResponsiblePersons: function () {
            var vm = this;
            $.ajax({
                method: "get",
                url: "/fooResponsiblePersons/GetResponsible",
                success: function (data) {
                    
                    vm.persons = data;
                }
            });
        },

        responsiblePersonChanged: function () {
            this.showFormDialog = false;
            this.getResponsiblePersons();
        },

        deletePerson: function (person) {
            var vm = this;
            console.log(person);
            $.ajax({
                method: "post",
                url: "/fooResponsiblePersons/DeletePerson",
                dataType: "json",
                data: person,
                success: function (data) {
                    console.log(data);
                    if (data.success) {
                        vm.getResponsiblePersons();
                        vm.$message({
                            showClose: true,
                            type: "success",
                            message: "МОЛ успешно изменен"
                        });
                    } else {
                        vm.$message({
                            showClose: true,
                            type: "error",
                            message: data.message
                        });
                    }
                    
                    vm = null;
                }
            });
            
        }
    },

    created: function () {
        this.getResponsiblePersons();
    }
});
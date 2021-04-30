Vue.component("commission-form", {
    template: "#commission-form",
    mixins:[crossdMixins],
    data: function(){
        return {
            model: {
                members: []
            },
            persons: []
        }
    },
    props:{
        commissionType: Number,
        membersToEdit: Array
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

        memberSelected: function (value, member) {
            var vm = this;
            var person = vm.persons.find(function (item) {
                return item.PersonID == value;
            });

            member.Position = person.Position;
        },

        headSelected: function(value, member){
            var vm = this;
            vm.model.members.forEach(function (item) {
                if (item.CommissionID !== member.CommissionID) {
                    item.IsHead = false;
                }
            });
        },

        removeMember: function (item, index) {
            if (item.CommissionID > 0) {
                item.RecordStatusID = 2;
                item.IsHead = false;
            } else {
                this.model.members.splice(index, 1);
            }
        },

        cancelRemoveMember: function (item, index) {
            item.RecordStatusID = 1;
        },

        addCommissionMember: function () {
            var vm = this;
            var member = {
                CommissionID: - vm.generateUid(),
                CommissionTypeID: vm.commissionType,
                PersonID: null,
                IsHead: false,
                RecordStatusID: 1,
                OrderNumber: 0 //this.model.members.length+1
            };
            this.model.members.push(member);

        },

        getAllowedPersons: function (item) {
            var usedPersons = this.model.members.filter(function (person) {
                return person.RecordStatusID !== 2
            });
            return this.persons.filter(function (person) {
                return !usedPersons.some(function (up) {
                    return up.PersonID === person.PersonID;
                }) || item.PersonID === person.PersonID;

            });
        },
        
        saveCommission: function () {
            var vm = this;
            vm.$refs.form.validate(function (valid) {
                if (valid) {
                    $.ajax({
                        method: "post",
                        dataType: "json",
                        contentType: "application/json, charset=utf-8",
                        url: "/fooCommissions/SaveCommission",
                        data: JSON.stringify({
                            members: vm.model.members
                        }),

                        success: function (responce) {
                            vm.$emit("commission-saved", vm.model);
                        }
                    });
                }
            });
        },

        moveUp: function (member, index) {
            
                var bufferMember = this.model.members[index - 1];
                this.$set(this.model.members, index-1, member);
                this.$set(this.model.members, index, bufferMember);

        },

        moveDown: function (member, index) {
            
                var bufferMember = this.model.members[index + 1];
                this.$set(this.model.members, index + 1, member);
                this.$set(this.model.members, index, bufferMember);
            
        }
    },

    watch: {
        membersToEdit: function (value) {
            
            if (value.length > 0) {
                this.model.members = value;
            } else {
                this.model.members = [];
                this.addCommissionMember();
            }
        }
    },
    
    created: function () {
        this.getObjectPersons();
        
        if (this.membersToEdit.length > 0) {
            this.model.members = this.membersToEdit;
        } else {
            this.model.members = [];
            this.addCommissionMember();
        }
    }
});
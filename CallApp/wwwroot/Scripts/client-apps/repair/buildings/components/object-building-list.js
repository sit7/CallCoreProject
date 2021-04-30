
Vue.component('object-building-list',
    {
        template: '#object-building-list',

        created: function() {


        },

        mounted: function() {
            //this.tabs.forEach(this.initform);

        },

        data: function() {
            var vm = this;

            return {
                editingIndex: null,
                current: Object,
                statusid: vm.statusid,
                Header: vm.header,
                //confirmdialog: function (payload) {
                //    $.ajax({
                //        url: payload.BuildingID > 0 ? '/repBuilding/UpdateBuilding' : '/repBuilding/AddBuilding',
                //        dataType: 'json',
                //        data: JSON.stringify(payload),
                //        method: 'post',
                //        success: () => console.log('updated building'),
                //        error: () => console.error('error updating building')
                //    });
                //}

            }
        },

        props: {
            credentials: { type: Object, required: true },
            statusid: { type: Number, required: true },
            header: { type: String, required: true },
            buildings: { type: Array, required: true },
            buildingmodel: { type: Object, required: true },

        },

        computed: {
            ObjectID: function() {
                return parseInt(this.$route.params.objectId);
            },

            Buildings: function() {
                return this.buildings;
            },


            Header: function() {
                return this.header;
            }
        },


        methods: {
         
            updateBuilding: function (building) {
                var vm = this;
                
                $.ajax({
                    url: building.BuildingID > 0 ? '/repBuilding/UpdateBuilding' : '/repBuilding/AddBuilding',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    method: 'post',
                    data: JSON.stringify(building),
                    success: function (response) {
                        if (response.success) {
                            if (vm.editingIndex !== null) {
                                Object.assign(vm.buildings[vm.editingIndex], response.data);

                                vm.$message({ offset: 100, message: 'Объект недвижимости обновлён', type: 'success' });
                            } else {
                                vm.buildings.push(response.data);
                                vm.$message({ offset: 100, message: 'Добавлен новый объект недвижимости', type: 'success' });

                            }
                        } else {
                            console.log(response);
                            vm.$message({ offset: 100, message: response.message, type: 'warning' });
                            
                        }
                    },
                    error: function (xhr, errorStatus, error) {
                        vm.$message({ offset: 100, message: error, type: 'error' });
                    },
                    complete: function() {
                        vm.showdialog = false;
                    }
                });
            },

            ondialogresult: function(args) {
                this.updateBuilding(args);

            },



            createNew: function () {
                this.$refs['buildingdialog'].show(this.buildingmodel.new(this.ObjectID), this.updateBuilding);
            },
            resetReady: function () { // вернуть на корректировку
                var vm = this;
                
                this.$confirm('Вернуть на редактирование?', 'Внимание', {
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                    cancelButtonClass: 'el-button--text',
                    type: 'warning'
                }).then(() => $.ajax({
                    url: '/repBuilding/SetObjectReadiness',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    method: 'post',
                    data: JSON.stringify({ Key: vm.ObjectID, Status: 3 }),
                    success: function (response) {
                        if (response.success === true) {
                            vm.$message({ offset: 100, message: response.message, type: 'success', onClose: ()=>vm.$router.push('/') });
                        } else {
                            vm.$message({ offset: 100, message: response.message, type: 'warning'});
                        }
                    },
                    error: function (jqXhr, textStatus, errorMessage) {
                        vm.$message({  message: errorMessage, type:'error' });
                    }
                    })).catch(_ => {});
            },

            setReady: function () { // установить готовность
                var vm = this;
                
                this.$confirm('Отправить на проверку?',
                    'Внимание',
                    {
                        confirmButtonText: 'Да',
                        cancelButtonText: 'Нет',
                        cancelButtonClass: 'el-button--text',
                        type: 'warning'
                    }).then(() =>
                    $.ajax({
                        url: '/repBuilding/SetObjectReadiness',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        method: 'post',
                            data: JSON.stringify({ Key: vm.ObjectID, Status: 2 }),
                        success: function(response) {
                            if (response.success === true) {
                                vm.$message({ offset: 100, message: response.message, type: 'success', onClose: () => vm.$router.push('/') });
                            } else {
                                console.log('something something');
                                vm.$message({ offset: 100, message: response.message, type: 'warning' });
                            }
                        },
                        error: function(jqXhr, textStatus, errorMessage) {
                            vm.$message({ offset: 100, message: errorMessage, type: 'error' });
                        }
                        })).catch(_ => {});
                    
                

			},
            
			getTitleIconClass: function(isverified) {
				return isverified ? 'el-icon-success' : 'el-icon-warning' ;
			},

			goToObjects: function () {
				this.$router.push({ path: '/' });
			},

			
			deleteBuilding: function (building, index) {

                var vm = this;
			    
                this.$confirm('Вы действительно хотите удалить этот объект недвижимости?', 'Внимание', {
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                    cancelButtonClass: 'el-button--text',
                    type: 'warning'
                })
                    .then(() => $.ajax({
                        url: '/repBuilding/DeleteBuilding',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        method: 'post',
                        data: JSON.stringify({ Key: building.BuildingID}),
                        success: function (response) {
                            if (response.success) {
                                vm.$message({ offset: 100, message: 'Объект недвижимости удалён', type: 'success' });
                                vm.buildings.splice(index, 1);
                            } else {
                                vm.$message({ offset: 100, message: response.message, type: 'warning' }); 
                            }
                        },
                        error: function (xhr, errorStatus, error) {
                            vm.$message({ offset: 100, message: error, type: 'error' });
                        }
                    })).catch(_ => {});
			},
		
            verifyBuilding: function (building, index) {

                var vm = this;
                
                this.$confirm('Вы хотите поставить отметку о проверке?', 'Внимание', {
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                    cancelButtonClass: 'el-button--text',
                    type: 'warning'
                })
                    .then(() => $.ajax({
                        url: '/repBuilding/SetVerifyStatus',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        method: 'post',
                        data: JSON.stringify({ Key: building.BuildingID, Status: true }),
                        success: function (response) {
                            if (response.success === true) {
                                vm.buildings[index].IsVerified = true;
                                vm.$message({ offset: 100, message: 'Объект недвижимости помечен как проверенный', type: 'success' }); 

                            } else {
                                vm.$message({ offset: 100, message: response.message, type: 'warning' }); 
                            };
                        },
                        error: function (xhr, errorStatus, error) {
                            vm.$message({ offset: 100, message: error, type: 'error' });
                        }
                    })).catch(_ => {});
            },

            undoVerify: function (building, index) {
                var vm = this;
                
                this.$confirm('Вы хотите снять отметку о проверке?', 'Внимание', {
                    confirmButtonText: 'Да',
                    cancelButtonText: 'Нет',
                    cancelButtonClass: 'el-button--text',
                    type: 'warning'
                }).then(() => $.ajax({
                    url: '/repBuilding/SetVerifyStatus',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    method: 'post',
                    data: JSON.stringify({ Key: building.BuildingID, Status: false }),
                    success: function (response) {
                        if (response.success === true) {
                            vm.buildings[index].IsVerified = false;
                            vm.$message({ offset: 100, message: 'Объект недвижимости помечен как непроверенный', type: 'success' }); 
                        } else {
                            vm.$message({ offset: 100, message: response.message, type: 'warning' }); 
                        }
                    },
                    error: function (xhr, errorStatus, error) {
                        vm.$message({ offset: 100, message: error, type: 'error' });
                    }
                    })).catch(_ => {});


            },

            editBuilding: function (item, index) {
                this.editingIndex = index;
                //this.current = this.buildingmodel.copy(item);
			    //this.$refs['buildingdialog'].show(item, this.confirmdialog);
                this.$refs['buildingdialog'].show(item, this.updateBuilding);
			},

            isheader: function() {
                return this.credentials.credargs.isheader;
            }, 

            allowedit: function (building) {
                return this.credentials.allowedit(building, this.statusid);
            },
            allowremove: function (building) {
                return this.credentials.allowremove(building, this.statusid);
            },
            allowverify: function (building) {
                return this.credentials.allowverify(building, this.statusid);
            },
            allowundoverify: function (building) {
                return this.credentials.allowundoverify(building, this.statusid);
            },
            allownew: function () {
                return !this.credentials.credargs.isheader && this.credentials.allownew(this.statusid);
            },
            allowsetready: function () {
                return !this.credentials.credargs.isheader && this.credentials.allowsetready(this.statusid);

            },
            allowresetready: function () {
                return !this.credentials.credargs.isheader && this.credentials.allowresetready(this.statusid);
            }

		}

	});
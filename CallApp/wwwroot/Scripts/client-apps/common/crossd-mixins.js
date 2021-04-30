var crossdRemote = {
    methods: {
        getcustomdata: function(row, property) {
            if (property.getcustomdata !== undefined && typeof property.getcustomdata === 'function')
                return JSON.stringify(property.getcustomdata(row));
            return JSON.stringify({ datafield: property.datafield });
        },

        remoteoptions: function(payload, property) {

            if (property.descriptor === undefined) {
                if (property.editortype === 'dropdownlist') {

                    var customdata = this.getcustomdata(payload, property);

                    var mapvalue = property.map.get(customdata);
                    if (mapvalue === undefined || mapvalue === null) {
                        property.map.set(customdata, []);
                        $.ajax({
                            url: property.url,
                            method: property.method,
                            data: property.method === 'get' ? null : customdata,
                            async: false,
                            dataType: 'json',
                            success: (response) => {
                                if (response.success) {
                                    property.map.set(customdata, response.data);
                                } else {
                                    console.error(response.message);
                                }
                            },
                            error: (xhr, error, status) => console.error(xhr),
                            complete: (xhr, status) => console.log(status)
                        });

                    }
                    return (row) =>
                        property.map.get(this.getcustomdata(row, property));
                } else {
                    return [];
                }
            } else {
                return (row, prop) =>
                    this.remoteoptions(row, prop);
            }
        },


    }
};
var crossdAuth = {
    props: {
        userinfo: {
            type: Object,
            required: true,
            default: function() {
                return {
                    isadmin: false
                }
            }
        }
    }
};

var methodFactory = {
    methods: {

        genericsuccess: (response, xhr, status, name) => {
            console.log('method [' + name + '] was executed successfully');
        },
        genericerror: (xhr, error, status, name) => {
            console.error('method [' + name + '] failed to execute');
        },
        genericcomplete: (xhr, status, name) => {
            console.error('method [' + name + '] completed');
        },

        createmethod: function (m_name, m_displayname, m_icon, m_url, m_success, m_error, m_complete, m_left) {
            if (m_name === undefined || typeof m_name !== 'string') throw new Error('method name must be declared as string');
            return {
                name: m_name,
                displayname: m_displayname,
                icon: m_icon,
                url: m_url,
                action: function(scope) {
                    return {
                    };
                },
                success: (response, xhr, status) => {
                    if (m_success !== undefined && typeof m_success === 'function') m_success(response, xhr, status);
                    this.genericsuccess(response, xhr, status, m_name);
                },
                error: (xhr, error, status) => {
                    if (m_error !== undefined && typeof m_error === 'function') m_error(xhr, error, status);
                    this.genericerror(xhr, error, status, m_name);
                },
                complete: (xhr, status) => {
                    if (m_complete !== undefined && typeof m_complete === 'function') m_complete(xhr, status);
                    this.genericcomplete(xhr, status, name);
                },
                left: (m_left !== undefined && (typeof m_left === 'boolean' && m_left)) ? true : undefined

            };
        },
        rightmethod: function(m_name, m_displayname, m_icon, m_url, m_success, m_error) {
            return this.createmethod(m_name, m_displayname, m_icon, m_url, m_success, m_error, undefined);
        },
        leftmethod: function(m_name, m_displayname, m_icon, m_url, m_success, m_error) {
            return this.createmethod(m_name, m_displayname, m_icon, m_url, m_success, m_error, undefined, true);
        },
        deletemethod: function(m_name, m_displayname, m_url, m_success, m_error) {
            return this.rightmethod(m_name, m_displayname, 'el-icon-delete', m_url, m_success, m_error);
        },
        editmethod: function(m_name, m_displayname, m_url, m_success, m_error) {
            return this.rightmethod(m_name, m_displayname, 'el-icon-edit', m_url, m_success, m_error);
        },
        silentmethod: function(m_name, m_displayname, m_url, m_success, m_error) {
            return this.rightmethod(m_name, m_displayname, m_url, m_success, m_error);
        }
    }
};

var propertyFactory = {
    methods: {
    }
};

var methoddecorator = {
    props: {
        customtouch: { type: Function, default: (method, userinfo, data ) => true }
    },
    methods: {
        touch: function(method, userinfo, data) {
            return this.customtouch(method, userinfo, data) && this.touchmethod(method, userinfo, data);
        },
        touchmethod: function(method, userinfo, data) {
            if (method !== undefined && method !== null && typeof method === 'object') {
                if (userinfo !== undefined && userinfo !== null) {
                    if (userinfo.hasOwnProperty('isadmin') && userinfo.isadmin) return true;
                    if (method.touch !== undefined && method.touch !== null) {
                        if (typeof method.touch === 'function') return method.touch(userinfo, data);
                        if (typeof method.touch === 'boolean') return method.touch;
                    } else {
                        //if (method.hasOwnProperty('displayname'))
                        //    console.warn(
                        //        `cannot touch method [${method.displayname}] because it has no [touch] method or property`);
                        //else if (method.hasOwnProperty('name'))
                        //    console.warn(
                        //        `cannot touch method [${method.name}] because it has not [touch] method or property`);
                        return true;
                    }
                }
            } else {
                throw new Error('cannot touch [method] object, because its undefined, null or not object at all');
            }
        }
    }
};

var itemcollection = {
    data: function() {
        return {
            listdata: [],
            isloading: false
        }
    },

    props: {
        keyfield: { type: String, requred: true },
        customsuccessload: { type: Function },
        payload: { type: Object },
        geturl: { type: String, required: true },
        addurl: { type: String },
        createnew: { type: Function }
    },
    methods: {
        setdata: function (respsonsearray) {
            this.listdata = respsonsearray;
        },
        addresponseitem: function(responseitem) {
            this.listdata.push(responseitem);
        },
        onaddclick: function() {
            this.$emit('add-new-clicked',
                this.createnew === undefined ? undefined : this.createnew(this.payload),
                this.addnewconfirm);
        },
        addnewconfirm: function (payload) {
            if (this.addurl === undefined) console.error('cannot resolve addurl');
            this.isloading = true;
            $.ajax({
                url: this.addurl,
                dataType: 'json',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify(payload),
                success: (response, xhr, status) => {
                    if (response.success) {
                        this.addresponseitem(response.data);
                        this.$emit('on-after-new', response);
                    }
                    else console.error(response.message);
                },
                error: (xhr, error, status) => {
                    console.error(xhr);
                },
                complete: (xhr, status) => this.isloading = false
            });
        },
        onsuccessload: function(response) {
            if (response.success !== undefined && typeof response.success === 'boolean') {
                if (response.success) {
                    if (response.totalcount !== undefined && typeof response.totalcount === 'number')
                        this.totalrows = response.totalcount;
                    if (this.customsuccessload !== undefined && typeof this.successload === 'function')
                        this.customsuccessload(this.setdata, response);
                    else {
                        if (response.data !== undefined && Array.isArray(response.data))
                            this.setdata(response.data);
                        else if (typeof response.data === 'object') {
                            setTimeout(() =>this.listdata.push(response.data), 100);
                        } else
                            this.$message(this.warning('Ответ не содержит данных для отображения в таблице'));
                    }
                } else {
                    if (response.message !== undefined) {
                        if (typeof response.message === 'string') {
                            this.$message(this.error(response.message));
                        } else {
                            this.$message(this.error('Что-то пошло не так, подробности в консоли'));
                            console.error(response);
                        }
                    } else {
                        this.$message(this.error('Что-то пошло не так, подробности в консоли'));
                        console.error(response);
                    }
                }
            }
        },
        oncompleteload: function(xhr, status) {
            this.isloading = false;
        },
        onerrorload: function(xhr, error, status) {
            console.error(xhr);
        },
        loaddata: function (payload) {
            this.isloading = true;
            $.ajax({
                url: this.geturl,
                data: JSON.stringify(payload || {}),
                method: payload === undefined ? 'get' : 'post',
                success: this.onsuccessload,
                complete: this.oncompleteload,
                error: this.onerrorload
            });
        }
    },
    mounted: function() {
        this.loaddata(this.payload);
    }
};

var methodexecutor = {
    props: {
        removerow: { type: Function, default: (row) => itemcollection.methods.delete(row)}
    },
    methods: {
        methodaction: function (parent, method, scope) {
            var currentcomponent = this;
            var actionresult = method.action(scope);
            if (actionresult === undefined || actionresult === null) throw new Error(`idk how to execute ${method.name}, it must return an object`);
            var execaction = () => console.log(`executing method ${method.displayname}`);
            if (actionresult.hasOwnProperty('execAction')) var actionconfig = actionresult.execAction;
            
                
            if (actionresult.hasOwnProperty('dialogPayload')) {
                var dialogpayload = actionresult.dialogPayload;
                execaction = (payload) => $.ajax({
                    url: actionconfig.url,
                    data: payload,
                    //data: JSON.stringify(payload),
                    contentType: "application/json",
                    method: 'post',
                    success: (response, xhr, status) => {
                        if (response.success) {
                            if (actionconfig.confirmtype === 'addnew') {
                                this.$emit('on-after-new', response, scope);
                            } else if (actionconfig.confirmtype === 'update') {
                                if (scope.row !== undefined) Object.assign(scope.row, response.data);
                                else this.$emit('on-after-update', response, scope);
                            } else {
                                console.warn(
                                    `${method.name} completed successfully, but we dont know how process response`);
                            }
                        } else {
                            console.error(response.message);
                        }
                    },
                    error: (xhr, error, status) => {
                        console.error(`error occured while executing ${method.name}`);
                    }
                });
                var dialog = parent.$refs[dialogpayload.dialogname] || currentcomponent.$refs[dialogpayload.dialogname];
                if (dialog === undefined || dialog === null) {
                    this.$emit('grid-action-clicked',
                        {
                            dialogname: dialogpayload.dialogname,
                            onfind: (d) =>
                                d.show(dialogpayload, execaction)
                        }
                    );
                    //throw new Error(`${dialogpayload.dialogname} not found!`);
                } else {
                    dialog.show(dialogpayload, execaction);
                }
            } else if (actionconfig !== undefined && actionconfig !== null) {
                $.ajax({
                    url: actionconfig.url,
                    dataType: "json",
                    contentType: "application/json; charsert=utf-8",
                    data: JSON.stringify(actionconfig.data),
                    method: 'post',
                    success: (response, status, xhr) => {
                        if (response.success) {
                            if (actionconfig.confirmtype === 'reload') {
                                currentcomponent.$router.go();
                            } else if (actionconfig.confirmtype === 'delete') {
                                if (scope.$index !== undefined)
                                    currentcomponent.listdata.splice(scope.$index, 1);
                                else {
                                    if (currentcomponent.keyfield !== undefined) {

                                        var index = currentcomponent.listdata.findIndex(
                                            l => l[currentcomponent.keyfield] ===
                                                (scope.row === undefined ? scope[currentcomponent.keyfield] : scope.row[currentcomponent.keyfield]));
                                        if (index !== undefined) currentcomponent.listdata.splice(index, 1);
                                        else console.error('idk how to delete row');
                                    } else {
                                        this.$emit('on-delete', scope);
                                    }
                                }
                            } else if (actionconfig.confirmtype === 'update') {
                                Object.assign(scope.row, response.data);
                            }
                        } else {
                            console.error(response.message);
                        }
                    },
                    error: (xhr, error, status) => {
                        console.error(`error occured while executing ${method.name}`);
                    }
                });
            }
        },

    }
};

var propertydecorator = {
    methods: {
        resolvepropertyvisible: function (userinfo, row) {
            return (property) => {
                if (property.descriptor !== undefined) return (this.resolvepropertyvisible(userinfo, row));
                if (property.hidden === undefined) return true;
                if (typeof property.hidden === 'boolean') return !property.hidden;
                if (typeof property.hidden === 'function') return !property.hidden(row, userinfo);
                console.warn(property.datafield + ' has no resolve visibility method');
                return false;
            };
        },
        resolvepropertyeditable: function (userinfo, row) {
            return (property) => {
                if (property.descriptor !== undefined) return (this.resolvepropertyeditable(userinfo, row));
                if (property.canedit === undefined) return true;
                if (typeof property.canedit === 'boolean') return property.canedit;
                if (typeof property.canedit === 'function') return property.canedit(row, userinfo);
                console.warn(property.datafield + ' has no resolve editable method');
                return false;
            };
        },
        resolveoptiondisabled: function(userinfo, row) {
            return (property) => {
                if (property.descriptor !== undefined) return (this.resolveoptiondisabled(userinfo, row));
                if (typeof property.isdisabled === 'function')
                    return (option) => property.isdisabled(option, row, userinfo);
                return (option) => false;
            }
        }
    },
}

var addnewresolver = {
    props: {
        customallownew: {
            type: Boolean | Function, default: true }
    },
    computed: {
        allownew: function () {
            return (userinfo) => {
                if (userinfo !== undefined && userinfo !== null && typeof userinfo === 'object') {
                    if (userinfo.hasOwnProperty('isadmin') && userinfo.isadmin) return true;
                    if (typeof this.customallownew === 'function') return this.customallownew(userinfo);
                }
                if (typeof this.customallownew === 'boolean') return this.customallownew;
            }

        }
    }
}

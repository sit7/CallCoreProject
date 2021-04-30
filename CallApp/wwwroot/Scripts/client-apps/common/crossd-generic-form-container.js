Vue.component('crossd-generic-form-container',
    {
        template: '#crossd-generic-form-container',
        mixins: [crossdAuth, propertydecorator],
        data: function () {
            var tabinfo = [];


            if (this.containermodel.hasOwnProperty('tabs') && Array.isArray(this.containermodel.tabs)) {
                this.containermodel.tabs.forEach(t =>
                    tabinfo.push(this.createtabinfo(t)));
            } else {
                tabinfo.push(this.createtabinfo(this.containermodel));
            }
            return {
                tabs: tabinfo,
            }
        },
        computed: {
            istabbed: function () {
                return this.containermodel.tabs !== undefined && Array.isArray(this.containermodel.tabs);
            },
            getform: function () {
                return ((model) => ((refs, name, istabbed) => istabbed ? refs[name][0] : refs[name])(this.$refs, this.getformkey(model), this.istabbed));
            },
        },
        props: {
            containermodel: { type: Object, required: true },
            payload: { type: Object, required: true },
            allowedit: { type: Function, default: function(creds, payload) {
                return creds.allowedit(payload);
            }}
        },
        methods: {
            resetproperty: function(propertyname) {
                this.payload[propertyname] = null;
            },
            onpayloadchanged: function(property, value) {
                this.payload[property.datafield] = value === '' ? null : value;
                if (property.afterchanged && typeof property.afterchanged === 'function')
                    property.afterchanged(this.payload[property.datafield], this.resetproperty);
                this.$emit('payload-property-changed', this.payload);
            },
            //resolveoptiondisabled: function (property, option) {
            //    if (property.isdisabled !== undefined && property.isdisabled !== null) {
            //        if (typeof property.isdisabled === 'function') {
            //            return property.isdisabled(option, this.payload, this.userinfo);
            //        }
            //        return false;
            //    }
            //    return false;
            //},
            //ispropertyeditable: function (property) {
            //    if (property.canedit === undefined) return true;
            //    if (typeof property.canedit === 'boolean') return property.canedit;
            //    if (typeof property.canedit === 'function') return property.canedit(this.payload, this.userinfo);
            //    console.warn(property.datafield + ' has no resolve editable method');
            //    return false;
            //},
            //ispropertyvisible: function (property) {
            //    if (property.hidden === undefined) return true;
            //    if (typeof property.hidden === 'boolean') return !property.hidden;
            //    if (typeof property.hidden === 'function') return !property.hidden(this.payload, this.userinfo);
            //    console.warn(property.datafield + ' has no resolve visibility method');
            //    return false;
            //},

            createtabinfo: function (t) {

                return {
                    haserrors: false,
                    name: t.name,
                    header: t.label,
                    isdisabled: function(editobject) {
                        var isvisible = t.isvisible;
                        if (isvisible !== undefined && editobject !== undefined) {
                            if (typeof isvisible === 'function') return !isvisible(editobject);
                            if (typeof isvisible === 'boolean') return !isvisible;

                            return false;
                        }
                        return false;
                    },
                    model: t,
                    formref: t.name + '_form',
                    map: new Map()
                }
            },


            validate: function() {
                if (this.istabbed) {
                    this.containermodel.tabs.forEach(tab => this.getform(tab).validate());
                } else {
                    this.getform(this.containermodel).validate();
                }
            },


            onvalidationfailed: function(index, event) {
                this.tabs[index].haserrors = true;
                this.$emit('container-validation-failed');
            },


            getformkey: function(model) {
                return model.name + '_form';
            },
            beforeLeaves: function(newname, oldname) {
                // переключение вкладок с oldname на newname
                // если возвращается false -- перехода не происходит
                // можно принудительно запускать валидацию
                // пусть пока останется так
                return true;
            },


         
        }
    })
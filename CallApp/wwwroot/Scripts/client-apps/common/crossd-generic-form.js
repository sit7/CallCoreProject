// дженерик форма для редактирования объекта formObject, описываемого дескриптором formmodel
Vue.component('crossd-generic-form', {
    template: '#crossd-generic-form',
    mixins: [crossdRemote],
    data: function () {

        return {
            // formkey -- имя внутренней формы для быстрого доступа к ней 
            formkey: this.formmodel.name + '_innerform',
            // описание свойств объекта, массив
            descriptor: this.formmodel.descriptor,
            customrules: {}
    }
	},
	props: {
		formmodel: {
			type: Object,
            required: true,
		},
        payload: { required: true, default: () => undefined },
        // полномочия пользователя
        credentials: { type: Object },
		ispropertyeditable: { type: Function },
		ispropertyvisible: {type: Function },
        isoptiondisabled: { type: Function },
    },

    methods: {
        onpropertychange: function (value, property) {
            this.$emit('payload-property-changed', property, value);            
        },

        // разберёмся с валидацией
        validator: function (valid, data) {
            if (valid) {
                this.$emit('confirm-form', this.formmodel);
            }
            else {
                var validationdata = new Array();
                for (var prop in data) {
                    if (Object.prototype.hasOwnProperty.call(data, prop)) {
                        if (data[prop] instanceof Array) {
                            data[prop].forEach(pv => validationdata.push(pv));
                        }
                    }
                }
                // скажем о провале родительскому компоненту
                
                this.$emit('validation-failed', this.formmodel, validationdata);
            }
        },

        validate: function () {
            
            // проверим, что навводил пользователь
			this.$refs[this.formkey].validate(this.validator);
		},
     
        reset: function() {
            this.$refs[this.formkey].resetFields();
        },

        resetrowproperty: function(row, propertyname) {
            row[propertyname] = null;
        },

        onselectchange: function(row, property, options) {
            if (property.hasOwnProperty('dependedproperties') && Array.isArray(property.dependedproperties)) {
                property.dependedproperties.forEach((prop) => this.resetrowproperty(row, prop));
            }
        },

        ondropdownloading: function (property, querysettings, onsuccess) {
            this.$emit('property-loading', querysettings, onsuccess);
        },

        onmasterpropertychanged: function (masterproperty) {
            this.$emit('slave-property-fetch', masterproperty, masterproperty.dependedproperties);
        },

        onbatchpropertyupdated: function (properties, callback) {
            this.$emit('form-properties-update', callback);
        }
	},

    computed: {
        isloading: function() {
            return this.payload === undefined || this.payload === null;
        },

        getrules: function() {
            return (property) => {
                if (property.rules !== undefined) {
                    if (Array.isArray(property.rules)) return property.rules;
                    if (typeof property.rules === 'function') return property.rules(this.payload);
                }
            }
        }
    },

	mounted: function () {
	},
})
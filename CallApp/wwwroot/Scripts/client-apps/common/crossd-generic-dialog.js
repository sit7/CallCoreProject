Vue.component('crossd-generic-dialog', {
    template: '#crossd-generic-dialog',
    mixins: [crossdAuth],
    data: function() {

        return {
            showdialog: false, // покажем диалог, если true
            haserrors: false,
            payload: undefined,
            confirmmethod: Function
        }
    },
    props: {
        model: { type: Object, required: true }, // дескриптор(ы)
        dialogstyle: { type: String, required: true, default: () => 'form' },
        append: { type: Boolean, default: () => false },
        nodestyle: { type: String, default: 'default' },
        allowadd: { type: Boolean, default: () => false }
    },

    methods: {
   
        // если жмакнули на actioncolumn в гриде на диалоге и не нашли новый диалог, 
        // который нужно вызвать
        // d содержит функцию, на входе которой найденный диалог
        // и ref имя диалога
        ongridactionclicked: function(parent, d) {
            var dialog = parent.$refs[d.dialogname];
            if (dialog !== undefined && dialog !== null) d.onfind(dialog);
            else console.error('could not find dialog');
        },
  
        canceldialog: function (e) {
            // закрытие по Х или кнопке "Отменить"
            if (this.dialogstyle === 'form') {
                this.$confirm('Изменения будут потеряны. Продолжить?',
                    'Внимание',
                    {
                        confirmButtonText: 'Да',
                        cancelButtonText: 'Нет',
                        cancelButtonClass: 'el-button--text',
                        type: 'warning'
                    }).then(this.hide).catch(_ => { });
                // молча закрываемся если grid или tree
            } else this.hide();
        },
        
        // закрытие по кнопке "Сохранить"
        confirmdialog: function (e) {
            if (this.dialogstyle === 'form') {
                this.haserrors = false;

                this.$refs[this.model.name + '_' + this.dialogstyle].validate();

                if (this.haserrors)
                    this.$alert('Обнаружены ошибки!', 'Внимание', { confirmButtonText: 'Исправить', type: 'warning' });
                else {
                    this.confirmmethod(this.payload);
                    this.hide();
                }
            }
            else this.hide();
        },

        onvalidatefailed: function() {
            this.haserrors = true;
        },

        onaddnew: function (row, confirm) {
            this.$emit('dialog-add-new', row, confirm);
        },


        show: function (loadargs, confirmmethod) {
            if (loadargs === undefined || loadargs === null) throw new Error(`nothing to show on dialog`);
            this.confirmmethod = confirmmethod;

            if (this.dialogstyle === 'form') {
                if (loadargs.hasOwnProperty('url')) {
                    $.ajax({
                        url: loadargs.url,
                        data: JSON.stringify(loadargs.data),
                        //dataType: "json",
                        //contentType: "application/json; charsert=utf-8",
                        contentType: "application/json",//похоже это минимальное добавление, чтобы в коре работало
                        method: 'post',
                        success: (response, xhr, status) => {
                            if (response.success) {
                                this.payload = response.data;
                            } else {
                                console.error(response.message);
                            }
                        },
                        error: (xhr, status, error) => console.error(error),
                    });
                } else if (loadargs.data !== undefined) {
                    this.payload = JSON.parse(JSON.stringify(loadargs.data));
                } else {
                    this.payload = loadargs;
                };
            } else {
                this.payload = JSON.parse(JSON.stringify(loadargs.data));
            }


            this.showdialog = true;
            
        },
        hide: function () {
            this.showdialog = false;
            this.payload = undefined;
            this.scope = null;

            
        },

    },

    mounted: function () {
        
    

    },

    //computed: {
     
    //    allowadd: function () {
    //        if (this.credentials === undefined) return false;
    //        return this.credentials.allownew();
    //    },
    //    touch: function () {
    //        if (this.credentials === undefined) return () => false;
    //        return this.credentials.touch;
    //    },

    //},

    created: function () {
    }
})
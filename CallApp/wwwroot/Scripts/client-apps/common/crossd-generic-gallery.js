Vue.component('crossd-generic-gallery',
    {
        template: '#crossd-generic-gallery',
        mixins: [crossdAuth, methoddecorator, methodexecutor, itemcollection],
        data: function() {
            return {

            };
        },
    
        methods: {
            //handleprogress: function(event, file, list) {
            //    console.log(event);
            //},
            //onsuccess: function(response, file, list) {
            //    setTimeout(()=>this.filelist.push(response.data), 500);
            //},
            onprogress: function(event, file, list) {
                console.log('ok');
            },
            //handlebeforeupload: function(file) {
            //    console.log(file);
            //    return true;
            //},
            //handlechange: function(file, list) {
                
            //},
            //onsuccessload: function(response) {
            //    this.filelist = response.data;
            //},
            //oncompleteload: function(xhr, status) {
            //    this.isloading = false;
            //},

            //handleedit: function(file) {
            //    console.log('edit ' + file);
            //},
            //handledelete: function (file, index) {
            //    var gallery = this;
            //    $.ajax({
            //        url: this.gallerymodel.removemethod,
            //        data: JSON.stringify({ Key: file[this.gallerymodel.idfield] }),
            //        dataType: 'json',
            //        method: 'post',
            //        success: function(response) {
            //            if (response.success) {
            //                gallery.filelist.splice(index, 1);
            //            } else {
            //                gallery.$message({ offset: 100, message: response.message, type: 'warning' });
            //            }
            //        },
            //        error: function(xhr, status, error) {
            //            gallery.$message({ offset: 100, message: error, type: 'error' });
            //        }
            //    });
            //},
            //handledownload: function(file) {
            //    console.log('download ' + file);
            //},
            //handlepreview: function(file) {
            //    console.log('preview ' + file);
            //},
            getallfiles: function () {
                var gallery = this;
                $.ajax({
                    url: gallery.gallerymodel.download,
                    data: JSON.stringify(gallery.uploadargs),
                    method: 'post',
                    contentType: "application/json",
                    //contentType: 'application/json; charset=utf-8',

                    success: function (response, status, xhr) {
                        
                    },
                    error: function(xhr, status, error) {
                        console.log('error');
                    },
                    complete: function(xhr, status) {
                        var element = document.createElement('a');
                        element.setAttribute('href', xhr.responseJSON.data.data);
                        element.setAttribute('download', xhr.responseJSON.data.filename);

                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    }
                });
            }
        },

        mounted: function () {
            //this.isloading = true;
            //$.ajax({
            //    url: this.gallerymodel.getmethod,
            //    data: JSON.stringify(this.uploadargs),
            //    dataType: 'json',
            //    timeout: 120000,
            //    contentType: "application/json; charsert=utf-8",
            //    success: this.onsuccessload,
            //    error: function (xhr, error, trhown) {
            //        console.log(123);
            //    },
            //    complete: this.oncompleteload,
            //    type: 'post'
            //});
        },
        props: {

            gallerymodel: { type: Object, required: true },
            uploadargs: { type: Object, required: true },
            allownew: { type: Function, required: true },
   
        }
    });
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Globalization;
using System.IO;
using System.Text;
//using System.Web.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ServiceLib.Infrastructure
{
    /// <summary>
    /// штука, которая заменяет дефолтную сериализацию параметров в методах контроллера
    /// </summary>
    public class JsonNetModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            //controllerContext.HttpContext.Request.InputStream.Position = 0;
            //var stream = controllerContext.RequestContext.HttpContext.Request.InputStream;
            //var readStream = new StreamReader(stream, Encoding.UTF8);
            //var s = readStream.ReadToEnd();
            //var json = JObject.Parse(s);
            //var obj = json.ToObject(bindingContext.ModelType, JsonSerializer.Create(new JsonSerializerSettings()
            //{
            //    Culture = CultureInfo.GetCultureInfo("ru-RU"),

            //}));
            return null;//obj
        }
        public Task BindModelAsync(/*ControllerContext controllerContext,*/ ModelBindingContext bindingContext)
        {
            //controllerContext.HttpContext.Request.InputStream.Position = 0;
            //var stream = controllerContext.RequestContext.HttpContext.Request.InputStream;
            //var readStream = new StreamReader(stream, Encoding.UTF8);
            //var s = readStream.ReadToEnd();
            //var json = JObject.Parse(s);
            //var o = json.ToObject(bindingContext.ModelType, JsonSerializer.Create(new JsonSerializerSettings()
            //{
            //    Culture = CultureInfo.GetCultureInfo("ru-RU"),
            //    //DateFormatHandling = DateFormatHandling.IsoDateFormat,
            //    //DateTimeZoneHandling = DateTimeZoneHandling.Local,
            //    //DateParseHandling = DateParseHandling.DateTime
            //}));
            //return o;

            throw new NotImplementedException();
        }
    }

}
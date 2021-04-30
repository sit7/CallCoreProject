using Microsoft.AspNetCore.Mvc;
using ServiceLib.Infrastructure;
using System;
//using System.Web.Mvc;
//using System.Web.Mvc;

namespace ServiceLib.Models.DTO.Common
{

    

    public interface IRecordDate
    {
        DateTime RecordDate { get; }
    }

    /// <summary>
    /// определяет комментарий к чему-либо с ключом TOwnerKey
    /// </summary>
    /// <typeparam name="TKey">тип ключа комментария</typeparam>
    /// <typeparam name="TOwnerKey">тип ключа владельца комментария</typeparam>
    interface IComment<TKey, out TOwnerKey> : ITreeNode<TKey, TOwnerKey>, IRecordDate 
        where TOwnerKey : struct where TKey : struct
    {
        string Comment { get; set; }
        string UserName { get; set; }
        bool IsEdited { get; set; }
    }

    interface ITreeNode<TKey, out TOwnerKey> : IKey<TKey>, IParentKey<TKey>, IOwnerKey<TOwnerKey> where TOwnerKey : struct where TKey : struct
    {
        
    }

    /// <summary>
    /// определяет ключ сущности
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    interface IKey<out TKey> where TKey: struct 
    {
        TKey Key { get; }
    }

    /// <summary>
    /// определяет внешний ключ родительского объекта этой же сущности
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    interface IParentKey<TKey> where TKey : struct
    {
        TKey? ParentKey { get; }
    }

    /// <summary>
    /// определяет внешний ключ сущности-владельца детали
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    interface IOwnerKey<out TKey> where TKey : struct
    {
        TKey OwnerKey { get; }
    }

    public static class CrossDControllerExtension
    {
        public static JsonResult JsonNetResult(this Controller controller, bool sccss, string msg, object data)
        {
            return controller.Json(new { success = sccss, message = msg, data });
        }

        //public static JsonNetResult JsonNetResult(this Controller controller, ModelStateDictionary state)
        //{
        //    return new JsonNetResult(new { success = false, message = "Ошибка валидации", state }, JsonRequestBehavior.AllowGet);
        //}

        //public static JsonNetResult JsonNetResult(this Controller controller, Exception e)
        //{
        //    return new JsonNetResult(new { success = false, message = e.Message }, JsonRequestBehavior.AllowGet);
        //}

        //public static JsonNetResult JsonNetResult(this Controller controller, bool sccss, string msg, object data,
        //    int count)
        //{
        //    return new JsonNetResult(new { success = sccss, message = msg, data, totalcount = count }, JsonRequestBehavior.AllowGet);
        //}

        //public static JsonNetResult JsonNetResult(this Controller controller, string filename, byte[] content)
        //{
        //    return new JsonNetResult(new
        //    {
        //        success = true,
        //        message = "ok",
        //        data = new
        //        {
        //            filename,
        //            data = $"data:{System.Net.Mime.MediaTypeNames.Application.Zip};base64,{Convert.ToBase64String(content)}"
        //        }
        //    }, JsonRequestBehavior.AllowGet);
        //}
    }
}

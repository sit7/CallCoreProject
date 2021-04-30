using System;
//using System.Web.Http.ModelBinding;
//using DocumentFormat.OpenXml.Presentation;
using Microsoft.AspNetCore.Mvc;
using ServiceLib.Infrastructure;

namespace ServiceLib.Models.DTO.Args
{
    public class StatusEntityArgs<T, S> : KeyEntityArgs<T> where T : struct where S: struct 
    {
        public StatusEntityArgs() { }

        public S Status { get; set; }
    }

    public interface ISearchString
    {
        string SearchString { get; }
    }

    public abstract class PagingArgs : BaseEntityArgs
    {
        public int RequestPage { get; set; }
        public int PageSize { get; set; }
    }


    [ModelBinder(typeof(JsonNetModelBinder))]
    public class ContainsStringArgs : BaseEntityArgs, ISearchString
    {
        public string SearchString { get; set; }
        public ContainsStringArgs() { }
    }

    [ModelBinder(typeof(JsonNetModelBinder))]
    public class ObjectPagingArgs : PagingArgs, ISearchString
    {

        public string SearchString { get; set; }

        public ObjectPagingArgs() { }
    }

    public class RequestPagingArgs : PagingArgs 
    {
        public int? ObjectID { get; set; }
        public int? RequestStatusID { get; set; }
        public RequestPagingArgs() { }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? RequestTypeID { get; set; }
        public bool HasFiles { get; set; }
        public int? BuildingID { get; set; }
        public bool IsRegistered { get; set; }
        public bool IsUrgent { get; set; }
        public int? ObservationTypeID { get; set; }
        public int? PersonID { get; set; }
    }

    //public class ContainsPagingArgs : PagingArgs<ContainsStringArgs>
    //{
    //    public ContainsPagingArgs() { }
    //}

    //public class RequestPagingArgs : PagingArgs<RepairRequestArgs>
    //{
    //    public RequestPagingArgs() { }
    //}


    //public abstract class PagingArgs<T> : BaseEntityArgs
    //    where T: BaseEntityArgs, new()
    //{
    //    public int PageSize { get; set; } // размер страницы в паджинаторе
    //    public int RequestPage { get; set; } // открываемая страница

    //    public T Args { get; set; }

    //    protected PagingArgs()
    //    {

    //    }
    //}

    //public abstract class FilterArgs<T> : BaseEntityArgs, ISearchString
    //    where T: BaseEntityArgs, new()
    //{
    //    public string SearchString { get; set; }
    //    public T Filter { get; set; }

    //    protected FilterArgs()
    //    {

    //    }
    //}

    //[ModelBinder(typeof(JsonNetModelBinder))]
    //public class ObjectSearchArgs : FilterArgs<ObjectSearchArgs>
    //{
    //    public ObjectSearchArgs() { }
    //}

    //public abstract class FilterPagingArgs<T> : PagingArgs<T>
    //    where T : FilterArgs<T>, new()
    //{
    //    protected FilterPagingArgs() { }
    //}

    //public class ObjectPagingArgs : FilterPagingArgs<ObjectSearchArgs>
    //{
    //    public ObjectPagingArgs() { }
    //}
}
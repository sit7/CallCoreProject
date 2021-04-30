using System;
using System.Linq;
using CallApp.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace CallApp.Controllers
{
    public class CallController : Controller
    {

        private CallDB CallDB { get; }
        

        public CallController(CallDB callDB)
        {
            CallDB = callDB;
        }

        private int UserID()
        {
            var _cp = HttpContext.User;
           int i = int.Parse(_cp.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).Select(c => c.Value).SingleOrDefault());
            return i ;
        }

        public ActionResult CallsList()
        {
            return View();
        }

        public ActionResult CallsspList()
        {
            return View();
        }

        public async Task<ActionResult> GetCallsFromSP()
        {
            IQueryable<getCallsResult> tmp;
            try
            {
                tmp = CallDB.GetCalls(DateTime.Now.AddDays(-100), DateTime.Now);
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
            return await Task.FromResult(Json(tmp));
        }

            public async Task<ActionResult> GetCallsFromDate(DateTime date, int isNotResolved)
        {
            var filterDate = date.Date;

            var calls = CallDB.supCall
                .Where(call => call.CallDate >= filterDate
                  && call.RecordStatusID != 2
                   && (call.StatusID == 1 || isNotResolved == 0)
                                  )
                .Select(call => new
                {
                    call.CallID,
                    Object = call.ShortName,
                    ObjectID = call.ObjectID,
                    ShortName = call.ShortName,
                    Name = call.Name,
                    Description = call.Description,
                    Solution = call.Solution,
                    PhoneNumber = call.PhoneNumber,
                    CreateUserID = call.CreateUserID,
                    CreateUser = CallDB.supUser.FirstOrDefault(user => user.UserID == call.CreateUserID).ShortName,
                    ResponsibleUserID = call.ResponsibleUserID,
                    ResponsibleUser = call.ResponsibleUser.ShortName,
                    CallDate = call.CallDate,
                    RecordDate = call.RecordDate,
                    UserID = call.UserID,
                    TaskID = call.TaskID,
                    Task = call.supTask.Name,
                    CallerName = call.CallerName,
                    PriorityID = call.PriorityID,
                    Priority = call.supPriority.Name,
                    StatusID = call.StatusID,
                    Status = call.supStatus.Name,
                    call.IsInc
                }).OrderByDescending(call => call.CallDate);
            return await Task.FromResult(Json(calls));
        }


        public JsonResult GetStatuses()
        {
            var statuses = CallDB.supStatus
                .Select(s => new
                {
                    s.StatusID,
                    s.Name,

                });

            return Json(statuses);
        }

        public JsonResult GetPriorities()
        {
            var priorities = CallDB.supPriority
                .Select(s => new
                {
                    s.PriorityID,
                    s.Name,

                });

            return Json(priorities);
        }

        [HttpPost]
        public JsonResult GetObjects(string _s)
        {
            string searchString= string.IsNullOrEmpty(_s)?"":_s;
            var objects = CallDB.supObject
                .Where(d => (d.Name.Contains(searchString)) || searchString == "")
                .Select(s => new
                {
                    s.ObjectID,
                    s.Name,
                });
            return Json(objects);
        }

        public JsonResult GetTasks()
        {
            var tasks = CallDB.supTask
                .Select(s => new
                {
                    s.TaskID,
                    s.Name,

                });
            return Json(tasks);
        }

        public JsonResult GetUsers()
        {
            var users = CallDB.supUser
                .Select(s => new
                {
                    s.UserID,
                    s.ShortName,

                });
            return Json(users);
        }

        [HttpPost]
        public ActionResult SaveCall([FromBody] supCall call)
        {
            var now = DateTime.Now;
            var recordDate = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second);

            call.RecordDate = DateTime.Now;
            call.UserID = UserID();

            var dBCall = CallDB.supCall.FirstOrDefault(r => r.CallID == call.CallID);

            CallDB.Entry(dBCall).CurrentValues.SetValues(call);

            try
            {

                CallDB.SaveChanges();
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
            
            return Json(call.CallID);
        }

        [HttpPost]
        public ActionResult AddCall([FromBody] supCall call)
        {

            var now = DateTime.Now;
            var recordDate = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second);
            call.RecordDate = DateTime.Now;
            call.UserID = UserID();

            call.CallID = 0;

            var dBCall = CallDB.supCall.Add(call);

            try
            {

                CallDB.SaveChanges();
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }

            var result = CallDB.supCall
                .Where(call1 => call1.CallID == call.CallID)
                .Select(call1 => new
                {
                    call1.CallID,
                    Object = call1.supObject.Name,
                    ObjectID = call1.ObjectID,
                    ShortName = call1.ShortName,
                    Description = call1.Description,
                    PhoneNumber = call1.PhoneNumber,
                    CreateUserID = call1.CreateUserID,
                    ResponsibleUserID = call1.ResponsibleUserID,
                    CallDate = call1.CallDate,
                    RecordDate = call1.RecordDate,
                    UserID = call1.UserID,
                    TaskID = call1.TaskID,
                    Task = call1.supTask.Name,
                    CallerName = call1.CallerName,
                    PriorityID = call1.PriorityID,
                    Priority = call1.supPriority.Name,
                    StatusID = call1.StatusID,
                    Status = call1.supStatus.StatusID

                }).OrderByDescending(call1 => call1.CallDate);



            var requestResult = new
            {
                success = true,
                data = result
            };

            return Json(requestResult);

        }

        [HttpPost]
        public ActionResult DeleteCall([FromBody] int id)
        {
            var entity = CallDB.supCall
                .FirstOrDefault(call =>
                    call.CallID == id);

            if (entity != null)
            {
                entity.UserID = UserID();
                entity.RecordDate = DateTime.Now;
                entity.RecordStatusID = 2;
                CallDB.SaveChanges();
                return Json(true);
            }
            return Json(false);
        }

        [HttpPost]
        public ActionResult DoneCall([FromBody] int id)
        {
            var entity = CallDB.supCall
                .FirstOrDefault(call =>
                    call.CallID == id);

            if (entity != null)
            {
                entity.UserID = UserID();
                entity.RecordDate = DateTime.Now;
                entity.StatusID = 3 - entity.StatusID;
                CallDB.SaveChanges();
                return Json(true);
            }
            return Json(false);
        }
    }
}
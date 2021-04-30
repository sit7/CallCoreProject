using CallApp.Models.DTO.GlobalObject;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using ServiceLib.Models;
using Microsoft.AspNetCore.Mvc;
using ServiceLib.Models.DTO.Common;
using ServiceLib.Infrastructure;

namespace CallApp.Controllers
{
    //[Authorize]
    public class ObjectController : Controller
    {
        private GlobalObjectDTO CopyObject(glbObject obj)
        {
            return new GlobalObjectDTO()
            {
                ObjectID = obj.ObjectID,
                Name = obj.Name,
                Code = obj.Code,
                ShortName = obj.ShortName,
                UltraShortName = obj.UltraShortName,
                ObjectTypeID = obj.ObjectTypeID,
                PostIndex = obj.PostIndex,
                City = obj.City,
                Street = obj.Street,
                Region = obj.Region,
                HouseNumber = obj.HouseNumber,
                PhoneNumber = obj.PhoneNumber,
                FaxNumber = obj.FaxNumber,
                EMail = obj.EMail,
                WWW = obj.WWW,
                INN = obj.INN,
                KPP = obj.KPP,
                OKPO = obj.OKPO,
                OKVED = obj.OKVED,
                BankName = obj.BankName,
                BIC = obj.BIC,
                CurrentAccount = obj.CurrentAccount,
                PersonalAccount = obj.PersonalAccount,
                HeadPosition = obj.HeadPosition,
                HeadFIO = obj.HeadFIO,
                
                HeadEMail = obj.HeadEMail,
                HeadSignature = obj.HeadSignature,
                IsDepartment = obj.IsDepartment,
                MainObjectID = obj.MainObjectID,
                ObjectStatusID = obj.ObjectStatusID,
                IsFew = obj.IsFew,
                HouseBlock = obj.HouseBlock,
                СorrAccount = obj.СorrAccount,
                СorrBank = obj.СorrBank,
                PersonalAccount2 = obj.PersonalAccount2,
                Is24Group = obj.Is24Group,
                IsIO = obj.IsIO,
                IsBudget = obj.IsBudget,
                ObjectGroupID = obj.glbObjectType?.ObjectGroupID
            };
        }

        private ApplicationDbContext ApplicationDbContext { get; set; }//
        private CrossDUser CrossDUser { get; set; }//
        public ObjectController(CrossDUser _user, ApplicationDbContext _context)//
        {
            CrossDUser = _user;
            ApplicationDbContext = _context;
        }

        public ActionResult ObjectList()
        {
            return View();
        }

        public ActionResult GlobalObjects()///
        {
            return View();
        }
    
        public JsonResult GetObjects()
        {
            var dbResult = ApplicationDbContext.glbObject.ToList();
            var objects = (from s in ApplicationDbContext.glbUserObject
                where s.UserID == CrossDUser.Current.UserID //AppUser.Id
                orderby s.glbObject.OrderNumber
                select new
                {
                    s.glbObject.ObjectID,
                    s.glbObject.ShortName,
                    s.glbObject.Street,
                    s.glbObject.HouseNumber,
                    s.glbObject.PhoneNumber,
                    s.glbObject.HeadFIO,
                    s.glbObject.HeadPhoneNumber,
                    s.glbObject.OrderNumber
                });
            return Json(objects);
        }

        //[Authorize]
        public async Task<ActionResult> GetObjectsList(/*[ModelBinder(typeof(JsonNetModelBinder))]
            GlobalObjectArgs args*/)
        {
            try
            {

                var filterobjects = ApplicationDbContext.glbObject./*Where(w => w.glbUserObject.Any(a => a.UserID == CrossDUser.UserID)).*/Select(s => new GlobalObjectShortDTO()
                {
                    HouseBlock = s.HouseBlock,
                    HouseNumber = s.HouseNumber,
                    City = s.City,
                    HeadFIO = s.HeadFIO,
                    Street = s.Street,
                    Region = s.Region,
                    ObjectStatusID = s.ObjectStatusID,
                    PostIndex = s.PostIndex,
                    HeadPhoneNumber = s.HeadPhoneNumber,
                    PhoneNumber = s.PhoneNumber,
                    ShortName = s.ShortName,
                    ObjectID = s.ObjectID,
                    MainObjectID = s.MainObjectID

                }).ToList();
                //var result = this.Json(filterobjects);
                var result = this.JsonNetResult(true, "ok", filterobjects);

                //return await Task.FromResult(Json(ApplicationDbContext.glbObject));

                return await Task.FromResult(result);
            }
            catch (Exception e)
            {
                return  null;
            }

        }

        public async Task<ActionResult> SetCurrentObject([FromBody] int args)
        {
            try
            {
                int res = ApplicationDbContext.ChangeObjectForUser(args, CrossDUser.Current.UserID);
                return await Task.FromResult(this.JsonNetResult(res > -2, (res > 0) ? "ok" : "Не удалось установить текущий объект", null));
            }
            catch (Exception e)
            {
                return Json(false);
            }
        }

        //[HttpPost]
        public async Task<ActionResult> GetObjectGroups()
        {
            try
            {
                return await Task.FromResult(this.JsonNetResult(true, "ok",
                    ApplicationDbContext.glbObjectGroup.Select(s => new { ObjectGroupName = s.Name, s.ObjectGroupID })));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(this.JsonNetResult(false, ex.Message, null));
            }
        }

        //[HttpPost]
        //public async Task<JsonNetResult> GetObjectTypes([ModelBinder(typeof(JsonNetModelBinder))]
        //    EntryKeyArgs<int> args)
        //{
        //    try
        //    {
        //        return await Task.FromResult(this.JsonNetResult(true, "ok", ApplicationDbContext.glbObjectType
        //            .Where(t => t.ObjectGroupID == args.Key).Select(s =>
        //                new {ObjectTypeID = s.ObjectTypeID, ObjectTypeName = s.Name})));
        //    }
        //    catch (Exception ex)
        //    {
        //        return await Task.FromResult(this.JsonNetResult(false, ex.Message, null));
        //    }
        //}

        //[HttpPost]
        //public async Task<JsonNetResult> SetObjectStatus([ModelBinder(typeof(JsonNetModelBinder))]
        //    StatusEntityArgs<int, int> args)
        //{
        //    try
        //    {
        //        var obj = ApplicationDbContext.glbObject.Find(args.Key);
        //        if (obj != null)
        //        {
        //            ApplicationDbContext.Entry(obj).CurrentValues["ObjectStatusID"] = args.Status;
        //            ApplicationDbContext.SaveChanges();
        //            var message = args.Status == 2 ? "Объект возвращён на редактирование" : "Объект проверен";
        //            return await Task.FromResult(this.JsonNetResult(true, message, obj));
        //        }
        //        else
        //        {
        //            return await Task.FromResult(this.JsonNetResult(false, "Не найден объект", null));
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return await Task.FromResult(this.JsonNetResult(false, e.Message, null));
        //    }
        //}
    
        public async Task<ActionResult> GetObjectTypes()
        {
            //var _objectTypes = (from s in ApplicationDbContext.glbObjectType
            //                    select new
            //                    {
            //                        s.ObjectTypeID,
            //                        s.Name
            //                    });
            //return Json(_objectTypes);
            try
            {
                return await Task.FromResult(this.JsonNetResult(true, "ok",
                    ApplicationDbContext.glbObjectType.Select(s => new { s.ObjectTypeID, ObjectTypeName = s.Name })));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(this.JsonNetResult(false, ex.Message, null));
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetObject(/*[ModelBinder(typeof(JsonNetModelBinder))]EntryKeyArgs<int> args*/[FromBody] int args)
        {
            var obj = ApplicationDbContext.glbObject.Find(args);

            if (obj != null)
            {
                ApplicationDbContext.Entry(obj).Reference(p => p.glbObjectType).Load();
                return await Task.FromResult(this.JsonNetResult(true, "ok", CopyObject(obj)));
            }
            else
            {
                return await Task.FromResult(this.JsonNetResult(false, "Не найден объект!", null));
            }

        }
        [HttpPost]
        public async Task<ActionResult> UpdateObject(/*[ModelBinder(typeof(JsonNetModelBinder))]
            GlobalObjectDTO obj*/[FromBody] glbObject obj)
        {
            try
            {
                var glbobj = ApplicationDbContext.glbObject.Find(obj.ObjectID);
                ApplicationDbContext.Entry(glbobj).CurrentValues.SetValues(obj);
                if (ModelState.IsValid)
                {
                    ApplicationDbContext.SaveChanges();
                    return await Task.FromResult(this.JsonNetResult(true, "Данные успешно обновлены", glbobj));
                }
                else
                {
                    return await Task.FromResult(this.JsonNetResult(false, "Ошибка валидации данных", null));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(this.JsonNetResult(false, ex.Message, null));
            }
        }

        //// GET: glbObjects
        //public ActionResult CurrentCard(int? id)
        //{
        //    SelectList objectTypes = new SelectList(ApplicationDbContext.glbObjectType, "ObjectTypeId", " Name", "0");
        //    ViewBag.ObjectTypes = objectTypes;

        //    if (User.IsInRole("admin") || User.IsInRole("object-watcher"))
        //    {
        //        ViewBag.Access = "";
        //        ViewBag.Button = "display:inline-block;margin-top:10px;";
        //    }
        //    else
        //    {
        //        ViewBag.Access = "disabled";
        //        ViewBag.Button = "display:none";
        //    }


        //    //if (id != objectID)
        //    //{
        //    //    if (!(User.IsInRole("admin")||User.IsInRole("manager")))
        //    //    {
        //    //ViewBag.Access = "disabled";
        //    //ViewBag.Button = "display:inline-block;margin-top:10px;";
        //    //    }
        //    //}

        //   //if( db.glbUserObject.Where(d=>d.UserID == userID && d.glbObject.ObjectID == id).Count()==0)
        //   // {
        //   //     return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //   // }
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    glbObject glbObject = ApplicationDbContext.glbObject.Find(id);
        //    if (glbObject == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(glbObject);
        //}

        //[HttpPost]
        //public ActionResult CurrentCard( glbObject glbObject) //сохранение карточки здесь
        //{
        //    int objectID = glbObject.ObjectID;
        //    SelectList objectTypes = new SelectList(ApplicationDbContext.glbObjectType, "ObjectTypeId", " Name", "0");
        //    ViewBag.ObjectTypes = objectTypes;
        //    if (glbObject.INN.Length != 10)
        //    {
        //        ModelState.AddModelError("INN", "ИНН должен состоять из 10 цифр");
        //    }

        //    if (glbObject.PostIndex.Length != 6)
        //    {
        //        ModelState.AddModelError("PostIndex", "Почтовый индекс должен состоять из 10 цифр");
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        ApplicationDbContext.Entry(glbObject).State = EntityState.Modified;
        //        ApplicationDbContext.SaveChanges();
        //        return RedirectToAction("CurrentCard/"+ objectID);
        //    }

        //    ViewBag.Message = "Запрос не прошел валидацию";

        //    return View(glbObject);
        //}

        //[HttpPost]
        //public JsonResult changeObjectForUser(int _objectID)
        //{

        //    try
        //    {
        //        ApplicationDbContext.ChangeObjectForUser(AppUser.UserID, _objectID);
        //    }
        //    catch (Exception e)
        //    {
        //        Response.StatusCode = (int)HttpStatusCode.BadRequest;
        //        return Json(e.InnerException.Message);
        //    }

        //    return Json("true");
        //}

        //public JsonResult GetLicenses(int _objectID)
        //{
        ////    int objectID;
        ////    if (Request.IsAuthenticated)
        ////    {
        ////        var identity = (System.Security.Claims.ClaimsPrincipal)System.Threading.Thread.CurrentPrincipal;
        ////        objectID = Int32.Parse(identity.Claims.Where(c => c.Type == "ObjectID").Select(c => c.Value).SingleOrDefault());
        ////    }
        ////    else
        ////        objectID = 4;
        //    var dbResult = ApplicationDbContext.glbLicense.Where(d => d.ObjectID == _objectID).
        //        Select(s=> new
        //        {
        //            s.LicenseID,
        //            LicenseTypeName=s.glbLicenseType.Name,
        //            s.LicenseNumber,
        //            s.LicenseEndDate,
        //            s.ObjectID,
        //            s.LicenseTypeID
        //        });
        //    return Json(dbResult/*, JsonRequestBehavior.AllowGet*/);
        //}

        //[HttpPost]
        //public ActionResult UploadLicenseScan(/*repRequestFile pic, */HttpPostedFileBase _scan, long _licenseID)
        //{
        //    var lic = ApplicationDbContext.glbLicense.Where(d => d.LicenseID == _licenseID).Select(s => new
        //    {
        //        s.LicenseID,
        //        s.glbLicenseType.Name,
        //        s.LicenseNumber,
        //        s.LicenseEndDate
        //    });

        //    if (ModelState.IsValid && _scan != null)
        //    {
        //        byte[] imageData = null;
        //        // считываем переданный файл в массив байтов
        //        using (var binaryReader = new BinaryReader(_scan.InputStream))
        //        {
        //            imageData = binaryReader.ReadBytes(_scan.ContentLength);
        //        }

        //        //lic.Image = imageData;

        //        ApplicationDbContext.SaveChanges();
        //    }
        //    //return RedirectToAction("../Repair/RepRequestCard/" + pic.RequestID);
        //    return null;
        //}

        //[HttpPost]
        //public JsonResult UpdateLicense(glbLicense license)
        //{
        //    //document.RecordDate = DateTime.Now.Date;
        //    //document.DocumentStatusID++;
        //    ViewBag.ID = license.LicenseID;
        //    if (license.Comment == null) license.Comment = "";
        //    if (ModelState.IsValid)
        //    {
        //        ApplicationDbContext.Entry(license).State = EntityState.Modified;
        //        try
        //        {
        //            ApplicationDbContext.SaveChanges();
        //        }
        //        catch (Exception e)
        //        {
        //            Response.StatusCode = (int)HttpStatusCode.BadRequest;
        //            return Json(e.InnerException.InnerException.Message);
        //        }
        //        return Json("true");
        //    }
        //    return Json("false");
        //}

        //public FileContentResult DownloadLicenseScan(int _licenseID)
        //{
        //    byte[] fileData;
        //    string fileName;
        //    var record = from p in ApplicationDbContext.glbLicense
        //                 where p.LicenseID == _licenseID
        //                 select p;
        //    fileData = (byte[])record.First().Image.ToArray();
        //    fileName = "1.pdf"/*record.First().FileName*/;



        //    return File(fileData, "image/jpeg", fileName);
        //}

        ////public ActionResult ShowLicenseScan(int _licenseID)
        ////{
        ////    return View(FoodDB.glbLicense.Where(d => d.LicenseID == _licenseID));
        ////}

        //public JsonResult IsInnCorrect(string inn)
        //{
        //    //int _summ=0;
        //    //int[] weights = { 2, 4, 10, 3, 5, 9, 4, 6, 8};

        //    //for (int i = 0; i < 9; i++)
        //    //{
        //    //    _summ += (int)Char.GetNumericValue(inn[i]) * weights[i];
        //    //}
        //    var innValidator = new INNValidator(inn);
        //    return Json(innValidator.Validate()/*, JsonRequestBehavior.AllowGet*/);
        //}
    }
}

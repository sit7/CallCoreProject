using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ServiceLib.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CallApp.Models
{
    public partial class supCall
    {
        [Key]
        public int CallID { get; set; }
        public Nullable<int> ObjectID { get; set; }
        public string ShortName { get; set; }
        public string Description { get; set; }
        public string PhoneNumber { get; set; }
        public Nullable<int> CreateUserID { get; set; }
        public Nullable<int> ResponsibleUserID { get; set; }
        public Nullable<System.DateTime> CallDate { get; set; }
        public System.DateTime RecordDate { get; set; }
        public int UserID { get; set; }
        public Nullable<int> TaskID { get; set; }
        public string CallerName { get; set; }
        public int PriorityID { get; set; }
        public int StatusID { get; set; }
        public int RecordStatusID { get; set; }
        public bool IsInc { get; set; }
        public string Name { get; set; }
        public string Solution { get; set; }

        //public AppUser AspNetUsers { get; set; }
        public supPriority supPriority { get; set; }
        public supStatus supStatus { get; set; }
        public supTask supTask { get; set; }
        public supUser CreateUser { get; set; }
        public supUser ResponsibleUser { get; set; }
        public supObject supObject { get; set; }
    }
}

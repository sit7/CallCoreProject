using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CallApp.Models
{
    //Чтобы работала ветка через ХП NotMapped д.б. закоментировано
    //Если нужно пересоздавать базу через миграции - надо раскомментировать

    //[NotMapped]
    public class getCallsResult
    {
        [Key]
        public int CallID { get; set; }
        public string ShortName { get; set; }
        public string Description { get; set; }
        public string PhoneNumber { get; set; }
        public Nullable<System.DateTime> CallDate { get; set; }
        public string CallerName { get; set; }
        public string Name { get; set; }
        public string Solution { get; set; }
    }
}

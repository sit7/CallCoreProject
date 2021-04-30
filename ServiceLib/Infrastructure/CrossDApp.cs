using Microsoft.EntityFrameworkCore;
using ServiceLib.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ServiceLib.Infrastructure
{
    public static class CrossDApp
    {
        static CrossDApp()
        {
            Applications = new Dictionary<string, CrossDMeta>
            {
                {
                    "Material",
                    new CrossDMeta
                    {
                        Icon = "glyphicon-paperclip",
                        Controller ="Home",
                        Action ="MaterialIndex",
                        ApplicationID = 2,
                        Name = "Учет ТМЦ",
                        Code = "Material"
                    }
                },
                {
                    "Food",
                    new CrossDMeta
                    {
                        Icon = "glyphicon-cutlery",
                        Controller ="Home",
                        Action ="FoodIndex",
                        ApplicationID = 1,
                        Name = "Прод. учет",
                        Code = "Food"
                    }
                },
                {
                    "Repair",
                    new CrossDMeta
                    {
                        Icon = "glyphicon-wrench",
                        Controller ="Home",
                        Action ="RepairIndex",
                        ApplicationID = 3,
                        Name = "План ремонтов",
                        Code = "Repair"
                    }
                },
                {
                    "Tabel",
                    new CrossDMeta
                    {
                        Icon = "glyphicon-education",
                        Controller ="Home",
                        Action ="TabelIndex",
                        ApplicationID = 4,
                        Name = "Учет численности",
                        Code = "Tabel"
                    }
                },
                {
                    "NoApp",
                    new CrossDMeta
                    {
                        ApplicationID = 5,
                        Name = string.Empty,
                        Code = "NoApp"
                    }
                },
                {
                    "Report",
                    new CrossDMeta
                    {
                        ApplicationID = 6,
                        Name= "Отчеты",
                        Code="Report",
                        Controller="Report",
                        Action="Index"
                    }
                }
            };

            LastVersionCode = new FileInfo(Assembly.GetExecutingAssembly().Location).LastWriteTime.ToString("yyyyMMdd-HH-mm-ss");
        }

        public static string LastVersionCode { get; private set; }


        public static Dictionary<string, CrossDMeta> Applications { get; }

        public static void SetApplication(string applicationName, ApplicationDbContext context)
        {
            CrossDMeta apllication = null;
            var user = CrossDUser.Current;
            if (Applications.TryGetValue(applicationName, out apllication) && user.Principal.Identity.IsAuthenticated)
            {

                var dbUser = context.Users.First(u => u.Id == user.UserID);
                dbUser.ApplicationID = apllication.ApplicationID;
                context.Entry(dbUser).State = EntityState.Modified;
                try
                {
                    context.SaveChanges();
                }
                catch (Exception e)
                {

                }

            }
        }
    }
}
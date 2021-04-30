﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CallApp.Models;
using ServiceLib.Infrastructure;

namespace CallApp.Controllers
{
    public class HomeController : Controller
    {
        private CrossDUser CrossDUser { get; }

        public HomeController(CrossDUser user)
        {
            CrossDUser = user;
        }

        public IActionResult Index()
        {

            return View();
        }

        public IActionResult About()
        {
            var _cp = HttpContext.User;//User
            ViewData["Message"] = _cp.Claims.Where(c => c.Type == "LastName").Select(c => c.Value).SingleOrDefault(); ;

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult Error()
        //{
        //    return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        //}
    }
}

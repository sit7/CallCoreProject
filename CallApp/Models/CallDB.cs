//db in db
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace CallApp.Models
{
    public class CallDB : DbContext
    {
        public DbSet<supCall> supCall { get; set; }
        public DbSet<supObject> supObject { get; set; }
        public DbSet<supPriority> supPriority { get; set; }
        public DbSet<supStatus> supStatus { get; set; }
        public DbSet<supTask> supTask { get; set; }
        public DbSet<supUser> supUser { get; set; }
        public DbSet<getCallsResult> getCallsResult { get; set; }

        public CallDB(DbContextOptions<CallDB> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<supCall>().HasOne(u => u.CreateUser)
                .WithMany(c => c.CreateUserCalls).HasForeignKey(u => u.CreateUserID);
            modelBuilder.Entity<supCall>().HasOne(u => u.ResponsibleUser)
                .WithMany(c => c.ResponsibleUserCalls).HasForeignKey(u => u.ResponsibleUserID);
            modelBuilder.Entity<supCall>().HasOne(u => u.supObject)
                .WithMany(c => c.supCall).HasForeignKey(u => u.ObjectID);
            modelBuilder.Entity<supCall>().HasOne(u => u.supPriority)
                .WithMany(c => c.supCall).HasForeignKey(u => u.PriorityID);
            modelBuilder.Entity<supCall>().HasOne(u => u.supStatus)
                .WithMany(c => c.supCall).HasForeignKey(u => u.StatusID);
            modelBuilder.Entity<supCall>().HasOne(u => u.supTask)
                .WithMany(c => c.supCall).HasForeignKey(u => u.TaskID);
            //modelBuilder.Entity<supCall>().HasOne(u => u.AspNetUsers)
            //    .WithMany(c => c.supCall).HasForeignKey(u => u.UserID);

           modelBuilder.Entity<supStatus>().HasData(
           new supStatus[]
           {
                new supStatus { StatusID=1, Name="Не готово"},
                new supStatus { StatusID=2, Name="Готово"}
           });
            modelBuilder.Entity<supTask>().HasData(
            new supTask[]
           {
                new supTask { TaskID=1, Name="ТМЦ"},
                new supTask { TaskID=2, Name="Продучет"}
           });
            modelBuilder.Entity<supUser>().HasData(
            new supUser[]
           {
                new supUser { UserID=1, ShortName="Катя"},
                new supUser { UserID=2, ShortName="Настя"}
           });
            modelBuilder.Entity<supObject>().HasData(
            new supObject[]
           {
                new supObject { ObjectID=1, Name="УХЭО"},
                new supObject { ObjectID=2, Name="МБДОУ 154"}
           });
            modelBuilder.Entity<supPriority>().HasData(
            new supPriority[]
           {
                new supPriority { PriorityID=1, Name="Не срочно"},
                new supPriority { PriorityID=2, Name="Срочно"}
           });
        }

        public virtual IQueryable<getCallsResult> GetCalls(Nullable<System.DateTime> beginDate, Nullable<System.DateTime> endDate)
        {
            /***************************************************postgreSql вариант*****************************************/
#if PostgreSQL
            var _beginDate = new Npgsql.NpgsqlParameter("@BeginDate", beginDate);
            var _endDate = new Npgsql.NpgsqlParameter("@EndDate", endDate);
            var res =  getCallsResult.FromSqlRaw("SELECT * FROM getcalls (@BeginDate, @EndDate)", _beginDate, _endDate);
#else
            /***************************************************MSSql вариант*****************************************/

            var beginDateParameter = new SqlParameter("@BeginDate", beginDate);
            var endDateParameter = new SqlParameter("@EndDate", endDate);
            var res = getCallsResult.FromSqlRaw("dbo.getCalls  @BeginDate, @EndDate", beginDateParameter, endDateParameter); //осталось разобраться с преобразованием данных
#endif
            return res; //
        }
    }
}

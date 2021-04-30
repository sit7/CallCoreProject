using ServiceLib.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Linq;
using Npgsql;

namespace ServiceLib.Models
{
    public class ApplicationDbContext : IdentityDbContext<AppUser, AppRole, int>
    {
        public DbSet<glbObjectStatus> glbObjectStatus { get; set; }
        public DbSet<glbObjectGroup> glbObjectGroup { get; set; }
        public DbSet<glbObjectType> glbObjectType { get; set; }
        public DbSet<glbObject> glbObject { get; set; }
        public DbSet<glbUserObject> glbUserObject { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        //[System.Obsolete]
        public int ChangeObjectForUser(int _objectID, int _userID)
        {
            /***************************************************postgreSql вариант*****************************************/
#if PostgreSQL
            var userID = new Npgsql.NpgsqlParameter("@UserID", _userID);
            var objectID = new Npgsql.NpgsqlParameter("@ObjectID", _objectID);
            return Database.ExecuteSqlCommand("SELECT * FROM ChangeObjectForUser (@UserID, @ObjectID)", userID, objectID);
#else

            /***************************************************MSSql вариант*****************************************/
            var userID = new SqlParameter("@UserID", _userID);
            var objectID = new SqlParameter("@ObjectID", _objectID);
            return Database.ExecuteSqlCommand("dbo.ChangeObjectForUser @UserID, @ObjectID", userID, objectID);
#endif

            //var res = Users.FromSqlRaw("EXEC dbo.ChangeObjectForUserTrue @UserID, @ObjectID", _param).ToList().FirstOrDefault();

            //SqlParameter[] _param = { new SqlParameter("@UserID", _userID), new SqlParameter("@ObjectID", _objectID) };
            //var res = Users.FromSqlRaw("EXEC dbo.ChangeObjectForUser @UserID, @ObjectID", _param).ToList().FirstOrDefault();

            //Users.
            //return 1;// res.ObjectName;

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<glbObject>().HasOne(u => u.glbObjectStatus)
                .WithMany(c => c.glbObject).HasForeignKey(u => u.ObjectStatusID);
            modelBuilder.Entity<glbObject>().HasOne(u => u.glbObjectType)
                .WithMany(c => c.glbObject).HasForeignKey(u => u.ObjectTypeID);
            modelBuilder.Entity<glbObjectType>().HasOne(u => u.glbObjectGroup)
                .WithMany(c => c.glbObjectType).HasForeignKey(u => u.ObjectGroupID);
            modelBuilder.Entity<glbUserObject>().HasOne(u => u.glbObject)
                .WithMany(c => c.glbUserObject).HasForeignKey(u => u.ObjectID);
            modelBuilder.Entity<AppUser>().HasOne(u => u.glbObject)
                .WithMany(c => c.AppUser).HasForeignKey(u => u.ObjectID);
            modelBuilder.Entity<glbUserObject>().HasOne(u => u.AppUser)
                .WithMany(c => c.glbUserObject).HasForeignKey(u => u.UserID).OnDelete(DeleteBehavior.NoAction);
            
            modelBuilder.Entity<glbObjectStatus>().HasData(
            new glbObjectStatus[]
            {
                new glbObjectStatus { ObjectStatusID=1, Name="Новый объект"},
                new glbObjectStatus { ObjectStatusID=2, Name="Редактировался"},
                new glbObjectStatus { ObjectStatusID=3, Name="Проверен"},
            });
            modelBuilder.Entity<glbObjectGroup>().HasData(
            new glbObjectGroup[]
            {
                new glbObjectGroup { ObjectGroupID=1, Name="Образовательное учреждение"},
                new glbObjectGroup { ObjectGroupID=2, Name="Учреждение дополнительного образования"},
                new glbObjectGroup { ObjectGroupID=3, Name="Учреждение дошкольного образования"},
                new glbObjectGroup { ObjectGroupID=4, Name="Административное учреждение"},
                new glbObjectGroup { ObjectGroupID=5, Name="Центр психолого-педагогической, медицинской и социальной помощи"}
            });
            modelBuilder.Entity<glbObjectType>().HasData(
               new glbObjectType[]
               {
                    new glbObjectType { ObjectTypeID=1, ObjectGroupID=1, Name="МБОУ СОШ"},
                    new glbObjectType { ObjectTypeID=2, ObjectGroupID=1, Name="МБОУ ООШ"},
                    new glbObjectType { ObjectTypeID=3, ObjectGroupID=3, Name="МБДОУ"},
                    new glbObjectType { ObjectTypeID=4, ObjectGroupID=3, Name="МАДОУ"},
                    new glbObjectType { ObjectTypeID=5, ObjectGroupID=1, Name="Гимназия"},
                    new glbObjectType { ObjectTypeID=6, ObjectGroupID=2, Name="Детский центр"},
                    new glbObjectType { ObjectTypeID=7, ObjectGroupID=2, Name="Дом творчества"},
                    new glbObjectType { ObjectTypeID=8, ObjectGroupID=2, Name="ДЮСАШ"},
                    new glbObjectType { ObjectTypeID=9, ObjectGroupID=2, Name="ДЮСШ"},
                    new glbObjectType { ObjectTypeID=10, ObjectGroupID=1, Name="Лицей"},
                    new glbObjectType { ObjectTypeID=11, ObjectGroupID=3, Name="МБДОУ ЦРР"},
                    new glbObjectType { ObjectTypeID=12, ObjectGroupID=1, Name="Прогимназия"},
                    new glbObjectType { ObjectTypeID=13, ObjectGroupID=4, Name="ГИМЦ РО"},
                    new glbObjectType { ObjectTypeID=14, ObjectGroupID=2, Name="Учреждения доп образования"},
                    new glbObjectType { ObjectTypeID=15, ObjectGroupID=5, Name="ППМС"}
               });
            modelBuilder.Entity<glbObject>().HasData(
               new glbObject[]
               {
                    new glbObject { ObjectID=1, Name="Неопределенный объект", ShortName="НО", ObjectTypeID=1, IsFew=0, MainObjectID=0},
                    new glbObject { ObjectID=4, Name ="Тестовый объект", ShortName="НО", ObjectTypeID=1, IsFew=0, MainObjectID=4},
                    new glbObject { ObjectID=7, Name="МБОУ г.Мурманска «Основная общеобразовательная школа №58»", ShortName="ООШ 58", ObjectTypeID=1, IsFew=0, MainObjectID=7 },
               });
            modelBuilder.Entity<AppUser>().HasData(
                new AppUser[]
                {
                    new AppUser { Id=1, UserName = "petrovaa@cross-d.ru", NormalizedUserName="PETROVAA@CROSS-D.RU", Email="petrovaa@cross-d.ru", NormalizedEmail="PETROVAA@CROSS-D.RU",
                        EmailConfirmed= false, PasswordHash="AQAAAAEAACcQAAAAEN3M33bODSQ1OKa/iWI0lVbUh/IT56/5ilDfcWGf7nKhRtLn1o9BmwO+LLD2FYvhpA==", SecurityStamp="QGA3ESU4RNWK3NM4ETTNL2EG7QFPC7B6",
                        ConcurrencyStamp="d3a70789-a555-4bcd-96dd-0327a787aead", PhoneNumberConfirmed=false, TwoFactorEnabled=false, LockoutEnabled=true, AccessFailedCount=0, ObjectID=7},
                        });
            modelBuilder.Entity<glbUserObject>().HasData(
               new glbUserObject[]
               {
                    new glbUserObject { UserObjectID=1, UserID=1, ObjectID=7 },
               });

        }
    }
}

﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ServiceLib.Models;

namespace ServiceLib.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<int>", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("ServiceLib.Models.AppRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("ServiceLib.Models.AppUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<int>("ApplicationID")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<int>("ObjectGroupID")
                        .HasColumnType("integer");

                    b.Property<int>("ObjectID")
                        .HasColumnType("integer");

                    b.Property<string>("ObjectName")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("ReportServerURL")
                        .HasColumnType("text");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<string>("Surname")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.HasIndex("ObjectID");

                    b.ToTable("AspNetUsers");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            AccessFailedCount = 0,
                            ApplicationID = 0,
                            ConcurrencyStamp = "d3a70789-a555-4bcd-96dd-0327a787aead",
                            Email = "petrovaa@cross-d.ru",
                            EmailConfirmed = false,
                            LockoutEnabled = true,
                            NormalizedEmail = "PETROVAA@CROSS-D.RU",
                            NormalizedUserName = "PETROVAA@CROSS-D.RU",
                            ObjectGroupID = 0,
                            ObjectID = 7,
                            PasswordHash = "AQAAAAEAACcQAAAAEN3M33bODSQ1OKa/iWI0lVbUh/IT56/5ilDfcWGf7nKhRtLn1o9BmwO+LLD2FYvhpA==",
                            PhoneNumberConfirmed = false,
                            SecurityStamp = "QGA3ESU4RNWK3NM4ETTNL2EG7QFPC7B6",
                            TwoFactorEnabled = false,
                            UserName = "petrovaa@cross-d.ru"
                        });
                });

            modelBuilder.Entity("ServiceLib.Models.glbObject", b =>
                {
                    b.Property<int>("ObjectID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("BIC")
                        .HasColumnType("text");

                    b.Property<string>("BankName")
                        .HasColumnType("text");

                    b.Property<string>("City")
                        .HasColumnType("text");

                    b.Property<int?>("Code")
                        .HasColumnType("integer");

                    b.Property<string>("CurrentAccount")
                        .HasColumnType("text");

                    b.Property<string>("EMail")
                        .HasColumnType("text");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("FaxNumber")
                        .HasColumnType("text");

                    b.Property<string>("HeadEMail")
                        .HasColumnType("text");

                    b.Property<string>("HeadFIO")
                        .HasColumnType("text");

                    b.Property<string>("HeadPhoneNumber")
                        .HasColumnType("text");

                    b.Property<string>("HeadPosition")
                        .HasColumnType("text");

                    b.Property<string>("HeadSignature")
                        .HasColumnType("text");

                    b.Property<string>("HouseBlock")
                        .HasColumnType("text");

                    b.Property<string>("HouseNumber")
                        .HasColumnType("text");

                    b.Property<string>("INN")
                        .HasColumnType("text");

                    b.Property<int?>("Is24Group")
                        .HasColumnType("integer");

                    b.Property<bool?>("IsBudget")
                        .HasColumnType("boolean");

                    b.Property<int?>("IsDepartment")
                        .HasColumnType("integer");

                    b.Property<int>("IsFew")
                        .HasColumnType("integer");

                    b.Property<int?>("IsIO")
                        .HasColumnType("integer");

                    b.Property<string>("KPP")
                        .HasColumnType("text");

                    b.Property<int?>("MainObjectID")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("OKPO")
                        .HasColumnType("text");

                    b.Property<string>("OKVED")
                        .HasColumnType("text");

                    b.Property<int?>("ObjectStatusID")
                        .HasColumnType("integer");

                    b.Property<int>("ObjectTypeID")
                        .HasColumnType("integer");

                    b.Property<int?>("OrderNumber")
                        .HasColumnType("integer");

                    b.Property<string>("PersonalAccount")
                        .HasColumnType("text");

                    b.Property<string>("PersonalAccount2")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<string>("PostIndex")
                        .HasColumnType("text");

                    b.Property<string>("Region")
                        .HasColumnType("text");

                    b.Property<string>("ShortName")
                        .HasColumnType("text");

                    b.Property<string>("Street")
                        .HasColumnType("text");

                    b.Property<string>("UltraShortName")
                        .HasColumnType("text");

                    b.Property<string>("WWW")
                        .HasColumnType("text");

                    b.Property<string>("СorrAccount")
                        .HasColumnType("text");

                    b.Property<string>("СorrBank")
                        .HasColumnType("text");

                    b.HasKey("ObjectID");

                    b.HasIndex("ObjectStatusID");

                    b.HasIndex("ObjectTypeID");

                    b.ToTable("glbObject");

                    b.HasData(
                        new
                        {
                            ObjectID = 1,
                            IsFew = 0,
                            Name = "Неопределенный объект",
                            ObjectTypeID = 1,
                            ShortName = "НО"
                        },
                        new
                        {
                            ObjectID = 4,
                            IsFew = 0,
                            Name = "Тестовый объект",
                            ObjectTypeID = 1,
                            ShortName = "НО"
                        },
                        new
                        {
                            ObjectID = 7,
                            IsFew = 0,
                            Name = "МБОУ г.Мурманска «Основная общеобразовательная школа №58»",
                            ObjectTypeID = 1,
                            ShortName = "ООШ 58"
                        });
                });

            modelBuilder.Entity("ServiceLib.Models.glbObjectGroup", b =>
                {
                    b.Property<int>("ObjectGroupID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("ObjectGroupID");

                    b.ToTable("glbObjectGroup");

                    b.HasData(
                        new
                        {
                            ObjectGroupID = 1,
                            Name = "Образовательное учреждение"
                        },
                        new
                        {
                            ObjectGroupID = 2,
                            Name = "Учреждение дополнительного образования"
                        },
                        new
                        {
                            ObjectGroupID = 3,
                            Name = "Учреждение дошкольного образования"
                        },
                        new
                        {
                            ObjectGroupID = 4,
                            Name = "Административное учреждение"
                        },
                        new
                        {
                            ObjectGroupID = 5,
                            Name = "Центр психолого-педагогической, медицинской и социальной помощи"
                        });
                });

            modelBuilder.Entity("ServiceLib.Models.glbObjectStatus", b =>
                {
                    b.Property<int>("ObjectStatusID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("ObjectStatusID");

                    b.ToTable("glbObjectStatus");

                    b.HasData(
                        new
                        {
                            ObjectStatusID = 1,
                            Name = "Новый объект"
                        },
                        new
                        {
                            ObjectStatusID = 2,
                            Name = "Редактировался"
                        },
                        new
                        {
                            ObjectStatusID = 3,
                            Name = "Проверен"
                        });
                });

            modelBuilder.Entity("ServiceLib.Models.glbObjectType", b =>
                {
                    b.Property<int>("ObjectTypeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<int?>("ObjectGroupID")
                        .HasColumnType("integer");

                    b.HasKey("ObjectTypeID");

                    b.HasIndex("ObjectGroupID");

                    b.ToTable("glbObjectType");

                    b.HasData(
                        new
                        {
                            ObjectTypeID = 1,
                            Name = "МБОУ СОШ",
                            ObjectGroupID = 1
                        },
                        new
                        {
                            ObjectTypeID = 2,
                            Name = "МБОУ ООШ",
                            ObjectGroupID = 1
                        },
                        new
                        {
                            ObjectTypeID = 3,
                            Name = "МБДОУ",
                            ObjectGroupID = 3
                        },
                        new
                        {
                            ObjectTypeID = 4,
                            Name = "МАДОУ",
                            ObjectGroupID = 3
                        },
                        new
                        {
                            ObjectTypeID = 5,
                            Name = "Гимназия",
                            ObjectGroupID = 1
                        },
                        new
                        {
                            ObjectTypeID = 6,
                            Name = "Детский центр",
                            ObjectGroupID = 2
                        },
                        new
                        {
                            ObjectTypeID = 7,
                            Name = "Дом творчества",
                            ObjectGroupID = 2
                        },
                        new
                        {
                            ObjectTypeID = 8,
                            Name = "ДЮСАШ",
                            ObjectGroupID = 2
                        },
                        new
                        {
                            ObjectTypeID = 9,
                            Name = "ДЮСШ",
                            ObjectGroupID = 2
                        },
                        new
                        {
                            ObjectTypeID = 10,
                            Name = "Лицей",
                            ObjectGroupID = 1
                        },
                        new
                        {
                            ObjectTypeID = 11,
                            Name = "МБДОУ ЦРР",
                            ObjectGroupID = 3
                        },
                        new
                        {
                            ObjectTypeID = 12,
                            Name = "Прогимназия",
                            ObjectGroupID = 1
                        },
                        new
                        {
                            ObjectTypeID = 13,
                            Name = "ГИМЦ РО",
                            ObjectGroupID = 4
                        },
                        new
                        {
                            ObjectTypeID = 14,
                            Name = "Учреждения доп образования",
                            ObjectGroupID = 2
                        },
                        new
                        {
                            ObjectTypeID = 15,
                            Name = "ППМС",
                            ObjectGroupID = 5
                        });
                });

            modelBuilder.Entity("ServiceLib.Models.glbUserObject", b =>
                {
                    b.Property<int>("UserObjectID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("ObjectID")
                        .HasColumnType("integer");

                    b.Property<int>("UserID")
                        .HasColumnType("integer");

                    b.HasKey("UserObjectID");

                    b.HasIndex("ObjectID");

                    b.HasIndex("UserID");

                    b.ToTable("glbUserObject");

                    b.HasData(
                        new
                        {
                            UserObjectID = 1,
                            ObjectID = 7,
                            UserID = 1
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.HasOne("ServiceLib.Models.AppRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.HasOne("ServiceLib.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.HasOne("ServiceLib.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<int>", b =>
                {
                    b.HasOne("ServiceLib.Models.AppRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ServiceLib.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.HasOne("ServiceLib.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ServiceLib.Models.AppUser", b =>
                {
                    b.HasOne("ServiceLib.Models.glbObject", "glbObject")
                        .WithMany("AppUser")
                        .HasForeignKey("ObjectID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ServiceLib.Models.glbObject", b =>
                {
                    b.HasOne("ServiceLib.Models.glbObjectStatus", "glbObjectStatus")
                        .WithMany("glbObject")
                        .HasForeignKey("ObjectStatusID");

                    b.HasOne("ServiceLib.Models.glbObjectType", "glbObjectType")
                        .WithMany("glbObject")
                        .HasForeignKey("ObjectTypeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ServiceLib.Models.glbObjectType", b =>
                {
                    b.HasOne("ServiceLib.Models.glbObjectGroup", "glbObjectGroup")
                        .WithMany("glbObjectType")
                        .HasForeignKey("ObjectGroupID");
                });

            modelBuilder.Entity("ServiceLib.Models.glbUserObject", b =>
                {
                    b.HasOne("ServiceLib.Models.glbObject", "glbObject")
                        .WithMany("glbUserObject")
                        .HasForeignKey("ObjectID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ServiceLib.Models.AppUser", "AppUser")
                        .WithMany("glbUserObject")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
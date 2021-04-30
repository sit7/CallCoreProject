using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace ServiceLib.Migrations
{
    public partial class InitCallDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "glbObjectGroup",
                columns: table => new
                {
                    ObjectGroupID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_glbObjectGroup", x => x.ObjectGroupID);
                });

            migrationBuilder.CreateTable(
                name: "glbObjectStatus",
                columns: table => new
                {
                    ObjectStatusID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_glbObjectStatus", x => x.ObjectStatusID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "glbObjectType",
                columns: table => new
                {
                    ObjectTypeID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ObjectGroupID = table.Column<int>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_glbObjectType", x => x.ObjectTypeID);
                    table.ForeignKey(
                        name: "FK_glbObjectType_glbObjectGroup_ObjectGroupID",
                        column: x => x.ObjectGroupID,
                        principalTable: "glbObjectGroup",
                        principalColumn: "ObjectGroupID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "glbObject",
                columns: table => new
                {
                    ObjectID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true),
                    Code = table.Column<int>(nullable: true),
                    ShortName = table.Column<string>(nullable: true),
                    UltraShortName = table.Column<string>(nullable: true),
                    ObjectTypeID = table.Column<int>(nullable: false),
                    PostIndex = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    Street = table.Column<string>(nullable: true),
                    Region = table.Column<string>(nullable: true),
                    HouseNumber = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    FaxNumber = table.Column<string>(nullable: true),
                    EMail = table.Column<string>(nullable: true),
                    WWW = table.Column<string>(nullable: true),
                    INN = table.Column<string>(nullable: true),
                    KPP = table.Column<string>(nullable: true),
                    OKPO = table.Column<string>(nullable: true),
                    OKVED = table.Column<string>(nullable: true),
                    BankName = table.Column<string>(nullable: true),
                    BIC = table.Column<string>(nullable: true),
                    CurrentAccount = table.Column<string>(nullable: true),
                    PersonalAccount = table.Column<string>(nullable: true),
                    HeadPosition = table.Column<string>(nullable: true),
                    HeadFIO = table.Column<string>(nullable: true),
                    HeadPhoneNumber = table.Column<string>(nullable: true),
                    HeadEMail = table.Column<string>(nullable: true),
                    HeadSignature = table.Column<string>(nullable: true),
                    OrderNumber = table.Column<int>(nullable: true),
                    EndDate = table.Column<DateTime>(nullable: true),
                    IsDepartment = table.Column<int>(nullable: true),
                    MainObjectID = table.Column<int>(nullable: true),
                    ObjectStatusID = table.Column<int>(nullable: true),
                    IsFew = table.Column<int>(nullable: false),
                    HouseBlock = table.Column<string>(nullable: true),
                    СorrAccount = table.Column<string>(nullable: true),
                    СorrBank = table.Column<string>(nullable: true),
                    PersonalAccount2 = table.Column<string>(nullable: true),
                    Is24Group = table.Column<int>(nullable: true),
                    IsIO = table.Column<int>(nullable: true),
                    IsBudget = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_glbObject", x => x.ObjectID);
                    table.ForeignKey(
                        name: "FK_glbObject_glbObjectStatus_ObjectStatusID",
                        column: x => x.ObjectStatusID,
                        principalTable: "glbObjectStatus",
                        principalColumn: "ObjectStatusID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_glbObject_glbObjectType_ObjectTypeID",
                        column: x => x.ObjectTypeID,
                        principalTable: "glbObjectType",
                        principalColumn: "ObjectTypeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Surname = table.Column<string>(nullable: true),
                    ObjectID = table.Column<int>(nullable: false),
                    ObjectName = table.Column<string>(nullable: true),
                    ReportServerURL = table.Column<string>(nullable: true),
                    ObjectGroupID = table.Column<int>(nullable: false),
                    ApplicationID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_glbObject_ObjectID",
                        column: x => x.ObjectID,
                        principalTable: "glbObject",
                        principalColumn: "ObjectID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "glbUserObject",
                columns: table => new
                {
                    UserObjectID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserID = table.Column<int>(nullable: false),
                    ObjectID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_glbUserObject", x => x.UserObjectID);
                    table.ForeignKey(
                        name: "FK_glbUserObject_glbObject_ObjectID",
                        column: x => x.ObjectID,
                        principalTable: "glbObject",
                        principalColumn: "ObjectID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_glbUserObject_AspNetUsers_UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "glbObjectGroup",
                columns: new[] { "ObjectGroupID", "Name" },
                values: new object[,]
                {
                    { 1, "Образовательное учреждение" },
                    { 2, "Учреждение дополнительного образования" },
                    { 3, "Учреждение дошкольного образования" },
                    { 4, "Административное учреждение" },
                    { 5, "Центр психолого-педагогической, медицинской и социальной помощи" }
                });

            migrationBuilder.InsertData(
                table: "glbObjectStatus",
                columns: new[] { "ObjectStatusID", "Name" },
                values: new object[,]
                {
                    { 1, "Новый объект" },
                    { 2, "Редактировался" },
                    { 3, "Проверен" }
                });

            migrationBuilder.InsertData(
                table: "glbObjectType",
                columns: new[] { "ObjectTypeID", "Name", "ObjectGroupID" },
                values: new object[,]
                {
                    { 1, "МБОУ СОШ", 1 },
                    { 2, "МБОУ ООШ", 1 },
                    { 5, "Гимназия", 1 },
                    { 10, "Лицей", 1 },
                    { 12, "Прогимназия", 1 },
                    { 6, "Детский центр", 2 },
                    { 7, "Дом творчества", 2 },
                    { 8, "ДЮСАШ", 2 },
                    { 9, "ДЮСШ", 2 },
                    { 14, "Учреждения доп образования", 2 },
                    { 3, "МБДОУ", 3 },
                    { 4, "МАДОУ", 3 },
                    { 11, "МБДОУ ЦРР", 3 },
                    { 13, "ГИМЦ РО", 4 },
                    { 15, "ППМС", 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ObjectID",
                table: "AspNetUsers",
                column: "ObjectID");

            migrationBuilder.CreateIndex(
                name: "IX_glbObject_ObjectStatusID",
                table: "glbObject",
                column: "ObjectStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_glbObject_ObjectTypeID",
                table: "glbObject",
                column: "ObjectTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_glbObjectType_ObjectGroupID",
                table: "glbObjectType",
                column: "ObjectGroupID");

            migrationBuilder.CreateIndex(
                name: "IX_glbUserObject_ObjectID",
                table: "glbUserObject",
                column: "ObjectID");

            migrationBuilder.CreateIndex(
                name: "IX_glbUserObject_UserID",
                table: "glbUserObject",
                column: "UserID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "glbUserObject");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "glbObject");

            migrationBuilder.DropTable(
                name: "glbObjectStatus");

            migrationBuilder.DropTable(
                name: "glbObjectType");

            migrationBuilder.DropTable(
                name: "glbObjectGroup");
        }
    }
}

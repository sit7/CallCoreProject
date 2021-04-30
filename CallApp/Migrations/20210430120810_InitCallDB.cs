using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace CallApp.Migrations
{
    public partial class InitCallDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "supObject",
                columns: table => new
                {
                    ObjectID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supObject", x => x.ObjectID);
                });

            migrationBuilder.CreateTable(
                name: "supPriority",
                columns: table => new
                {
                    PriorityID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supPriority", x => x.PriorityID);
                });

            migrationBuilder.CreateTable(
                name: "supStatus",
                columns: table => new
                {
                    StatusID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supStatus", x => x.StatusID);
                });

            migrationBuilder.CreateTable(
                name: "supTask",
                columns: table => new
                {
                    TaskID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supTask", x => x.TaskID);
                });

            migrationBuilder.CreateTable(
                name: "supUser",
                columns: table => new
                {
                    UserID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ShortName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supUser", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "supCall",
                columns: table => new
                {
                    CallID = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ObjectID = table.Column<int>(nullable: true),
                    ShortName = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    CreateUserID = table.Column<int>(nullable: true),
                    ResponsibleUserID = table.Column<int>(nullable: true),
                    CallDate = table.Column<DateTime>(nullable: true),
                    RecordDate = table.Column<DateTime>(nullable: false),
                    UserID = table.Column<int>(nullable: false),
                    TaskID = table.Column<int>(nullable: true),
                    CallerName = table.Column<string>(nullable: true),
                    PriorityID = table.Column<int>(nullable: false),
                    StatusID = table.Column<int>(nullable: false),
                    RecordStatusID = table.Column<int>(nullable: false),
                    IsInc = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Solution = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supCall", x => x.CallID);
                    table.ForeignKey(
                        name: "FK_supCall_supUser_CreateUserID",
                        column: x => x.CreateUserID,
                        principalTable: "supUser",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_supCall_supObject_ObjectID",
                        column: x => x.ObjectID,
                        principalTable: "supObject",
                        principalColumn: "ObjectID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_supCall_supPriority_PriorityID",
                        column: x => x.PriorityID,
                        principalTable: "supPriority",
                        principalColumn: "PriorityID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_supCall_supUser_ResponsibleUserID",
                        column: x => x.ResponsibleUserID,
                        principalTable: "supUser",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_supCall_supStatus_StatusID",
                        column: x => x.StatusID,
                        principalTable: "supStatus",
                        principalColumn: "StatusID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_supCall_supTask_TaskID",
                        column: x => x.TaskID,
                        principalTable: "supTask",
                        principalColumn: "TaskID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "supObject",
                columns: new[] { "ObjectID", "Name" },
                values: new object[,]
                {
                    { 1, "УХЭО" },
                    { 2, "МБДОУ 154" }
                });

            migrationBuilder.InsertData(
                table: "supPriority",
                columns: new[] { "PriorityID", "Name" },
                values: new object[,]
                {
                    { 1, "Не срочно" },
                    { 2, "Срочно" }
                });

            migrationBuilder.InsertData(
                table: "supStatus",
                columns: new[] { "StatusID", "Name" },
                values: new object[,]
                {
                    { 1, "Не готово" },
                    { 2, "Готово" }
                });

            migrationBuilder.InsertData(
                table: "supTask",
                columns: new[] { "TaskID", "Name" },
                values: new object[,]
                {
                    { 1, "ТМЦ" },
                    { 2, "Продучет" }
                });

            migrationBuilder.InsertData(
                table: "supUser",
                columns: new[] { "UserID", "ShortName" },
                values: new object[,]
                {
                    { 1, "Катя" },
                    { 2, "Настя" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_supCall_CreateUserID",
                table: "supCall",
                column: "CreateUserID");

            migrationBuilder.CreateIndex(
                name: "IX_supCall_ObjectID",
                table: "supCall",
                column: "ObjectID");

            migrationBuilder.CreateIndex(
                name: "IX_supCall_PriorityID",
                table: "supCall",
                column: "PriorityID");

            migrationBuilder.CreateIndex(
                name: "IX_supCall_ResponsibleUserID",
                table: "supCall",
                column: "ResponsibleUserID");

            migrationBuilder.CreateIndex(
                name: "IX_supCall_StatusID",
                table: "supCall",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "IX_supCall_TaskID",
                table: "supCall",
                column: "TaskID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "getCallsResult");

            migrationBuilder.DropTable(
                name: "supCall");

            migrationBuilder.DropTable(
                name: "supUser");

            migrationBuilder.DropTable(
                name: "supObject");

            migrationBuilder.DropTable(
                name: "supPriority");

            migrationBuilder.DropTable(
                name: "supStatus");

            migrationBuilder.DropTable(
                name: "supTask");
        }
    }
}

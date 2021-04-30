using Microsoft.EntityFrameworkCore.Migrations;

namespace ServiceLib.Migrations
{
    public partial class MinimumTabelFill : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "glbObject",
                columns: new[] { "ObjectID", "BIC", "BankName", "City", "Code", "CurrentAccount", "EMail", "EndDate", "FaxNumber", "HeadEMail", "HeadFIO", "HeadPhoneNumber", "HeadPosition", "HeadSignature", "HouseBlock", "HouseNumber", "INN", "Is24Group", "IsBudget", "IsDepartment", "IsFew", "IsIO", "KPP", "MainObjectID", "Name", "OKPO", "OKVED", "ObjectStatusID", "ObjectTypeID", "OrderNumber", "PersonalAccount", "PersonalAccount2", "PhoneNumber", "PostIndex", "Region", "ShortName", "Street", "UltraShortName", "WWW", "СorrAccount", "СorrBank" },
                values: new object[,]
                {
                    { 1, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, 1, "Неопределенный объект", null, null, null, 1, null, null, null, null, null, null, "НО", null, null, null, null, null },
                    { 4, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, 4, "Тестовый объект", null, null, null, 1, null, null, null, null, null, null, "НО", null, null, null, null, null },
                    { 7, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, 7, "МБОУ г.Мурманска «Основная общеобразовательная школа №58»", null, null, null, 1, null, null, null, null, null, null, "ООШ 58", null, null, null, null, null }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ApplicationID", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "ObjectGroupID", "ObjectID", "ObjectName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "ReportServerURL", "SecurityStamp", "Surname", "TwoFactorEnabled", "UserName" },
                values: new object[] { 1, 0, 0, "d3a70789-a555-4bcd-96dd-0327a787aead", "petrovaa@cross-d.ru", false, null, null, true, null, "PETROVAA@CROSS-D.RU", "PETROVAA@CROSS-D.RU", 0, 7, null, "AQAAAAEAACcQAAAAEN3M33bODSQ1OKa/iWI0lVbUh/IT56/5ilDfcWGf7nKhRtLn1o9BmwO+LLD2FYvhpA==", null, false, null, "QGA3ESU4RNWK3NM4ETTNL2EG7QFPC7B6", null, false, "petrovaa@cross-d.ru" });

            migrationBuilder.InsertData(
                table: "glbUserObject",
                columns: new[] { "UserObjectID", "ObjectID", "UserID" },
                values: new object[] { 1, 7, 1 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "glbObject",
                keyColumn: "ObjectID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "glbObject",
                keyColumn: "ObjectID",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "glbUserObject",
                keyColumn: "UserObjectID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "glbObject",
                keyColumn: "ObjectID",
                keyValue: 7);
        }
    }
}

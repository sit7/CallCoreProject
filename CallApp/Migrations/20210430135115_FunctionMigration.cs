using Microsoft.EntityFrameworkCore.Migrations;

namespace CallApp.Migrations
{
    public partial class FunctionMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"CREATE OR REPLACE FUNCTION public.getcalls(
	                    _begindate timestamp without time zone,
	                    _enddate timestamp without time zone)
                        RETURNS TABLE(""CallID"" integer, ""ShortName"" text, ""Description"" text, ""PhoneNumber"" text, ""CallDate"" timestamp without time zone, ""CallerName"" text, ""Name"" text, ""Solution"" text) 
                        LANGUAGE 'sql'

                        COST 100
                        VOLATILE 
                        ROWS 1000
    
                        AS $BODY$
                            SELECT ""CallID"", ""ShortName"", ""Description"", ""PhoneNumber"", ""CallDate"", ""CallerName"", ""Name"", 'Yes' AS ""Solution"" from ""supCall"" 
	                        where ""CallDate"" between _begindate AND _enddate;
                        $BODY$;

                    ALTER FUNCTION public.getcalls(timestamp without time zone, timestamp without time zone)
                        OWNER TO postgres;";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}

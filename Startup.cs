using System;
using Funq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.Desktop;
using ServiceStack.OrmLite;

namespace SharpData
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) { }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseServiceStack(new AppHost {
                AppSettings = new NetCoreAppSettings(Configuration),
            });
        }
    }

    public class Hello : IReturn<Hello>
    {
        public string Name { get; set; }
    }

    public class MyServices : Service
    {
        public object Any(Hello request) => request;
    }

    public class AppHost : AppHostBase
    {
        public AppHost()
            : base(nameof(SharpData), typeof(MyServices).Assembly) { }

        public override void Configure(Container container)
        {
            SetConfig(new HostConfig {
                DebugMode = AppSettings.Get(nameof(HostConfig.DebugMode), HostingEnvironment.IsDevelopment()),
            });

            container.Register<IDbConnectionFactory>(c => new OrmLiteConnectionFactory(
                MapProjectPath("~/northwind.sqlite"), SqliteDialect.Provider));

            // Example of registering multiple RDBMS's in code
            var dbFactory = container.Resolve<IDbConnectionFactory>();
            
            dbFactory.RegisterConnection("chinook", 
                MapProjectPath("~/chinook.sqlite"), SqliteDialect.Provider);
            
            // dbFactory.RegisterConnection("techstacks", 
            //     Environment.GetEnvironmentVariable("TECHSTACKS_DB"),
            //     PostgreSqlDialect.Provider);
            // dbFactory.RegisterConnection("reporting", 
            //     Environment.GetEnvironmentVariable("MSSQL_CONNECTION"),
            //     SqlServer2012Dialect.Provider);

            if (Config.DebugMode)
            {
                Plugins.Add(new HotReloadFeature {
                    VirtualFiles = VirtualFiles, //Monitor all folders for changes including /src & /wwwroot
                });
            }

            Plugins.Add(new DesktopFeature {
                AppName = "sharpdata"
            });

            Plugins.Add(new SharpPagesFeature {
                EnableSpaFallback = true,
                ScriptMethods = {new DbScriptsAsync()},
                Args = {
                    //Only display user-defined list of tables:
                    ["tables"] =
                        "Customer,Order,OrderDetail,Category,Product,Employee,EmployeeTerritory,Shipper,Supplier,Region,Territory",
                    // ["tables_techstacks"] = "technology,technology_stack,technology_choice,organization,organization_member,post,post_comment,post_vote,custom_user_auth,user_auth_details,user_activity,page_stats",
                }
            });
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectAPIBuddy.Controllers;
using ConnectAPIBuddy.Models;
using ConnectAPIBuddy.Repositories;
using ConnectAPIBuddy.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;


namespace ConnectAPIBuddy
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            
            services.Configure<Settings>(options =>
            {
                options.ConnectionString
                    = Configuration.GetSection("MongoConnection:ConnectionString").Value;
                options.DatabaseName
                    = Configuration.GetSection("MongoConnection:DatabaseName").Value;
            });

            services.AddTransient<ITestConfigContext, TestConfigContext>();
            services.AddTransient<ITestConfigRepository, TestConfigRepository>();
            services.AddTransient<IUserContext, UserContext>();
            services.AddTransient<IUserRepository, UserRepository>();

            services.AddCors(options =>
               options.AddPolicy("AllowAll", p => p
                   .AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   ));

            services.AddHttpClient();

            services
                .AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
               
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("AllowAll");
            //app.UseCors(builder =>
            //{
            //    builder.WithOrigins("https://localhost:44384",
            //                        "https://localhost:4200");
            //});

            app.UseHttpsRedirection();
            app.UseDeveloperExceptionPage();
            app.UseDatabaseErrorPage();
            app.UseMvc();
            
        }
    }
}

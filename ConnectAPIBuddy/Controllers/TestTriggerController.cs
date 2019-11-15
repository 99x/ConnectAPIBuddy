using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ConnectAPIBuddy.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ConnectAPIBuddy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestTriggerController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public TestTriggerController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<Result> TestRequest(Request req)
        {
            Result result = new Result();
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                req.PayloadHeaders.ToList().ForEach(h =>
                {
                    if (h.Header == "Content-Type")
                    {
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(h.Value));
                    }
                    else
                    {
                        client.DefaultRequestHeaders.Add(h.Header, h.Value);
                    }
                });

                if (req.Method.Equals("GET"))
                {
                    try
                    {
                        var response = client.GetAsync(req.Url).Result;
                        result.Body = response.Content.ReadAsStringAsync().Result;
                        result.Status = response.StatusCode;
                        if (response.IsSuccessStatusCode == false)
                        {
                            result.Body = response.ReasonPhrase;
                        }
                    }
                    catch (Exception)
                    {
                        Console.WriteLine("Request timeout \nCannot Connect to the server \nTry Again!!!", "Connect API Buddy");
                    }
                }
                else if (req.Method.Equals("POST"))
                {
                    if (req.BodyTabSelectedIndex == 0)
                    {
                        var hContent = new StringContent(req.PayloadBody);
                        hContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                        try
                        {
                            var response = client.PostAsync(req.Url, hContent).Result;
                            result.Body = response.Content.ReadAsStringAsync().Result;
                            result.Status = response.StatusCode;
                            if (response.IsSuccessStatusCode == false)
                            {
                                result.Body = response.ReasonPhrase;
                            }
                        }
                        catch (Exception)
                        {
                            Console.WriteLine("Request timeout \nCannot Connect to the server \nTry Again!!!", "Connect API Buddy");
                        }
                    }
                    else if (req.BodyTabSelectedIndex == 1)
                    {
                        var form = new MultipartFormDataContent();
                        //req.FormContent.ToList().ForEach(s =>
                        //{
                        //    form.Add()
                        //});

                        try
                        {
                            var Fileresponse = client.PostAsync(req.Url, form).Result;
                            result.Body = Fileresponse.Content.ReadAsStringAsync().Result;
                            result.Status = Fileresponse.StatusCode;
                            if (Fileresponse.IsSuccessStatusCode == false)
                            {
                                result.Body = Fileresponse.ReasonPhrase;
                            }
                        }
                        catch (Exception)
                        {
                            Console.WriteLine("Request timeout \nCannot Connect to the server \nTry Again!!!", "Connect API Buddy");
                        }

                    }
                }
                else if (req.Method.Equals("UPDATE"))
                {
                    var hContent = new StringContent(req.PayloadBody);
                    hContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    try
                    {
                        var response = client.PutAsync(req.Url, hContent).Result;
                        result.Body = response.Content.ReadAsStringAsync().Result;
                        result.Status = response.StatusCode;
                        if (response.IsSuccessStatusCode == false)
                        {
                            result.Body = response.ReasonPhrase;
                        }
                    }
                    catch (Exception)
                    {
                        Console.WriteLine("Request timeout \nCannot Connect to the server \nTry Again!!!", "Connect API Buddy");
                    }
                }
                else if (req.Method.Equals("DELETE"))
                {
                    try
                    {
                        var response = client.DeleteAsync(req.Url).Result;
                        result.Body = response.Content.ReadAsStringAsync().Result;
                        result.Status = response.StatusCode;
                        if (response.IsSuccessStatusCode == false)
                        {
                            result.Body = response.ReasonPhrase;
                        }
                    }
                    catch (Exception)
                    {
                        Console.WriteLine("Request timeout \nCannot Connect to the server \nTry Again!!!", "Connect API Buddy");
                    }
                }
                else
                {
                    result.Body = "Method Incorrect";
                }
            }


            return result;

        }
    }
}
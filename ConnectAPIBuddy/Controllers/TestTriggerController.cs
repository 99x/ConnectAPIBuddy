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
        private readonly HttpClient _httpClient;

        public TestTriggerController()
        {
            _httpClient = new HttpClient();
        }

        [HttpPost]
        public async Task<DeliveryResponse> TestRequest(DeliveryRequest req)
        {
            DeliveryResponse result = new DeliveryResponse();
            if (req == null)
            {
                return result;
            }
            
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            if (req.TestSettings != null) 
            {
                _httpClient.Timeout = TimeSpan.FromMilliseconds(req.TestSettings.TimeOutMs);
            }
            

            req.PayloadHeaders.ToList().ForEach(h =>
            {
                if (h.Header == "Content-Type")
                {
                    _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(h.Value));
                }
                else
                {
                    _httpClient.DefaultRequestHeaders.Add(h.Header, h.Value);
                }
            });

            if (req.Method.Equals("GET"))
            {
                try
                {
                    var response = await _httpClient.GetAsync(req.Url);

                    result.IsSuccess = response.IsSuccessStatusCode;
                    if (response.IsSuccessStatusCode == false)
                    {
                        result.StatusText = response.ReasonPhrase;
                    }else
                    {
                        result.Content = await response.Content.ReadAsStringAsync();
                    }
                    result.Status = response.StatusCode;
                    result.RequestMessage = response.RequestMessage.ToString();
                }
                catch (Exception ex)
                {
                    result.StatusText = ex.Message;
                    return result;
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
                        var response = await _httpClient.PostAsync(req.Url, hContent);
                        result.IsSuccess = response.IsSuccessStatusCode;
                        if (response.IsSuccessStatusCode == false)
                        {
                            result.StatusText = response.ReasonPhrase;
                        }
                        else
                        {
                            result.Content = await response.Content.ReadAsStringAsync();
                        }
                        result.Status = response.StatusCode;
                        result.RequestMessage = response.RequestMessage.ToString();
                    }
                    catch (Exception ex)
                    {
                        result.StatusText = ex.Message;
                        return result;
                    }

                }
                else if (req.BodyTabSelectedIndex == 1)
                {
                    var form = new MultipartFormDataContent();
                    Dictionary<string, string> parameters = new Dictionary<string, string>();
                    req.FormContent.ToList().ForEach(s =>
                    {
                        parameters.Add(s.Key, s.Value);
                    });
                    HttpContent FormItems = new FormUrlEncodedContent(parameters);
                    form.Add(FormItems);

                    try
                    {
                        var response = await _httpClient.PostAsync(req.Url, form);
                        result.IsSuccess = response.IsSuccessStatusCode;
                        if (response.IsSuccessStatusCode == false)
                        {
                            result.StatusText = response.ReasonPhrase;
                        }
                        else
                        {
                            result.Content = await response.Content.ReadAsStringAsync();
                        }
                        result.Status = response.StatusCode;
                        result.RequestMessage = response.RequestMessage.ToString();
                    }
                    catch (Exception ex)
                    {
                        result.StatusText = ex.Message;
                        return result;
                    }

                }
                }
            else if (req.Method.Equals("UPDATE"))
            {
                var hContent = new StringContent(req.PayloadBody);
                hContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                try
                {
                    var response = await _httpClient.PutAsync(req.Url, hContent);
                    result.IsSuccess = response.IsSuccessStatusCode;
                    if (response.IsSuccessStatusCode == false)
                    {
                        result.StatusText = response.ReasonPhrase;
                    }
                    else
                    {
                        result.Content = await response.Content.ReadAsStringAsync();
                    }
                    result.Status = response.StatusCode;
                    result.RequestMessage = response.RequestMessage.ToString();
                }
                catch (Exception ex)
                {
                    result.StatusText = ex.Message;
                    return result;
                }
            }
            else if (req.Method.Equals("DELETE"))
            {
                try
                {
                    var response = await _httpClient.DeleteAsync(req.Url);
                    result.IsSuccess = response.IsSuccessStatusCode;
                    if (response.IsSuccessStatusCode == false)
                    {
                        result.StatusText = response.ReasonPhrase;
                    }
                    else
                    {
                        result.Content = await response.Content.ReadAsStringAsync();
                    }
                    result.Status = response.StatusCode;
                    result.RequestMessage = response.RequestMessage.ToString();
                }
                catch (Exception ex)
                {
                    result.StatusText = ex.Message;
                    return result;
                }
            }
            else
            {
                result.Content = "Method Incorrect";
            }

            return result;
        }

    }
}
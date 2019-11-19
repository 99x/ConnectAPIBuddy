using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Models
{
    public class DeliveryResponse
    {
        public string Content { get; set; }
        public HttpStatusCode Status { get; set; }
        public string StatusText { get; set; }
        public string RequestMessage { get; set; }
        public Boolean IsSuccess { get; set; }
    }
}

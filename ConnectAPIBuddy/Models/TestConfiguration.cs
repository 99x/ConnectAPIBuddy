using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.XPath;


namespace ConnectAPIBuddy.Models
{
    public class TestConfiguration
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string UserId { get; set; }
        public string TestName { get; set; }
        public string TestDescription { get; set; }
        public string Url { get; set; }
        public string BaseUrl { get; set; }
        public string BasePath { get; set; }
        public string EndpointAction { get; set; }
        public string PayloadBody { get; set; }
        public HeaderVal[] PayloadHeaders { get; set;}
        public FormVal[] FormContent { get; set; }
        public string Response { get; set; }
        public FileDetails File { get; set; }  
        public string Tenant { get; set; }
        public string Status { get; set; }

        
    }

    public class HeaderVal
    {
        public string Header { get; set; }
        public string Value { get; set; }
    }

    public class FormVal
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class FileDetails
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public long Size { get; set; }
        public string FileAsBase64 { get; set; }
        public string Key { get; set; }
    }

}


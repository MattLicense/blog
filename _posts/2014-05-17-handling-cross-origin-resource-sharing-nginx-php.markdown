---
layout: post
title:  "Handling Cross-Origin Resource Sharing with Nginx"
---

Part of the way I designed my [dissertation project][hugo] was to implement an API to handle processing data from a CSV to the database. Before starting the project, I had a brief understanding of the Same-Origin Policy<sup>[[1]][SOP]</sup> in modern web browsers but wasn't aware of the implications when developing an API for third-party access.

By default, a browser will prevent any scripts from being run if they don't originate from the same source - i.e. resources should be the same domain name, port, and protocol and if any of these differ the request is cancelled. One method around the Same-Origin Policy is **Cross-Origin Resource Sharing (CORS)**. This involves modifying the headers of the responses from the APIs to tell the browser what origins and methods are permitted.

I used Nginx as the HTTP server for the project as I find the setup a lot simpler than with Apache and it's generally benchmarked quicker. This meant that I needed to modify the server block for the API in my Nginx configuration. I used a front controller within the API so all of the requests are routed through `index.php`. What the location block does is add a range of headers onto any response return from the API. The specification for the project required that the API be accessible by a third party (should they need to) meaning that the `Access-Control-Allow-Origin` header returns a wildcard so any host can access the API *(though several parts are restricted without any authorisation)*. It also allows a range of standard HTTP methods and headers to be used when making requests to the API as it was developed following the REST architecture.

``` nginx
location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' true;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    add_header 'Access-Control-Max-Age' 1728000;

    if ($request_method = 'OPTIONS') {
        add_header 'Content-Type' 'text/plan charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    try_files $uri $uri/ /index.php?/$request_uri;
}
```

I've also included a check on the HTTP method used to make the request. An `OPTIONS` request is used as a ‘preflight’ request in modern web browsers when attempting to access resources on another host<sup>[[2]][Options]</sup>. This is simply used to scope out the available HTTP methods that can be used, ensuring the the HTTP request can be fulfilled, by checking what is returned in the `Access-Control-*` headers. Because only the headers are checked in the preflight request, no data need be returned - resulting in a `204 - No Content` response.

During testing, I realised that *none* of the requests were being permitted in IE9. After some digging on Google, I found this blog post<sup>[[3]][IE9]</sup> from MSDN describing several caveats on the use of CORS requests with the XDomainRequest object (used in earlier versions of Internet Explorer prior to the introduction of XmlHttpRequest in IE10). The two killers of these were:

1. The target URL must be accessed using only the HTTP methods GET and POST
2. No custom headers may be added to the request

The first of these points rules out any API end points used to update (`PUT`) or delete (`DELETE`) resources would fail. The second was an absolute killer, because every request the a logged in user made included a custom `Authorization` header with their API token.

Generally, I found CORS to be an effective solution to bypass the Same-Origin Policy when I was working on this project. I'm not particularly happy with the lack of support for IE9 and below, but without wholescale restructuring of the API, I could find no viable solution.

\[1]: [https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy][SOP]<br>
\[2]: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS][Options]<br>
\[3]: [http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx][IE9]

[hugo]: http://data.mattlicense.co.uk
[SOP]: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
[Options]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
[IE9]: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
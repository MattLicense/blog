---
layout: post
title:  "Redesign complete"
---
This is the first post on the new design of the blog. I was never particularly happy with the initial design (it was just a simple on to help get me started). I've been using SCSS split into several, modular files to help with the design. I've made some modifications to the responsive elements (mostly sorting out the breakpoints).

I'm a big fan of SCSS, coming from a developers mindset, it helped me to abstract parts of the page into separate files so if I found something wrong I knew where to fix it. It also allowed me to add set styling to the headers with a for loop, saving me time and effort of writing out more-or-less the same block of styling for different elements.

One of the big benefits I get from using Jekyll/Compass to maintain this blog is the minification of all the assets which means it scores highly on Googles Pagespeed Insights<sup>[[1][pagespeed]]</sup>.

I've also spent some time adding schema.org<sup>[[2][schema.org]]</sup> metadata to help improve the SEO of the site. It was surprising easy to set up in the Jekyll templates I have and should help improve my blogs standing in the search engines.

All in all, this has made for a fairly constructive bit of procrastination from my last two exams!

\[1]: [https://developers.google.com/speed/pagespeed/insights/?utm_source=analytics&tab=desktop&url=http%3A%2F%2Fmattlicense.co.uk%2Fblog%2F][pagespeed]<br>
\[2]: [http://schema.org][schema.org]

[pagespeed]: https://developers.google.com/speed/pagespeed/insights/?utm_source=analytics&tab=desktop&url=http%3A%2F%2Fmattlicense.co.uk%2Fblog%2F
[schema.org]: http://schema.org
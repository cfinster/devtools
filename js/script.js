!function(a,b,c){function w(a){h.test(b[p])?c(function(){w(a)},50):a()}function t(a,b){s(a,function(a){return!b(a)})}var d=b.getElementsByTagName("script")[0],e={},f={},g={},h=/in/,i={},k="string",l=!1,m,n="push",o="DOMContentLoaded",p="readyState",q="addEventListener",r="onreadystatechange",s=Array.every||function(a,b){for(m=0,j=a.length;m<j;++m)if(!b(a[m]))return 0;return 1};!b[p]&&b[q]&&(b[q](o,function u(){b.removeEventListener(o,u,l),b[p]="complete"},l),b[p]="loading");var v=function(a,j,k){function w(){if(!--q){e[o]=1,m&&m();for(var a in g)s(a.split("|"),u)&&!t(g[a],u)&&(g[a]=[])}}function u(a){return a.call?a():e[a]}a=a[n]?a:[a];var l=j&&j.call,m=l?j:k,o=l?a.join(""):j,q=a.length;if(!o||!f[o]){c(function(){t(a,function(a){if(!i[a]){i[a]=1,o&&(f[o]=1);var c=b.createElement("script"),e=0;c.onload=c[r]=function(){c[p]&&!!h.test(c[p])||e||(c.onload=c[r]=null,e=1,w())},c.async=1,c.src=a,d.parentNode.insertBefore(c,d)}})},0);return v}};v.ready=function(a,b,c){a=a[n]?a:[a];var d=[];!t(a,function(a){e[a]||d[n](a)})&&s(a,function(a){return e[a]})?b():!function(a){g[a]=g[a]||[],g[a][n](b),c&&c(d)}(a.join("|"));return v},a.$script=v,a.$script.domReady=w}(this,document,setTimeout)
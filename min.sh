rm ./public/js/all.js
rm ./public/js/all.min.js
#rm ./public/css/styles.min.css

touch ./public/js/all.js
cat ./public/js/oneplace.module.js >> ./public/js/all.js
cat ./public/js/app.controller.js >> ./public/js/all.js
cat ./public/js/home.controller.js >> ./public/js/all.js
cat ./public/js/getposts.service.js >> ./public/js/all.js
cat ./public/js/golos-tag.filter.js >> ./public/js/all.js
cat ./public/js/ungolos-tag.filter.js >> ./public/js/all.js
cat ./public/js/tag-block.directive.js >> ./public/js/all.js
cat ./public/js/one-page-nav.js >> ./public/js/all.js
cat ./public/js/scripts.js >> ./public/js/all.js

yui-compressor ./public/js/all.js >> ./public/js/all.min.js
#yui-compressor ./public/css/styles.css >> ./public/css/styles.min.css

#sed -i 's/styles.css/styles.min.css/g' ./public/index.html
sed -i 's/<html lang="en">/<html lang="en" manifest="appcache.manifest">/g' ./public/index.html
sed -i 's/<!--scripts-->/<!--/g' ./public/index.html
sed -i 's/<!--scripts end-->/-->/g' ./public/index.html
sed -i 's/<!--min scripts//g' ./public/index.html
sed -i 's/min scripts end-->//g' ./public/index.html

{ printf '#' ; date ; } >> ./public/appcache.manifest


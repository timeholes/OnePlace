    $(document).ready(function () {

      $(document).on('click', '.header__nav-toggle', function () {
        $('.sidebar').toggleClass('sidebar-opened');
      });

      $(document).on('click', '.sidebar-opened .sidebar__nav-link', function () {
        $('.sidebar').removeClass('sidebar-opened');
      });

      $('.sidebar').swipe({
        swipeLeft: function (event, direction, distance, duration, fingerCount) {
          $('.sidebar').removeClass('sidebar-opened');
        }
      });

      function getDocHeight() {
        var D = document;
        return Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight,
          D.body.offsetHeight, D.documentElement.offsetHeight,
          D.body.clientHeight, D.documentElement.clientHeight
        );
      };

      function scrollX() {
        var docElem = document.documentElement;
        return window.pageXOffset || docElem.scrollLeft;
      };

      function scrollY() {
        var docElem = document.documentElement;
        return window.pageYOffset || docElem.scrollTop;
      };

      function fixedHeader() {
        var didScroll;
        var lastScrollTop = 0;
        var delta = 5;
        hasScrolled();

        window.addEventListener('scroll', didScrollTrue);

        function didScrollTrue() {
          didScroll = true;
        }
        setInterval(function () {
          if (didScroll) {
            hasScrolled();
            didScroll = false;
          }
        }, 150);


        function hasScrolled() {
          var st = scrollY();
          if (Math.abs(lastScrollTop - st) <= delta)
            return;
          if (st > lastScrollTop && scrollY() >= 90) {
            $('.header').removeClass('header-visible');
            $('.header').addClass('header-hidden');
          } else {
            if (scrollY() <= 90) {
              $('.header').removeClass('header-hidden');
              $('.header').removeClass('header-visible');
            } else {
              $('.header').removeClass('header-hidden');
              $('.header').addClass('header-visible');
            }
          }
          lastScrollTop = st;
        }
      };

      fixedHeader();
    });
var app = angular.module('reg', [
  'ui.router',
  'chart.js',
]);

app
  .config([
    '$httpProvider',
    function($httpProvider){

      // Add auth token to Authorization header
      $httpProvider.interceptors.push('AuthInterceptor');

    }])
  .run([
    'AuthService',
    'Session',
    function(AuthService, Session){

      // Startup, login if there's  a token.
      var token = Session.getToken();
      if (token){
        AuthService.loginWithToken(token);
      }

  }]);

angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'UVSQ Conf 2022',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: 'If you do not complete your application before the [APP_DEADLINE], you will not be considered for the event!',
        SUBMITTED_TITLE: 'Your application has been submitted!',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be determined by a random lottery. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the lottery process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'You must confirm by [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of [CONFIRM_DEADLINE] has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until [CONFIRM_DEADLINE]',
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to UVSQ Conf 2022! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    });


angular.module('reg')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/404");
    
    // Set up de states
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false,
          requireLogout: true
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('home', {
        url: "/",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false,
          requireLogout: true
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })

      // .state('home', {
      //   url: "/",
      //   templateUrl: "views/home/home.html",
      //   controller: 'HomeCtrl',
      //   data: {
      //     requireLogin: false
      //   },
      //   resolve: {
      //     'settings': function(SettingsService){
      //       return SettingsService.getPublicSettings();
      //     }
      //   }
      // })

      .state('app', {
        views: {
          '': {
            templateUrl: "views/base.html",
            controller: "BaseCtrl",
          },
          'sidebar@app': {
            templateUrl: "views/sidebar/sidebar.html",
            controller: 'SidebarCtrl',
            resolve: {
              settings: ["SettingsService", function(SettingsService) {
                return SettingsService.getPublicSettings();
              }]
            }
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('app.dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard/dashboard.html",
        controller: 'DashboardCtrl',
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        },
      })
      .state('app.application', {
        url: "/application",
        templateUrl: "views/application/application.html",
        controller: 'ApplicationCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.confirmation', {
        url: "/confirmation",
        templateUrl: "views/confirmation/confirmation.html",
        controller: 'ConfirmationCtrl',
        data: {
          requireAdmitted: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }]
        }
      })
      .state('app.challenges', {
        url: "/challenges",
        templateUrl: "views/challenges/challenges.html",
        controller: 'ChallengesCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.team', {
        url: "/team",
        templateUrl: "views/team/team.html",
        controller: 'TeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.admin', {
        views: {
          '': {
            templateUrl: "views/admin/admin.html",
            controller: 'adminCtrl'
          }
        },
        data: {
          requireAdmin: true
        }
      })
      .state('app.checkin', {
        url: '/checkin',
        templateUrl: 'views/checkin/checkin.html',
        controller: 'CheckinCtrl',
        data: {
          requireVolunteer: true
        }
      })
      .state('app.admin.stats', {
        url: "/admin",
        templateUrl: "views/admin/stats/stats.html",
        controller: 'AdminStatsCtrl'
      })
      .state('app.admin.mail', {
        url: "/admin/mail",
        templateUrl: "views/admin/mail/mail.html",
        controller: 'AdminMailCtrl'
      })
      .state('app.admin.challenges', {
        url: "/admin/challenges",
        templateUrl: "views/admin/challenges/challenges.html",
        controller: 'adminChallengesCtrl'
      })
      .state('app.admin.challenge', {
        url: "/admin/challenges/:id",
        templateUrl: "views/admin/challenge/challenge.html",
        controller: 'adminChallengeCtrl',
        resolve: {
          'challenge': ["$stateParams", "ChallengeService", function($stateParams, ChallengeService){
            return ChallengeService.get($stateParams.id);
          }]
        }
      })
      .state('app.admin.marketing', {
        url: "/admin/marketing",
        templateUrl: "views/admin/marketing/marketing.html",
        controller: 'adminMarketingCtrl'
      })
      .state('app.admin.users', {
        url: "/admin/users?" +
          '&page' +
          '&size' +
          '&query',
        templateUrl: "views/admin/users/users.html",
        controller: 'AdminUsersCtrl'
      })
      .state('app.admin.user', {
        url: "/admin/users/:id",
        templateUrl: "views/admin/user/user.html",
        controller: 'AdminUserCtrl',
        resolve: {
          'user': ["$stateParams", "UserService", function($stateParams, UserService){
            return UserService.get($stateParams.id);
          }]
        }
      })
      .state('app.admin.settings', {
        url: "/admin/settings",
        templateUrl: "views/admin/settings/settings.html",
        controller: 'AdminSettingsCtrl',
      })
      .state('app.admin.teams', {
        url: "/admin/teams",
        templateUrl: "views/admin/teams/teams.html",
        controller: 'AdminTeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('reset', {
        url: "/reset/:token",
        templateUrl: "views/reset/reset.html",
        controller: 'ResetCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('verify', {
        url: "/verify/:token",
        templateUrl: "views/verify/verify.html",
        controller: 'VerifyCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('404', {
        url: "/404",
        templateUrl: "views/404.html",
        data: {
          requireLogin: false
        }
      });

    $locationProvider.html5Mode({
      enabled: true,
    });

  }])
  .run([
    '$rootScope',
    '$state',
    'Session',
    function(
      $rootScope,
      $state,
      Session ){

      $rootScope.$on('$stateChangeSuccess', function() {
         document.body.scrollTop = document.documentElement.scrollTop = 0;
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        var requireLogin = toState.data.requireLogin;
        var requireLogout = toState.data.requireLogout;
        var requireAdmin = toState.data.requireAdmin;
        var requireVolunteer = toState.data.requireVolunteer;
        var requireVerified = toState.data.requireVerified;
        var requireAdmitted = toState.data.requireAdmitted;
  
        if (requireLogin && !Session.getToken()) {
          event.preventDefault();
          $state.go('home');
        }
  
        if (requireLogout && Session.getToken()) {
          event.preventDefault();
          $state.go('app.dashboard');
        }
        
        if (requireAdmin && !Session.getUser().admin) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireVolunteer && !Session.getUser().volunteer && requireAdmin && !Session.getUser().admin) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireVerified && !Session.getUser().verified) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireAdmitted && !Session.getUser().status.admitted) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  

      });

    }]);

angular.module('reg')
  .factory('AuthInterceptor', [
    'Session',
    function(Session){
      return {
          request: function(config){
            var token = Session.getToken();
            if (token){
              config.headers['x-access-token'] = token;
            }
            return config;
          }
        };
    }]);

angular.module('reg')
  .service('Session', [
    '$rootScope',
    '$window',
    function($rootScope, $window){

    this.create = function(token, user){
      $window.localStorage.jwt = token;
      $window.localStorage.userId = user._id;
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

    this.destroy = function(onComplete){
      delete $window.localStorage.jwt;
      delete $window.localStorage.userId;
      delete $window.localStorage.currentUser;
      $rootScope.currentUser = null;
      if (onComplete){
        onComplete();
      }
    };

    this.getToken = function(){
      return $window.localStorage.jwt;
    };

    this.getUserId = function(){
      return $window.localStorage.userId;
    };

    this.getUser = function(){
      return JSON.parse($window.localStorage.currentUser);
    };

    this.setUser = function(user){
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

  }]);
angular.module('reg')
  .factory('Utils', [
    function(){
      return {
        isRegOpen: function(settings){
          return Date.now() > settings.timeOpen && Date.now() < settings.timeClose;
        },
        isAfter: function(time){
          return Date.now() > time;
        },
        formatTime: function(time){

          if (!time){
            return "Invalid Date";
          }

          date = new Date(time);
          // Hack for timezone
          return moment(date).locale('en').format('dddd, MMMM Do YYYY, h:mm a') +
            " " + date.toTimeString().split(' ')[2];

        }
      };
    }]);

(function($) {
    jQuery.fn.extend({
        html5_qrcode: function(qrcodeSuccess, qrcodeError, videoError) {
            return this.each(function() {
                var currentElem = $(this);

                var height = currentElem.height();
                var width = currentElem.width();

                if (height == null) {
                    height = 250;
                }

                if (width == null) {
                    width = 300;
                }

                // var vidElem = $('<video width="' + width + 'px" height="' + height + 'px"></video>').appendTo(currentElem);
                var vidElem = $('<video width="' + width + 'px" height="' + height + 'px" autoplay playsinline></video>').appendTo(currentElem);
                var canvasElem = $('<canvas id="qr-canvas" width="' + (width - 2) + 'px" height="' + (height - 2) + 'px" style="display:none;"></canvas>').appendTo(currentElem);

                var video = vidElem[0];
                var canvas = canvasElem[0];
                var context = canvas.getContext('2d');
                var localMediaStream;

                var scan = function() {
                    if (localMediaStream) {
                        context.drawImage(video, 0, 0, 307, 250);

                        try {
                            qrcode.decode();
                        } catch (e) {
                            qrcodeError(e, localMediaStream);
                        }

                        $.data(currentElem[0], "timeout", setTimeout(scan, 500));

                    } else {
                        $.data(currentElem[0], "timeout", setTimeout(scan, 500));
                    }
                };//end snapshot function

                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                var successCallback = function(stream) {
                    // video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                    video.srcObject = stream;
                    localMediaStream = stream;
                    $.data(currentElem[0], "stream", stream);

                    video.play();
                    $.data(currentElem[0], "timeout", setTimeout(scan, 1000));
                };

                // Call the getUserMedia method with our callback functions
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video: { facingMode: "environment" } }, successCallback, function(error) {
                        videoError(error, localMediaStream);
                    });
                } else {
                    console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
                    // Display a friendly "sorry" message to the user
                }

                qrcode.callback = function (result) {
                    qrcodeSuccess(result, localMediaStream);
                };
            }); // end of html5_qrcode
        },
        html5_qrcode_stop: function() {
            return this.each(function() {
                //stop the stream and cancel timeouts
                $(this).data('stream').getVideoTracks().forEach(function(videoTrack) {
                    videoTrack.stop();
                });

                clearTimeout($(this).data('timeout'));
            });
        }
    });
})(jQuery);


function ECB(count,dataCodewords){this.count=count,this.dataCodewords=dataCodewords,this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("DataCodewords",function(){return this.dataCodewords})}function ECBlocks(ecCodewordsPerBlock,ecBlocks1,ecBlocks2){this.ecCodewordsPerBlock=ecCodewordsPerBlock,ecBlocks2?this.ecBlocks=new Array(ecBlocks1,ecBlocks2):this.ecBlocks=new Array(ecBlocks1),this.__defineGetter__("ECCodewordsPerBlock",function(){return this.ecCodewordsPerBlock}),this.__defineGetter__("TotalECCodewords",function(){return this.ecCodewordsPerBlock*this.NumBlocks}),this.__defineGetter__("NumBlocks",function(){for(var total=0,i=0;i<this.ecBlocks.length;i++)total+=this.ecBlocks[i].length;return total}),this.getECBlocks=function(){return this.ecBlocks}}function Version(versionNumber,alignmentPatternCenters,ecBlocks1,ecBlocks2,ecBlocks3,ecBlocks4){this.versionNumber=versionNumber,this.alignmentPatternCenters=alignmentPatternCenters,this.ecBlocks=new Array(ecBlocks1,ecBlocks2,ecBlocks3,ecBlocks4);for(var total=0,ecCodewords=ecBlocks1.ECCodewordsPerBlock,ecbArray=ecBlocks1.getECBlocks(),i=0;i<ecbArray.length;i++){var ecBlock=ecbArray[i];total+=ecBlock.Count*(ecBlock.DataCodewords+ecCodewords)}this.totalCodewords=total,this.__defineGetter__("VersionNumber",function(){return this.versionNumber}),this.__defineGetter__("AlignmentPatternCenters",function(){return this.alignmentPatternCenters}),this.__defineGetter__("TotalCodewords",function(){return this.totalCodewords}),this.__defineGetter__("DimensionForVersion",function(){return 17+4*this.versionNumber}),this.buildFunctionPattern=function(){var dimension=this.DimensionForVersion,bitMatrix=new BitMatrix(dimension);bitMatrix.setRegion(0,0,9,9),bitMatrix.setRegion(dimension-8,0,8,9),bitMatrix.setRegion(0,dimension-8,9,8);for(var max=this.alignmentPatternCenters.length,x=0;max>x;x++)for(var i=this.alignmentPatternCenters[x]-2,y=0;max>y;y++)0==x&&(0==y||y==max-1)||x==max-1&&0==y||bitMatrix.setRegion(this.alignmentPatternCenters[y]-2,i,5,5);return bitMatrix.setRegion(6,9,1,dimension-17),bitMatrix.setRegion(9,6,dimension-17,1),this.versionNumber>6&&(bitMatrix.setRegion(dimension-11,0,3,6),bitMatrix.setRegion(0,dimension-11,6,3)),bitMatrix},this.getECBlocksForLevel=function(ecLevel){return this.ecBlocks[ecLevel.ordinal()]}}function buildVersions(){return new Array(new Version(1,new Array,new ECBlocks(7,new ECB(1,19)),new ECBlocks(10,new ECB(1,16)),new ECBlocks(13,new ECB(1,13)),new ECBlocks(17,new ECB(1,9))),new Version(2,new Array(6,18),new ECBlocks(10,new ECB(1,34)),new ECBlocks(16,new ECB(1,28)),new ECBlocks(22,new ECB(1,22)),new ECBlocks(28,new ECB(1,16))),new Version(3,new Array(6,22),new ECBlocks(15,new ECB(1,55)),new ECBlocks(26,new ECB(1,44)),new ECBlocks(18,new ECB(2,17)),new ECBlocks(22,new ECB(2,13))),new Version(4,new Array(6,26),new ECBlocks(20,new ECB(1,80)),new ECBlocks(18,new ECB(2,32)),new ECBlocks(26,new ECB(2,24)),new ECBlocks(16,new ECB(4,9))),new Version(5,new Array(6,30),new ECBlocks(26,new ECB(1,108)),new ECBlocks(24,new ECB(2,43)),new ECBlocks(18,new ECB(2,15),new ECB(2,16)),new ECBlocks(22,new ECB(2,11),new ECB(2,12))),new Version(6,new Array(6,34),new ECBlocks(18,new ECB(2,68)),new ECBlocks(16,new ECB(4,27)),new ECBlocks(24,new ECB(4,19)),new ECBlocks(28,new ECB(4,15))),new Version(7,new Array(6,22,38),new ECBlocks(20,new ECB(2,78)),new ECBlocks(18,new ECB(4,31)),new ECBlocks(18,new ECB(2,14),new ECB(4,15)),new ECBlocks(26,new ECB(4,13),new ECB(1,14))),new Version(8,new Array(6,24,42),new ECBlocks(24,new ECB(2,97)),new ECBlocks(22,new ECB(2,38),new ECB(2,39)),new ECBlocks(22,new ECB(4,18),new ECB(2,19)),new ECBlocks(26,new ECB(4,14),new ECB(2,15))),new Version(9,new Array(6,26,46),new ECBlocks(30,new ECB(2,116)),new ECBlocks(22,new ECB(3,36),new ECB(2,37)),new ECBlocks(20,new ECB(4,16),new ECB(4,17)),new ECBlocks(24,new ECB(4,12),new ECB(4,13))),new Version(10,new Array(6,28,50),new ECBlocks(18,new ECB(2,68),new ECB(2,69)),new ECBlocks(26,new ECB(4,43),new ECB(1,44)),new ECBlocks(24,new ECB(6,19),new ECB(2,20)),new ECBlocks(28,new ECB(6,15),new ECB(2,16))),new Version(11,new Array(6,30,54),new ECBlocks(20,new ECB(4,81)),new ECBlocks(30,new ECB(1,50),new ECB(4,51)),new ECBlocks(28,new ECB(4,22),new ECB(4,23)),new ECBlocks(24,new ECB(3,12),new ECB(8,13))),new Version(12,new Array(6,32,58),new ECBlocks(24,new ECB(2,92),new ECB(2,93)),new ECBlocks(22,new ECB(6,36),new ECB(2,37)),new ECBlocks(26,new ECB(4,20),new ECB(6,21)),new ECBlocks(28,new ECB(7,14),new ECB(4,15))),new Version(13,new Array(6,34,62),new ECBlocks(26,new ECB(4,107)),new ECBlocks(22,new ECB(8,37),new ECB(1,38)),new ECBlocks(24,new ECB(8,20),new ECB(4,21)),new ECBlocks(22,new ECB(12,11),new ECB(4,12))),new Version(14,new Array(6,26,46,66),new ECBlocks(30,new ECB(3,115),new ECB(1,116)),new ECBlocks(24,new ECB(4,40),new ECB(5,41)),new ECBlocks(20,new ECB(11,16),new ECB(5,17)),new ECBlocks(24,new ECB(11,12),new ECB(5,13))),new Version(15,new Array(6,26,48,70),new ECBlocks(22,new ECB(5,87),new ECB(1,88)),new ECBlocks(24,new ECB(5,41),new ECB(5,42)),new ECBlocks(30,new ECB(5,24),new ECB(7,25)),new ECBlocks(24,new ECB(11,12),new ECB(7,13))),new Version(16,new Array(6,26,50,74),new ECBlocks(24,new ECB(5,98),new ECB(1,99)),new ECBlocks(28,new ECB(7,45),new ECB(3,46)),new ECBlocks(24,new ECB(15,19),new ECB(2,20)),new ECBlocks(30,new ECB(3,15),new ECB(13,16))),new Version(17,new Array(6,30,54,78),new ECBlocks(28,new ECB(1,107),new ECB(5,108)),new ECBlocks(28,new ECB(10,46),new ECB(1,47)),new ECBlocks(28,new ECB(1,22),new ECB(15,23)),new ECBlocks(28,new ECB(2,14),new ECB(17,15))),new Version(18,new Array(6,30,56,82),new ECBlocks(30,new ECB(5,120),new ECB(1,121)),new ECBlocks(26,new ECB(9,43),new ECB(4,44)),new ECBlocks(28,new ECB(17,22),new ECB(1,23)),new ECBlocks(28,new ECB(2,14),new ECB(19,15))),new Version(19,new Array(6,30,58,86),new ECBlocks(28,new ECB(3,113),new ECB(4,114)),new ECBlocks(26,new ECB(3,44),new ECB(11,45)),new ECBlocks(26,new ECB(17,21),new ECB(4,22)),new ECBlocks(26,new ECB(9,13),new ECB(16,14))),new Version(20,new Array(6,34,62,90),new ECBlocks(28,new ECB(3,107),new ECB(5,108)),new ECBlocks(26,new ECB(3,41),new ECB(13,42)),new ECBlocks(30,new ECB(15,24),new ECB(5,25)),new ECBlocks(28,new ECB(15,15),new ECB(10,16))),new Version(21,new Array(6,28,50,72,94),new ECBlocks(28,new ECB(4,116),new ECB(4,117)),new ECBlocks(26,new ECB(17,42)),new ECBlocks(28,new ECB(17,22),new ECB(6,23)),new ECBlocks(30,new ECB(19,16),new ECB(6,17))),new Version(22,new Array(6,26,50,74,98),new ECBlocks(28,new ECB(2,111),new ECB(7,112)),new ECBlocks(28,new ECB(17,46)),new ECBlocks(30,new ECB(7,24),new ECB(16,25)),new ECBlocks(24,new ECB(34,13))),new Version(23,new Array(6,30,54,74,102),new ECBlocks(30,new ECB(4,121),new ECB(5,122)),new ECBlocks(28,new ECB(4,47),new ECB(14,48)),new ECBlocks(30,new ECB(11,24),new ECB(14,25)),new ECBlocks(30,new ECB(16,15),new ECB(14,16))),new Version(24,new Array(6,28,54,80,106),new ECBlocks(30,new ECB(6,117),new ECB(4,118)),new ECBlocks(28,new ECB(6,45),new ECB(14,46)),new ECBlocks(30,new ECB(11,24),new ECB(16,25)),new ECBlocks(30,new ECB(30,16),new ECB(2,17))),new Version(25,new Array(6,32,58,84,110),new ECBlocks(26,new ECB(8,106),new ECB(4,107)),new ECBlocks(28,new ECB(8,47),new ECB(13,48)),new ECBlocks(30,new ECB(7,24),new ECB(22,25)),new ECBlocks(30,new ECB(22,15),new ECB(13,16))),new Version(26,new Array(6,30,58,86,114),new ECBlocks(28,new ECB(10,114),new ECB(2,115)),new ECBlocks(28,new ECB(19,46),new ECB(4,47)),new ECBlocks(28,new ECB(28,22),new ECB(6,23)),new ECBlocks(30,new ECB(33,16),new ECB(4,17))),new Version(27,new Array(6,34,62,90,118),new ECBlocks(30,new ECB(8,122),new ECB(4,123)),new ECBlocks(28,new ECB(22,45),new ECB(3,46)),new ECBlocks(30,new ECB(8,23),new ECB(26,24)),new ECBlocks(30,new ECB(12,15),new ECB(28,16))),new Version(28,new Array(6,26,50,74,98,122),new ECBlocks(30,new ECB(3,117),new ECB(10,118)),new ECBlocks(28,new ECB(3,45),new ECB(23,46)),new ECBlocks(30,new ECB(4,24),new ECB(31,25)),new ECBlocks(30,new ECB(11,15),new ECB(31,16))),new Version(29,new Array(6,30,54,78,102,126),new ECBlocks(30,new ECB(7,116),new ECB(7,117)),new ECBlocks(28,new ECB(21,45),new ECB(7,46)),new ECBlocks(30,new ECB(1,23),new ECB(37,24)),new ECBlocks(30,new ECB(19,15),new ECB(26,16))),new Version(30,new Array(6,26,52,78,104,130),new ECBlocks(30,new ECB(5,115),new ECB(10,116)),new ECBlocks(28,new ECB(19,47),new ECB(10,48)),new ECBlocks(30,new ECB(15,24),new ECB(25,25)),new ECBlocks(30,new ECB(23,15),new ECB(25,16))),new Version(31,new Array(6,30,56,82,108,134),new ECBlocks(30,new ECB(13,115),new ECB(3,116)),new ECBlocks(28,new ECB(2,46),new ECB(29,47)),new ECBlocks(30,new ECB(42,24),new ECB(1,25)),new ECBlocks(30,new ECB(23,15),new ECB(28,16))),new Version(32,new Array(6,34,60,86,112,138),new ECBlocks(30,new ECB(17,115)),new ECBlocks(28,new ECB(10,46),new ECB(23,47)),new ECBlocks(30,new ECB(10,24),new ECB(35,25)),new ECBlocks(30,new ECB(19,15),new ECB(35,16))),new Version(33,new Array(6,30,58,86,114,142),new ECBlocks(30,new ECB(17,115),new ECB(1,116)),new ECBlocks(28,new ECB(14,46),new ECB(21,47)),new ECBlocks(30,new ECB(29,24),new ECB(19,25)),new ECBlocks(30,new ECB(11,15),new ECB(46,16))),new Version(34,new Array(6,34,62,90,118,146),new ECBlocks(30,new ECB(13,115),new ECB(6,116)),new ECBlocks(28,new ECB(14,46),new ECB(23,47)),new ECBlocks(30,new ECB(44,24),new ECB(7,25)),new ECBlocks(30,new ECB(59,16),new ECB(1,17))),new Version(35,new Array(6,30,54,78,102,126,150),new ECBlocks(30,new ECB(12,121),new ECB(7,122)),new ECBlocks(28,new ECB(12,47),new ECB(26,48)),new ECBlocks(30,new ECB(39,24),new ECB(14,25)),new ECBlocks(30,new ECB(22,15),new ECB(41,16))),new Version(36,new Array(6,24,50,76,102,128,154),new ECBlocks(30,new ECB(6,121),new ECB(14,122)),new ECBlocks(28,new ECB(6,47),new ECB(34,48)),new ECBlocks(30,new ECB(46,24),new ECB(10,25)),new ECBlocks(30,new ECB(2,15),new ECB(64,16))),new Version(37,new Array(6,28,54,80,106,132,158),new ECBlocks(30,new ECB(17,122),new ECB(4,123)),new ECBlocks(28,new ECB(29,46),new ECB(14,47)),new ECBlocks(30,new ECB(49,24),new ECB(10,25)),new ECBlocks(30,new ECB(24,15),new ECB(46,16))),new Version(38,new Array(6,32,58,84,110,136,162),new ECBlocks(30,new ECB(4,122),new ECB(18,123)),new ECBlocks(28,new ECB(13,46),new ECB(32,47)),new ECBlocks(30,new ECB(48,24),new ECB(14,25)),new ECBlocks(30,new ECB(42,15),new ECB(32,16))),new Version(39,new Array(6,26,54,82,110,138,166),new ECBlocks(30,new ECB(20,117),new ECB(4,118)),new ECBlocks(28,new ECB(40,47),new ECB(7,48)),new ECBlocks(30,new ECB(43,24),new ECB(22,25)),new ECBlocks(30,new ECB(10,15),new ECB(67,16))),new Version(40,new Array(6,30,58,86,114,142,170),new ECBlocks(30,new ECB(19,118),new ECB(6,119)),new ECBlocks(28,new ECB(18,47),new ECB(31,48)),new ECBlocks(30,new ECB(34,24),new ECB(34,25)),new ECBlocks(30,new ECB(20,15),new ECB(61,16))))}function PerspectiveTransform(a11,a21,a31,a12,a22,a32,a13,a23,a33){this.a11=a11,this.a12=a12,this.a13=a13,this.a21=a21,this.a22=a22,this.a23=a23,this.a31=a31,this.a32=a32,this.a33=a33,this.transformPoints1=function(points){for(var max=points.length,a11=this.a11,a12=this.a12,a13=this.a13,a21=this.a21,a22=this.a22,a23=this.a23,a31=this.a31,a32=this.a32,a33=this.a33,i=0;max>i;i+=2){var x=points[i],y=points[i+1],denominator=a13*x+a23*y+a33;points[i]=(a11*x+a21*y+a31)/denominator,points[i+1]=(a12*x+a22*y+a32)/denominator}},this.transformPoints2=function(xValues,yValues){for(var n=xValues.length,i=0;n>i;i++){var x=xValues[i],y=yValues[i],denominator=this.a13*x+this.a23*y+this.a33;xValues[i]=(this.a11*x+this.a21*y+this.a31)/denominator,yValues[i]=(this.a12*x+this.a22*y+this.a32)/denominator}},this.buildAdjoint=function(){return new PerspectiveTransform(this.a22*this.a33-this.a23*this.a32,this.a23*this.a31-this.a21*this.a33,this.a21*this.a32-this.a22*this.a31,this.a13*this.a32-this.a12*this.a33,this.a11*this.a33-this.a13*this.a31,this.a12*this.a31-this.a11*this.a32,this.a12*this.a23-this.a13*this.a22,this.a13*this.a21-this.a11*this.a23,this.a11*this.a22-this.a12*this.a21)},this.times=function(other){return new PerspectiveTransform(this.a11*other.a11+this.a21*other.a12+this.a31*other.a13,this.a11*other.a21+this.a21*other.a22+this.a31*other.a23,this.a11*other.a31+this.a21*other.a32+this.a31*other.a33,this.a12*other.a11+this.a22*other.a12+this.a32*other.a13,this.a12*other.a21+this.a22*other.a22+this.a32*other.a23,this.a12*other.a31+this.a22*other.a32+this.a32*other.a33,this.a13*other.a11+this.a23*other.a12+this.a33*other.a13,this.a13*other.a21+this.a23*other.a22+this.a33*other.a23,this.a13*other.a31+this.a23*other.a32+this.a33*other.a33)}}function DetectorResult(bits,points){this.bits=bits,this.points=points}function Detector(image){this.image=image,this.resultPointCallback=null,this.sizeOfBlackWhiteBlackRun=function(fromX,fromY,toX,toY){var steep=Math.abs(toY-fromY)>Math.abs(toX-fromX);if(steep){var temp=fromX;fromX=fromY,fromY=temp,temp=toX,toX=toY,toY=temp}for(var dx=Math.abs(toX-fromX),dy=Math.abs(toY-fromY),error=-dx>>1,ystep=toY>fromY?1:-1,xstep=toX>fromX?1:-1,state=0,x=fromX,y=fromY;x!=toX;x+=xstep){var realX=steep?y:x,realY=steep?x:y;if(1==state?this.image[realX+realY*qrcode.width]&&state++:this.image[realX+realY*qrcode.width]||state++,3==state){var diffX=x-fromX,diffY=y-fromY;return Math.sqrt(diffX*diffX+diffY*diffY)}if(error+=dy,error>0){if(y==toY)break;y+=ystep,error-=dx}}var diffX2=toX-fromX,diffY2=toY-fromY;return Math.sqrt(diffX2*diffX2+diffY2*diffY2)},this.sizeOfBlackWhiteBlackRunBothWays=function(fromX,fromY,toX,toY){var result=this.sizeOfBlackWhiteBlackRun(fromX,fromY,toX,toY),scale=1,otherToX=fromX-(toX-fromX);0>otherToX?(scale=fromX/(fromX-otherToX),otherToX=0):otherToX>=qrcode.width&&(scale=(qrcode.width-1-fromX)/(otherToX-fromX),otherToX=qrcode.width-1);var otherToY=Math.floor(fromY-(toY-fromY)*scale);return scale=1,0>otherToY?(scale=fromY/(fromY-otherToY),otherToY=0):otherToY>=qrcode.height&&(scale=(qrcode.height-1-fromY)/(otherToY-fromY),otherToY=qrcode.height-1),otherToX=Math.floor(fromX+(otherToX-fromX)*scale),result+=this.sizeOfBlackWhiteBlackRun(fromX,fromY,otherToX,otherToY),result-1},this.calculateModuleSizeOneWay=function(pattern,otherPattern){var moduleSizeEst1=this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(pattern.X),Math.floor(pattern.Y),Math.floor(otherPattern.X),Math.floor(otherPattern.Y)),moduleSizeEst2=this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X),Math.floor(otherPattern.Y),Math.floor(pattern.X),Math.floor(pattern.Y));return isNaN(moduleSizeEst1)?moduleSizeEst2/7:isNaN(moduleSizeEst2)?moduleSizeEst1/7:(moduleSizeEst1+moduleSizeEst2)/14},this.calculateModuleSize=function(topLeft,topRight,bottomLeft){return(this.calculateModuleSizeOneWay(topLeft,topRight)+this.calculateModuleSizeOneWay(topLeft,bottomLeft))/2},this.distance=function(pattern1,pattern2){return xDiff=pattern1.X-pattern2.X,yDiff=pattern1.Y-pattern2.Y,Math.sqrt(xDiff*xDiff+yDiff*yDiff)},this.computeDimension=function(topLeft,topRight,bottomLeft,moduleSize){var tltrCentersDimension=Math.round(this.distance(topLeft,topRight)/moduleSize),tlblCentersDimension=Math.round(this.distance(topLeft,bottomLeft)/moduleSize),dimension=(tltrCentersDimension+tlblCentersDimension>>1)+7;switch(3&dimension){case 0:dimension++;break;case 2:dimension--;break;case 3:throw"Error"}return dimension},this.findAlignmentInRegion=function(overallEstModuleSize,estAlignmentX,estAlignmentY,allowanceFactor){var allowance=Math.floor(allowanceFactor*overallEstModuleSize),alignmentAreaLeftX=Math.max(0,estAlignmentX-allowance),alignmentAreaRightX=Math.min(qrcode.width-1,estAlignmentX+allowance);if(3*overallEstModuleSize>alignmentAreaRightX-alignmentAreaLeftX)throw"Error";var alignmentAreaTopY=Math.max(0,estAlignmentY-allowance),alignmentAreaBottomY=Math.min(qrcode.height-1,estAlignmentY+allowance),alignmentFinder=new AlignmentPatternFinder(this.image,alignmentAreaLeftX,alignmentAreaTopY,alignmentAreaRightX-alignmentAreaLeftX,alignmentAreaBottomY-alignmentAreaTopY,overallEstModuleSize,this.resultPointCallback);return alignmentFinder.find()},this.createTransform=function(topLeft,topRight,bottomLeft,alignmentPattern,dimension){var bottomRightX,bottomRightY,sourceBottomRightX,sourceBottomRightY,dimMinusThree=dimension-3.5;null!=alignmentPattern?(bottomRightX=alignmentPattern.X,bottomRightY=alignmentPattern.Y,sourceBottomRightX=sourceBottomRightY=dimMinusThree-3):(bottomRightX=topRight.X-topLeft.X+bottomLeft.X,bottomRightY=topRight.Y-topLeft.Y+bottomLeft.Y,sourceBottomRightX=sourceBottomRightY=dimMinusThree);var transform=PerspectiveTransform.quadrilateralToQuadrilateral(3.5,3.5,dimMinusThree,3.5,sourceBottomRightX,sourceBottomRightY,3.5,dimMinusThree,topLeft.X,topLeft.Y,topRight.X,topRight.Y,bottomRightX,bottomRightY,bottomLeft.X,bottomLeft.Y);return transform},this.sampleGrid=function(image,transform,dimension){var sampler=GridSampler;return sampler.sampleGrid3(image,dimension,transform)},this.processFinderPatternInfo=function(info){var topLeft=info.TopLeft,topRight=info.TopRight,bottomLeft=info.BottomLeft,moduleSize=this.calculateModuleSize(topLeft,topRight,bottomLeft);if(1>moduleSize)throw"Error";var dimension=this.computeDimension(topLeft,topRight,bottomLeft,moduleSize),provisionalVersion=Version.getProvisionalVersionForDimension(dimension),modulesBetweenFPCenters=provisionalVersion.DimensionForVersion-7,alignmentPattern=null;if(provisionalVersion.AlignmentPatternCenters.length>0)for(var bottomRightX=topRight.X-topLeft.X+bottomLeft.X,bottomRightY=topRight.Y-topLeft.Y+bottomLeft.Y,correctionToTopLeft=1-3/modulesBetweenFPCenters,estAlignmentX=Math.floor(topLeft.X+correctionToTopLeft*(bottomRightX-topLeft.X)),estAlignmentY=Math.floor(topLeft.Y+correctionToTopLeft*(bottomRightY-topLeft.Y)),i=4;16>=i;i<<=1){alignmentPattern=this.findAlignmentInRegion(moduleSize,estAlignmentX,estAlignmentY,i);break}var points,transform=this.createTransform(topLeft,topRight,bottomLeft,alignmentPattern,dimension),bits=this.sampleGrid(this.image,transform,dimension);return points=null==alignmentPattern?new Array(bottomLeft,topLeft,topRight):new Array(bottomLeft,topLeft,topRight,alignmentPattern),new DetectorResult(bits,points)},this.detect=function(){var info=(new FinderPatternFinder).findFinderPattern(this.image);return this.processFinderPatternInfo(info)}}function FormatInformation(formatInfo){this.errorCorrectionLevel=ErrorCorrectionLevel.forBits(formatInfo>>3&3),this.dataMask=7&formatInfo,this.__defineGetter__("ErrorCorrectionLevel",function(){return this.errorCorrectionLevel}),this.__defineGetter__("DataMask",function(){return this.dataMask}),this.GetHashCode=function(){return this.errorCorrectionLevel.ordinal()<<3|dataMask},this.Equals=function(o){var other=o;return this.errorCorrectionLevel==other.errorCorrectionLevel&&this.dataMask==other.dataMask}}function ErrorCorrectionLevel(ordinal,bits,name){this.ordinal_Renamed_Field=ordinal,this.bits=bits,this.name=name,this.__defineGetter__("Bits",function(){return this.bits}),this.__defineGetter__("Name",function(){return this.name}),this.ordinal=function(){return this.ordinal_Renamed_Field}}function BitMatrix(width,height){if(height||(height=width),1>width||1>height)throw"Both dimensions must be greater than 0";this.width=width,this.height=height;var rowSize=width>>5;0!=(31&width)&&rowSize++,this.rowSize=rowSize,this.bits=new Array(rowSize*height);for(var i=0;i<this.bits.length;i++)this.bits[i]=0;this.__defineGetter__("Width",function(){return this.width}),this.__defineGetter__("Height",function(){return this.height}),this.__defineGetter__("Dimension",function(){if(this.width!=this.height)throw"Can't call getDimension() on a non-square matrix";return this.width}),this.get_Renamed=function(x,y){var offset=y*this.rowSize+(x>>5);return 0!=(1&URShift(this.bits[offset],31&x))},this.set_Renamed=function(x,y){var offset=y*this.rowSize+(x>>5);this.bits[offset]|=1<<(31&x)},this.flip=function(x,y){var offset=y*this.rowSize+(x>>5);this.bits[offset]^=1<<(31&x)},this.clear=function(){for(var max=this.bits.length,i=0;max>i;i++)this.bits[i]=0},this.setRegion=function(left,top,width,height){if(0>top||0>left)throw"Left and top must be nonnegative";if(1>height||1>width)throw"Height and width must be at least 1";var right=left+width,bottom=top+height;if(bottom>this.height||right>this.width)throw"The region must fit inside the matrix";for(var y=top;bottom>y;y++)for(var offset=y*this.rowSize,x=left;right>x;x++)this.bits[offset+(x>>5)]|=1<<(31&x)}}function DataBlock(numDataCodewords,codewords){this.numDataCodewords=numDataCodewords,this.codewords=codewords,this.__defineGetter__("NumDataCodewords",function(){return this.numDataCodewords}),this.__defineGetter__("Codewords",function(){return this.codewords})}function BitMatrixParser(bitMatrix){var dimension=bitMatrix.Dimension;if(21>dimension||1!=(3&dimension))throw"Error BitMatrixParser";this.bitMatrix=bitMatrix,this.parsedVersion=null,this.parsedFormatInfo=null,this.copyBit=function(i,j,versionBits){return this.bitMatrix.get_Renamed(i,j)?versionBits<<1|1:versionBits<<1},this.readFormatInformation=function(){if(null!=this.parsedFormatInfo)return this.parsedFormatInfo;for(var formatInfoBits=0,i=0;6>i;i++)formatInfoBits=this.copyBit(i,8,formatInfoBits);formatInfoBits=this.copyBit(7,8,formatInfoBits),formatInfoBits=this.copyBit(8,8,formatInfoBits),formatInfoBits=this.copyBit(8,7,formatInfoBits);for(var j=5;j>=0;j--)formatInfoBits=this.copyBit(8,j,formatInfoBits);if(this.parsedFormatInfo=FormatInformation.decodeFormatInformation(formatInfoBits),null!=this.parsedFormatInfo)return this.parsedFormatInfo;var dimension=this.bitMatrix.Dimension;formatInfoBits=0;for(var iMin=dimension-8,i=dimension-1;i>=iMin;i--)formatInfoBits=this.copyBit(i,8,formatInfoBits);for(var j=dimension-7;dimension>j;j++)formatInfoBits=this.copyBit(8,j,formatInfoBits);if(this.parsedFormatInfo=FormatInformation.decodeFormatInformation(formatInfoBits),null!=this.parsedFormatInfo)return this.parsedFormatInfo;throw"Error readFormatInformation"},this.readVersion=function(){if(null!=this.parsedVersion)return this.parsedVersion;var dimension=this.bitMatrix.Dimension,provisionalVersion=dimension-17>>2;if(6>=provisionalVersion)return Version.getVersionForNumber(provisionalVersion);for(var versionBits=0,ijMin=dimension-11,j=5;j>=0;j--)for(var i=dimension-9;i>=ijMin;i--)versionBits=this.copyBit(i,j,versionBits);if(this.parsedVersion=Version.decodeVersionInformation(versionBits),null!=this.parsedVersion&&this.parsedVersion.DimensionForVersion==dimension)return this.parsedVersion;versionBits=0;for(var i=5;i>=0;i--)for(var j=dimension-9;j>=ijMin;j--)versionBits=this.copyBit(i,j,versionBits);if(this.parsedVersion=Version.decodeVersionInformation(versionBits),null!=this.parsedVersion&&this.parsedVersion.DimensionForVersion==dimension)return this.parsedVersion;throw"Error readVersion"},this.readCodewords=function(){var formatInfo=this.readFormatInformation(),version=this.readVersion(),dataMask=DataMask.forReference(formatInfo.DataMask),dimension=this.bitMatrix.Dimension;dataMask.unmaskBitMatrix(this.bitMatrix,dimension);for(var functionPattern=version.buildFunctionPattern(),readingUp=!0,result=new Array(version.TotalCodewords),resultOffset=0,currentByte=0,bitsRead=0,j=dimension-1;j>0;j-=2){6==j&&j--;for(var count=0;dimension>count;count++)for(var i=readingUp?dimension-1-count:count,col=0;2>col;col++)functionPattern.get_Renamed(j-col,i)||(bitsRead++,currentByte<<=1,this.bitMatrix.get_Renamed(j-col,i)&&(currentByte|=1),8==bitsRead&&(result[resultOffset++]=currentByte,bitsRead=0,currentByte=0));readingUp^=!0}if(resultOffset!=version.TotalCodewords)throw"Error readCodewords";return result}}function DataMask000(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(i+j&1)}}function DataMask001(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(1&i)}}function DataMask010(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return j%3==0}}function DataMask011(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return(i+j)%3==0}}function DataMask100(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(URShift(i,1)+j/3&1)}}function DataMask101(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){var temp=i*j;return(1&temp)+temp%3==0}}function DataMask110(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){var temp=i*j;return 0==((1&temp)+temp%3&1)}}function DataMask111(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==((i+j&1)+i*j%3&1)}}function ReedSolomonDecoder(field){this.field=field,this.decode=function(received,twoS){for(var poly=new GF256Poly(this.field,received),syndromeCoefficients=new Array(twoS),i=0;i<syndromeCoefficients.length;i++)syndromeCoefficients[i]=0;for(var dataMatrix=!1,noError=!0,i=0;twoS>i;i++){var eval=poly.evaluateAt(this.field.exp(dataMatrix?i+1:i));syndromeCoefficients[syndromeCoefficients.length-1-i]=eval,0!=eval&&(noError=!1)}if(!noError)for(var syndrome=new GF256Poly(this.field,syndromeCoefficients),sigmaOmega=this.runEuclideanAlgorithm(this.field.buildMonomial(twoS,1),syndrome,twoS),sigma=sigmaOmega[0],omega=sigmaOmega[1],errorLocations=this.findErrorLocations(sigma),errorMagnitudes=this.findErrorMagnitudes(omega,errorLocations,dataMatrix),i=0;i<errorLocations.length;i++){var position=received.length-1-this.field.log(errorLocations[i]);if(0>position)throw"ReedSolomonException Bad error location";received[position]=GF256.addOrSubtract(received[position],errorMagnitudes[i])}},this.runEuclideanAlgorithm=function(a,b,R){if(a.Degree<b.Degree){var temp=a;a=b,b=temp}for(var rLast=a,r=b,sLast=this.field.One,s=this.field.Zero,tLast=this.field.Zero,t=this.field.One;r.Degree>=Math.floor(R/2);){var rLastLast=rLast,sLastLast=sLast,tLastLast=tLast;if(rLast=r,sLast=s,tLast=t,rLast.Zero)throw"r_{i-1} was zero";r=rLastLast;for(var q=this.field.Zero,denominatorLeadingTerm=rLast.getCoefficient(rLast.Degree),dltInverse=this.field.inverse(denominatorLeadingTerm);r.Degree>=rLast.Degree&&!r.Zero;){var degreeDiff=r.Degree-rLast.Degree,scale=this.field.multiply(r.getCoefficient(r.Degree),dltInverse);q=q.addOrSubtract(this.field.buildMonomial(degreeDiff,scale)),r=r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff,scale))}s=q.multiply1(sLast).addOrSubtract(sLastLast),t=q.multiply1(tLast).addOrSubtract(tLastLast)}var sigmaTildeAtZero=t.getCoefficient(0);if(0==sigmaTildeAtZero)throw"ReedSolomonException sigmaTilde(0) was zero";var inverse=this.field.inverse(sigmaTildeAtZero),sigma=t.multiply2(inverse),omega=r.multiply2(inverse);return new Array(sigma,omega)},this.findErrorLocations=function(errorLocator){var numErrors=errorLocator.Degree;if(1==numErrors)return new Array(errorLocator.getCoefficient(1));for(var result=new Array(numErrors),e=0,i=1;256>i&&numErrors>e;i++)0==errorLocator.evaluateAt(i)&&(result[e]=this.field.inverse(i),e++);if(e!=numErrors)throw"Error locator degree does not match number of roots";return result},this.findErrorMagnitudes=function(errorEvaluator,errorLocations,dataMatrix){for(var s=errorLocations.length,result=new Array(s),i=0;s>i;i++){for(var xiInverse=this.field.inverse(errorLocations[i]),denominator=1,j=0;s>j;j++)i!=j&&(denominator=this.field.multiply(denominator,GF256.addOrSubtract(1,this.field.multiply(errorLocations[j],xiInverse))));result[i]=this.field.multiply(errorEvaluator.evaluateAt(xiInverse),this.field.inverse(denominator)),dataMatrix&&(result[i]=this.field.multiply(result[i],xiInverse))}return result}}function GF256Poly(field,coefficients){if(null==coefficients||0==coefficients.length)throw"System.ArgumentException";this.field=field;var coefficientsLength=coefficients.length;if(coefficientsLength>1&&0==coefficients[0]){for(var firstNonZero=1;coefficientsLength>firstNonZero&&0==coefficients[firstNonZero];)firstNonZero++;if(firstNonZero==coefficientsLength)this.coefficients=field.Zero.coefficients;else{this.coefficients=new Array(coefficientsLength-firstNonZero);for(var i=0;i<this.coefficients.length;i++)this.coefficients[i]=0;for(var ci=0;ci<this.coefficients.length;ci++)this.coefficients[ci]=coefficients[firstNonZero+ci]}}else this.coefficients=coefficients;this.__defineGetter__("Zero",function(){return 0==this.coefficients[0]}),this.__defineGetter__("Degree",function(){return this.coefficients.length-1}),this.__defineGetter__("Coefficients",function(){return this.coefficients}),this.getCoefficient=function(degree){return this.coefficients[this.coefficients.length-1-degree]},this.evaluateAt=function(a){if(0==a)return this.getCoefficient(0);var size=this.coefficients.length;if(1==a){for(var result=0,i=0;size>i;i++)result=GF256.addOrSubtract(result,this.coefficients[i]);return result}for(var result2=this.coefficients[0],i=1;size>i;i++)result2=GF256.addOrSubtract(this.field.multiply(a,result2),this.coefficients[i]);return result2},this.addOrSubtract=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(this.Zero)return other;if(other.Zero)return this;var smallerCoefficients=this.coefficients,largerCoefficients=other.coefficients;if(smallerCoefficients.length>largerCoefficients.length){var temp=smallerCoefficients;smallerCoefficients=largerCoefficients,largerCoefficients=temp}for(var sumDiff=new Array(largerCoefficients.length),lengthDiff=largerCoefficients.length-smallerCoefficients.length,ci=0;lengthDiff>ci;ci++)sumDiff[ci]=largerCoefficients[ci];for(var i=lengthDiff;i<largerCoefficients.length;i++)sumDiff[i]=GF256.addOrSubtract(smallerCoefficients[i-lengthDiff],largerCoefficients[i]);return new GF256Poly(field,sumDiff)},this.multiply1=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(this.Zero||other.Zero)return this.field.Zero;for(var aCoefficients=this.coefficients,aLength=aCoefficients.length,bCoefficients=other.coefficients,bLength=bCoefficients.length,product=new Array(aLength+bLength-1),i=0;aLength>i;i++)for(var aCoeff=aCoefficients[i],j=0;bLength>j;j++)product[i+j]=GF256.addOrSubtract(product[i+j],this.field.multiply(aCoeff,bCoefficients[j]));return new GF256Poly(this.field,product)},this.multiply2=function(scalar){if(0==scalar)return this.field.Zero;if(1==scalar)return this;for(var size=this.coefficients.length,product=new Array(size),i=0;size>i;i++)product[i]=this.field.multiply(this.coefficients[i],scalar);return new GF256Poly(this.field,product)},this.multiplyByMonomial=function(degree,coefficient){if(0>degree)throw"System.ArgumentException";if(0==coefficient)return this.field.Zero;for(var size=this.coefficients.length,product=new Array(size+degree),i=0;i<product.length;i++)product[i]=0;for(var i=0;size>i;i++)product[i]=this.field.multiply(this.coefficients[i],coefficient);return new GF256Poly(this.field,product)},this.divide=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(other.Zero)throw"Divide by 0";for(var quotient=this.field.Zero,remainder=this,denominatorLeadingTerm=other.getCoefficient(other.Degree),inverseDenominatorLeadingTerm=this.field.inverse(denominatorLeadingTerm);remainder.Degree>=other.Degree&&!remainder.Zero;){
    var degreeDifference=remainder.Degree-other.Degree,scale=this.field.multiply(remainder.getCoefficient(remainder.Degree),inverseDenominatorLeadingTerm),term=other.multiplyByMonomial(degreeDifference,scale),iterationQuotient=this.field.buildMonomial(degreeDifference,scale);quotient=quotient.addOrSubtract(iterationQuotient),remainder=remainder.addOrSubtract(term)}return new Array(quotient,remainder)}}function GF256(primitive){this.expTable=new Array(256),this.logTable=new Array(256);for(var x=1,i=0;256>i;i++)this.expTable[i]=x,x<<=1,x>=256&&(x^=primitive);for(var i=0;255>i;i++)this.logTable[this.expTable[i]]=i;var at0=new Array(1);at0[0]=0,this.zero=new GF256Poly(this,new Array(at0));var at1=new Array(1);at1[0]=1,this.one=new GF256Poly(this,new Array(at1)),this.__defineGetter__("Zero",function(){return this.zero}),this.__defineGetter__("One",function(){return this.one}),this.buildMonomial=function(degree,coefficient){if(0>degree)throw"System.ArgumentException";if(0==coefficient)return zero;for(var coefficients=new Array(degree+1),i=0;i<coefficients.length;i++)coefficients[i]=0;return coefficients[0]=coefficient,new GF256Poly(this,coefficients)},this.exp=function(a){return this.expTable[a]},this.log=function(a){if(0==a)throw"System.ArgumentException";return this.logTable[a]},this.inverse=function(a){if(0==a)throw"System.ArithmeticException";return this.expTable[255-this.logTable[a]]},this.multiply=function(a,b){return 0==a||0==b?0:1==a?b:1==b?a:this.expTable[(this.logTable[a]+this.logTable[b])%255]}}function URShift(number,bits){return number>=0?number>>bits:(number>>bits)+(2<<~bits)}function FinderPattern(posX,posY,estimatedModuleSize){this.x=posX,this.y=posY,this.count=1,this.estimatedModuleSize=estimatedModuleSize,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return this.x}),this.__defineGetter__("Y",function(){return this.y}),this.incrementCount=function(){this.count++},this.aboutEquals=function(moduleSize,i,j){if(Math.abs(i-this.y)<=moduleSize&&Math.abs(j-this.x)<=moduleSize){var moduleSizeDiff=Math.abs(moduleSize-this.estimatedModuleSize);return 1>=moduleSizeDiff||moduleSizeDiff/this.estimatedModuleSize<=1}return!1}}function FinderPatternInfo(patternCenters){this.bottomLeft=patternCenters[0],this.topLeft=patternCenters[1],this.topRight=patternCenters[2],this.__defineGetter__("BottomLeft",function(){return this.bottomLeft}),this.__defineGetter__("TopLeft",function(){return this.topLeft}),this.__defineGetter__("TopRight",function(){return this.topRight})}function FinderPatternFinder(){this.image=null,this.possibleCenters=[],this.hasSkipped=!1,this.crossCheckStateCount=new Array(0,0,0,0,0),this.resultPointCallback=null,this.__defineGetter__("CrossCheckStateCount",function(){return this.crossCheckStateCount[0]=0,this.crossCheckStateCount[1]=0,this.crossCheckStateCount[2]=0,this.crossCheckStateCount[3]=0,this.crossCheckStateCount[4]=0,this.crossCheckStateCount}),this.foundPatternCross=function(stateCount){for(var totalModuleSize=0,i=0;5>i;i++){var count=stateCount[i];if(0==count)return!1;totalModuleSize+=count}if(7>totalModuleSize)return!1;var moduleSize=Math.floor((totalModuleSize<<INTEGER_MATH_SHIFT)/7),maxVariance=Math.floor(moduleSize/2);return Math.abs(moduleSize-(stateCount[0]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(moduleSize-(stateCount[1]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(3*moduleSize-(stateCount[2]<<INTEGER_MATH_SHIFT))<3*maxVariance&&Math.abs(moduleSize-(stateCount[3]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(moduleSize-(stateCount[4]<<INTEGER_MATH_SHIFT))<maxVariance},this.centerFromEnd=function(stateCount,end){return end-stateCount[4]-stateCount[3]-stateCount[2]/2},this.crossCheckVertical=function(startI,centerJ,maxCount,originalStateCountTotal){for(var image=this.image,maxI=qrcode.height,stateCount=this.CrossCheckStateCount,i=startI;i>=0&&image[centerJ+i*qrcode.width];)stateCount[2]++,i--;if(0>i)return NaN;for(;i>=0&&!image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i--;if(0>i||stateCount[1]>maxCount)return NaN;for(;i>=0&&image[centerJ+i*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,i--;if(stateCount[0]>maxCount)return NaN;for(i=startI+1;maxI>i&&image[centerJ+i*qrcode.width];)stateCount[2]++,i++;if(i==maxI)return NaN;for(;maxI>i&&!image[centerJ+i*qrcode.width]&&stateCount[3]<maxCount;)stateCount[3]++,i++;if(i==maxI||stateCount[3]>=maxCount)return NaN;for(;maxI>i&&image[centerJ+i*qrcode.width]&&stateCount[4]<maxCount;)stateCount[4]++,i++;if(stateCount[4]>=maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=2*originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,i):NaN},this.crossCheckHorizontal=function(startJ,centerI,maxCount,originalStateCountTotal){for(var image=this.image,maxJ=qrcode.width,stateCount=this.CrossCheckStateCount,j=startJ;j>=0&&image[j+centerI*qrcode.width];)stateCount[2]++,j--;if(0>j)return NaN;for(;j>=0&&!image[j+centerI*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,j--;if(0>j||stateCount[1]>maxCount)return NaN;for(;j>=0&&image[j+centerI*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,j--;if(stateCount[0]>maxCount)return NaN;for(j=startJ+1;maxJ>j&&image[j+centerI*qrcode.width];)stateCount[2]++,j++;if(j==maxJ)return NaN;for(;maxJ>j&&!image[j+centerI*qrcode.width]&&stateCount[3]<maxCount;)stateCount[3]++,j++;if(j==maxJ||stateCount[3]>=maxCount)return NaN;for(;maxJ>j&&image[j+centerI*qrcode.width]&&stateCount[4]<maxCount;)stateCount[4]++,j++;if(stateCount[4]>=maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,j):NaN},this.handlePossibleCenter=function(stateCount,i,j){var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4],centerJ=this.centerFromEnd(stateCount,j),centerI=this.crossCheckVertical(i,Math.floor(centerJ),stateCount[2],stateCountTotal);if(!isNaN(centerI)&&(centerJ=this.crossCheckHorizontal(Math.floor(centerJ),Math.floor(centerI),stateCount[2],stateCountTotal),!isNaN(centerJ))){for(var estimatedModuleSize=stateCountTotal/7,found=!1,max=this.possibleCenters.length,index=0;max>index;index++){var center=this.possibleCenters[index];if(center.aboutEquals(estimatedModuleSize,centerI,centerJ)){center.incrementCount(),found=!0;break}}if(!found){var point=new FinderPattern(centerJ,centerI,estimatedModuleSize);this.possibleCenters.push(point),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(point)}return!0}return!1},this.selectBestPatterns=function(){var startSize=this.possibleCenters.length;if(3>startSize)throw"Couldn't find enough finder patterns";if(startSize>3){for(var totalModuleSize=0,i=0;startSize>i;i++)totalModuleSize+=this.possibleCenters[i].EstimatedModuleSize;for(var average=totalModuleSize/startSize,i=0;i<this.possibleCenters.length&&this.possibleCenters.length>3;i++){var pattern=this.possibleCenters[i];Math.abs(pattern.EstimatedModuleSize-average)>.2*average&&(this.possibleCenters.remove(i),i--)}}return this.possibleCenters.Count>3,new Array(this.possibleCenters[0],this.possibleCenters[1],this.possibleCenters[2])},this.findRowSkip=function(){var max=this.possibleCenters.length;if(1>=max)return 0;for(var firstConfirmedCenter=null,i=0;max>i;i++){var center=this.possibleCenters[i];if(center.Count>=CENTER_QUORUM){if(null!=firstConfirmedCenter)return this.hasSkipped=!0,Math.floor((Math.abs(firstConfirmedCenter.X-center.X)-Math.abs(firstConfirmedCenter.Y-center.Y))/2);firstConfirmedCenter=center}}return 0},this.haveMultiplyConfirmedCenters=function(){for(var confirmedCount=0,totalModuleSize=0,max=this.possibleCenters.length,i=0;max>i;i++){var pattern=this.possibleCenters[i];pattern.Count>=CENTER_QUORUM&&(confirmedCount++,totalModuleSize+=pattern.EstimatedModuleSize)}if(3>confirmedCount)return!1;for(var average=totalModuleSize/max,totalDeviation=0,i=0;max>i;i++)pattern=this.possibleCenters[i],totalDeviation+=Math.abs(pattern.EstimatedModuleSize-average);return.05*totalModuleSize>=totalDeviation},this.findFinderPattern=function(image){var tryHarder=!1;this.image=image;var maxI=qrcode.height,maxJ=qrcode.width,iSkip=Math.floor(3*maxI/(4*MAX_MODULES));(MIN_SKIP>iSkip||tryHarder)&&(iSkip=MIN_SKIP);for(var done=!1,stateCount=new Array(5),i=iSkip-1;maxI>i&&!done;i+=iSkip){stateCount[0]=0,stateCount[1]=0,stateCount[2]=0,stateCount[3]=0,stateCount[4]=0;for(var currentState=0,j=0;maxJ>j;j++)if(image[j+i*qrcode.width])1==(1&currentState)&&currentState++,stateCount[currentState]++;else if(0==(1&currentState))if(4==currentState)if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,j);if(confirmed)if(iSkip=2,this.hasSkipped)done=this.haveMultiplyConfirmedCenters();else{var rowSkip=this.findRowSkip();rowSkip>stateCount[2]&&(i+=rowSkip-stateCount[2]-iSkip,j=maxJ-1)}else{do j++;while(maxJ>j&&!image[j+i*qrcode.width]);j--}currentState=0,stateCount[0]=0,stateCount[1]=0,stateCount[2]=0,stateCount[3]=0,stateCount[4]=0}else stateCount[0]=stateCount[2],stateCount[1]=stateCount[3],stateCount[2]=stateCount[4],stateCount[3]=1,stateCount[4]=0,currentState=3;else stateCount[++currentState]++;else stateCount[currentState]++;if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,maxJ);confirmed&&(iSkip=stateCount[0],this.hasSkipped&&(done=haveMultiplyConfirmedCenters()))}}var patternInfo=this.selectBestPatterns();return qrcode.orderBestPatterns(patternInfo),new FinderPatternInfo(patternInfo)}}function AlignmentPattern(posX,posY,estimatedModuleSize){this.x=posX,this.y=posY,this.count=1,this.estimatedModuleSize=estimatedModuleSize,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return Math.floor(this.x)}),this.__defineGetter__("Y",function(){return Math.floor(this.y)}),this.incrementCount=function(){this.count++},this.aboutEquals=function(moduleSize,i,j){if(Math.abs(i-this.y)<=moduleSize&&Math.abs(j-this.x)<=moduleSize){var moduleSizeDiff=Math.abs(moduleSize-this.estimatedModuleSize);return 1>=moduleSizeDiff||moduleSizeDiff/this.estimatedModuleSize<=1}return!1}}function AlignmentPatternFinder(image,startX,startY,width,height,moduleSize,resultPointCallback){this.image=image,this.possibleCenters=new Array,this.startX=startX,this.startY=startY,this.width=width,this.height=height,this.moduleSize=moduleSize,this.crossCheckStateCount=new Array(0,0,0),this.resultPointCallback=resultPointCallback,this.centerFromEnd=function(stateCount,end){return end-stateCount[2]-stateCount[1]/2},this.foundPatternCross=function(stateCount){for(var moduleSize=this.moduleSize,maxVariance=moduleSize/2,i=0;3>i;i++)if(Math.abs(moduleSize-stateCount[i])>=maxVariance)return!1;return!0},this.crossCheckVertical=function(startI,centerJ,maxCount,originalStateCountTotal){var image=this.image,maxI=qrcode.height,stateCount=this.crossCheckStateCount;stateCount[0]=0,stateCount[1]=0,stateCount[2]=0;for(var i=startI;i>=0&&image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i--;if(0>i||stateCount[1]>maxCount)return NaN;for(;i>=0&&!image[centerJ+i*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,i--;if(stateCount[0]>maxCount)return NaN;for(i=startI+1;maxI>i&&image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i++;if(i==maxI||stateCount[1]>maxCount)return NaN;for(;maxI>i&&!image[centerJ+i*qrcode.width]&&stateCount[2]<=maxCount;)stateCount[2]++,i++;if(stateCount[2]>maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=2*originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,i):NaN},this.handlePossibleCenter=function(stateCount,i,j){var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2],centerJ=this.centerFromEnd(stateCount,j),centerI=this.crossCheckVertical(i,Math.floor(centerJ),2*stateCount[1],stateCountTotal);if(!isNaN(centerI)){for(var estimatedModuleSize=(stateCount[0]+stateCount[1]+stateCount[2])/3,max=this.possibleCenters.length,index=0;max>index;index++){var center=this.possibleCenters[index];if(center.aboutEquals(estimatedModuleSize,centerI,centerJ))return new AlignmentPattern(centerJ,centerI,estimatedModuleSize)}var point=new AlignmentPattern(centerJ,centerI,estimatedModuleSize);this.possibleCenters.push(point),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(point)}return null},this.find=function(){for(var startX=this.startX,height=this.height,maxJ=startX+width,middleI=startY+(height>>1),stateCount=new Array(0,0,0),iGen=0;height>iGen;iGen++){var i=middleI+(0==(1&iGen)?iGen+1>>1:-(iGen+1>>1));stateCount[0]=0,stateCount[1]=0,stateCount[2]=0;for(var j=startX;maxJ>j&&!image[j+qrcode.width*i];)j++;for(var currentState=0;maxJ>j;){if(image[j+i*qrcode.width])if(1==currentState)stateCount[currentState]++;else if(2==currentState){if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,j);if(null!=confirmed)return confirmed}stateCount[0]=stateCount[2],stateCount[1]=1,stateCount[2]=0,currentState=1}else stateCount[++currentState]++;else 1==currentState&&currentState++,stateCount[currentState]++;j++}if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,maxJ);if(null!=confirmed)return confirmed}}if(0!=this.possibleCenters.length)return this.possibleCenters[0];throw"Couldn't find enough alignment patterns"}}function QRCodeDataBlockReader(blocks,version,numErrorCorrectionCode){this.blockPointer=0,this.bitPointer=7,this.dataLength=0,this.blocks=blocks,this.numErrorCorrectionCode=numErrorCorrectionCode,9>=version?this.dataLengthMode=0:version>=10&&26>=version?this.dataLengthMode=1:version>=27&&40>=version&&(this.dataLengthMode=2),this.getNextBits=function(numBits){var bits=0;if(numBits<this.bitPointer+1){for(var mask=0,i=0;numBits>i;i++)mask+=1<<i;return mask<<=this.bitPointer-numBits+1,bits=(this.blocks[this.blockPointer]&mask)>>this.bitPointer-numBits+1,this.bitPointer-=numBits,bits}if(numBits<this.bitPointer+1+8){for(var mask1=0,i=0;i<this.bitPointer+1;i++)mask1+=1<<i;return bits=(this.blocks[this.blockPointer]&mask1)<<numBits-(this.bitPointer+1),this.blockPointer++,bits+=this.blocks[this.blockPointer]>>8-(numBits-(this.bitPointer+1)),this.bitPointer=this.bitPointer-numBits%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),bits}if(numBits<this.bitPointer+1+16){for(var mask1=0,mask3=0,i=0;i<this.bitPointer+1;i++)mask1+=1<<i;var bitsFirstBlock=(this.blocks[this.blockPointer]&mask1)<<numBits-(this.bitPointer+1);this.blockPointer++;var bitsSecondBlock=this.blocks[this.blockPointer]<<numBits-(this.bitPointer+1+8);this.blockPointer++;for(var i=0;i<numBits-(this.bitPointer+1+8);i++)mask3+=1<<i;mask3<<=8-(numBits-(this.bitPointer+1+8));var bitsThirdBlock=(this.blocks[this.blockPointer]&mask3)>>8-(numBits-(this.bitPointer+1+8));return bits=bitsFirstBlock+bitsSecondBlock+bitsThirdBlock,this.bitPointer=this.bitPointer-(numBits-8)%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),bits}return 0},this.NextMode=function(){return this.blockPointer>this.blocks.length-this.numErrorCorrectionCode-2?0:this.getNextBits(4)},this.getDataLength=function(modeIndicator){for(var index=0;;){if(modeIndicator>>index==1)break;index++}return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][index])},this.getRomanAndFigureString=function(dataLength){var length=dataLength,intData=0,strData="",tableRomanAndFigure=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":");do if(length>1){intData=this.getNextBits(11);var firstLetter=Math.floor(intData/45),secondLetter=intData%45;strData+=tableRomanAndFigure[firstLetter],strData+=tableRomanAndFigure[secondLetter],length-=2}else 1==length&&(intData=this.getNextBits(6),strData+=tableRomanAndFigure[intData],length-=1);while(length>0);return strData},this.getFigureString=function(dataLength){var length=dataLength,intData=0,strData="";do length>=3?(intData=this.getNextBits(10),100>intData&&(strData+="0"),10>intData&&(strData+="0"),length-=3):2==length?(intData=this.getNextBits(7),10>intData&&(strData+="0"),length-=2):1==length&&(intData=this.getNextBits(4),length-=1),strData+=intData;while(length>0);return strData},this.get8bitByteArray=function(dataLength){var length=dataLength,intData=0,output=new Array;do intData=this.getNextBits(8),output.push(intData),length--;while(length>0);return output},this.getKanjiString=function(dataLength){var length=dataLength,intData=0,unicodeString="";do{intData=getNextBits(13);var lowerByte=intData%192,higherByte=intData/192,tempWord=(higherByte<<8)+lowerByte,shiftjisWord=0;shiftjisWord=40956>=tempWord+33088?tempWord+33088:tempWord+49472,unicodeString+=String.fromCharCode(shiftjisWord),length--}while(length>0);return unicodeString},this.__defineGetter__("DataByte",function(){for(var output=new Array,MODE_NUMBER=1,MODE_ROMAN_AND_NUMBER=2,MODE_8BIT_BYTE=4,MODE_KANJI=8;;){var mode=this.NextMode();if(0==mode){if(output.length>0)break;throw"Empty data block"}if(mode!=MODE_NUMBER&&mode!=MODE_ROMAN_AND_NUMBER&&mode!=MODE_8BIT_BYTE&&mode!=MODE_KANJI)throw"Invalid mode: "+mode+" in (block:"+this.blockPointer+" bit:"+this.bitPointer+")";if(dataLength=this.getDataLength(mode),dataLength<1)throw"Invalid data length: "+dataLength;switch(mode){case MODE_NUMBER:for(var temp_str=this.getFigureString(dataLength),ta=new Array(temp_str.length),j=0;j<temp_str.length;j++)ta[j]=temp_str.charCodeAt(j);output.push(ta);break;case MODE_ROMAN_AND_NUMBER:for(var temp_str=this.getRomanAndFigureString(dataLength),ta=new Array(temp_str.length),j=0;j<temp_str.length;j++)ta[j]=temp_str.charCodeAt(j);output.push(ta);break;case MODE_8BIT_BYTE:var temp_sbyteArray3=this.get8bitByteArray(dataLength);output.push(temp_sbyteArray3);break;case MODE_KANJI:var temp_str=this.getKanjiString(dataLength);output.push(temp_str)}}return output})}GridSampler={},GridSampler.checkAndNudgePoints=function(image,points){for(var width=qrcode.width,height=qrcode.height,nudged=!0,offset=0;offset<points.Length&&nudged;offset+=2){var x=Math.floor(points[offset]),y=Math.floor(points[offset+1]);if(-1>x||x>width||-1>y||y>height)throw"Error.checkAndNudgePoints ";nudged=!1,-1==x?(points[offset]=0,nudged=!0):x==width&&(points[offset]=width-1,nudged=!0),-1==y?(points[offset+1]=0,nudged=!0):y==height&&(points[offset+1]=height-1,nudged=!0)}nudged=!0;for(var offset=points.Length-2;offset>=0&&nudged;offset-=2){var x=Math.floor(points[offset]),y=Math.floor(points[offset+1]);if(-1>x||x>width||-1>y||y>height)throw"Error.checkAndNudgePoints ";nudged=!1,-1==x?(points[offset]=0,nudged=!0):x==width&&(points[offset]=width-1,nudged=!0),-1==y?(points[offset+1]=0,nudged=!0):y==height&&(points[offset+1]=height-1,nudged=!0)}},GridSampler.sampleGrid3=function(image,dimension,transform){for(var bits=new BitMatrix(dimension),points=new Array(dimension<<1),y=0;dimension>y;y++){for(var max=points.length,iValue=y+.5,x=0;max>x;x+=2)points[x]=(x>>1)+.5,points[x+1]=iValue;transform.transformPoints1(points),GridSampler.checkAndNudgePoints(image,points);try{for(var x=0;max>x;x+=2){var xpoint=4*Math.floor(points[x])+Math.floor(points[x+1])*qrcode.width*4,bit=image[Math.floor(points[x])+qrcode.width*Math.floor(points[x+1])];qrcode.imagedata.data[xpoint]=bit?255:0,qrcode.imagedata.data[xpoint+1]=bit?255:0,qrcode.imagedata.data[xpoint+2]=0,qrcode.imagedata.data[xpoint+3]=255,bit&&bits.set_Renamed(x>>1,y)}}catch(aioobe){throw"Error.checkAndNudgePoints"}}return bits},GridSampler.sampleGridx=function(image,dimension,p1ToX,p1ToY,p2ToX,p2ToY,p3ToX,p3ToY,p4ToX,p4ToY,p1FromX,p1FromY,p2FromX,p2FromY,p3FromX,p3FromY,p4FromX,p4FromY){var transform=PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX,p1ToY,p2ToX,p2ToY,p3ToX,p3ToY,p4ToX,p4ToY,p1FromX,p1FromY,p2FromX,p2FromY,p3FromX,p3FromY,p4FromX,p4FromY);return GridSampler.sampleGrid3(image,dimension,transform)},Version.VERSION_DECODE_INFO=new Array(31892,34236,39577,42195,48118,51042,55367,58893,63784,68472,70749,76311,79154,84390,87683,92361,96236,102084,102881,110507,110734,117786,119615,126325,127568,133589,136944,141498,145311,150283,152622,158308,161089,167017),Version.VERSIONS=buildVersions(),Version.getVersionForNumber=function(versionNumber){if(1>versionNumber||versionNumber>40)throw"ArgumentException";return Version.VERSIONS[versionNumber-1]},Version.getProvisionalVersionForDimension=function(dimension){if(dimension%4!=1)throw"Error getProvisionalVersionForDimension";try{return Version.getVersionForNumber(dimension-17>>2)}catch(iae){throw"Error getVersionForNumber"}},Version.decodeVersionInformation=function(versionBits){for(var bestDifference=4294967295,bestVersion=0,i=0;i<Version.VERSION_DECODE_INFO.length;i++){var targetVersion=Version.VERSION_DECODE_INFO[i];if(targetVersion==versionBits)return this.getVersionForNumber(i+7);var bitsDifference=FormatInformation.numBitsDiffering(versionBits,targetVersion);bestDifference>bitsDifference&&(bestVersion=i+7,bestDifference=bitsDifference)}return 3>=bestDifference?this.getVersionForNumber(bestVersion):null},PerspectiveTransform.quadrilateralToQuadrilateral=function(x0,y0,x1,y1,x2,y2,x3,y3,x0p,y0p,x1p,y1p,x2p,y2p,x3p,y3p){var qToS=this.quadrilateralToSquare(x0,y0,x1,y1,x2,y2,x3,y3),sToQ=this.squareToQuadrilateral(x0p,y0p,x1p,y1p,x2p,y2p,x3p,y3p);return sToQ.times(qToS)},PerspectiveTransform.squareToQuadrilateral=function(x0,y0,x1,y1,x2,y2,x3,y3){return dy2=y3-y2,dy3=y0-y1+y2-y3,0==dy2&&0==dy3?new PerspectiveTransform(x1-x0,x2-x1,x0,y1-y0,y2-y1,y0,0,0,1):(dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,denominator=dx1*dy2-dx2*dy1,a13=(dx3*dy2-dx2*dy3)/denominator,a23=(dx1*dy3-dx3*dy1)/denominator,new PerspectiveTransform(x1-x0+a13*x1,x3-x0+a23*x3,x0,y1-y0+a13*y1,y3-y0+a23*y3,y0,a13,a23,1))},PerspectiveTransform.quadrilateralToSquare=function(x0,y0,x1,y1,x2,y2,x3,y3){return this.squareToQuadrilateral(x0,y0,x1,y1,x2,y2,x3,y3).buildAdjoint()};var FORMAT_INFO_MASK_QR=21522,FORMAT_INFO_DECODE_LOOKUP=new Array(new Array(21522,0),new Array(20773,1),new Array(24188,2),new Array(23371,3),new Array(17913,4),new Array(16590,5),new Array(20375,6),new Array(19104,7),new Array(30660,8),new Array(29427,9),new Array(32170,10),new Array(30877,11),new Array(26159,12),new Array(25368,13),new Array(27713,14),new Array(26998,15),new Array(5769,16),new Array(5054,17),new Array(7399,18),new Array(6608,19),new Array(1890,20),new Array(597,21),new Array(3340,22),new Array(2107,23),new Array(13663,24),new Array(12392,25),new Array(16177,26),new Array(14854,27),new Array(9396,28),new Array(8579,29),new Array(11994,30),new Array(11245,31)),BITS_SET_IN_HALF_BYTE=new Array(0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4);FormatInformation.numBitsDiffering=function(a,b){return a^=b,BITS_SET_IN_HALF_BYTE[15&a]+BITS_SET_IN_HALF_BYTE[15&URShift(a,4)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,8)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,12)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,16)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,20)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,24)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,28)]},FormatInformation.decodeFormatInformation=function(maskedFormatInfo){var formatInfo=FormatInformation.doDecodeFormatInformation(maskedFormatInfo);return null!=formatInfo?formatInfo:FormatInformation.doDecodeFormatInformation(maskedFormatInfo^FORMAT_INFO_MASK_QR)},FormatInformation.doDecodeFormatInformation=function(maskedFormatInfo){for(var bestDifference=4294967295,bestFormatInfo=0,i=0;i<FORMAT_INFO_DECODE_LOOKUP.length;i++){var decodeInfo=FORMAT_INFO_DECODE_LOOKUP[i],targetInfo=decodeInfo[0];if(targetInfo==maskedFormatInfo)return new FormatInformation(decodeInfo[1]);var bitsDifference=this.numBitsDiffering(maskedFormatInfo,targetInfo);bestDifference>bitsDifference&&(bestFormatInfo=decodeInfo[1],bestDifference=bitsDifference)}return 3>=bestDifference?new FormatInformation(bestFormatInfo):null},ErrorCorrectionLevel.forBits=function(bits){if(0>bits||bits>=FOR_BITS.Length)throw"ArgumentException";return FOR_BITS[bits]};var L=new ErrorCorrectionLevel(0,1,"L"),M=new ErrorCorrectionLevel(1,0,"M"),Q=new ErrorCorrectionLevel(2,3,"Q"),H=new ErrorCorrectionLevel(3,2,"H"),FOR_BITS=new Array(M,L,H,Q);DataBlock.getDataBlocks=function(rawCodewords,version,ecLevel){if(rawCodewords.length!=version.TotalCodewords)throw"ArgumentException";for(var ecBlocks=version.getECBlocksForLevel(ecLevel),totalBlocks=0,ecBlockArray=ecBlocks.getECBlocks(),i=0;i<ecBlockArray.length;i++)totalBlocks+=ecBlockArray[i].Count;for(var result=new Array(totalBlocks),numResultBlocks=0,j=0;j<ecBlockArray.length;j++)for(var ecBlock=ecBlockArray[j],i=0;i<ecBlock.Count;i++){var numDataCodewords=ecBlock.DataCodewords,numBlockCodewords=ecBlocks.ECCodewordsPerBlock+numDataCodewords;result[numResultBlocks++]=new DataBlock(numDataCodewords,new Array(numBlockCodewords))}for(var shorterBlocksTotalCodewords=result[0].codewords.length,longerBlocksStartAt=result.length-1;longerBlocksStartAt>=0;){var numCodewords=result[longerBlocksStartAt].codewords.length;if(numCodewords==shorterBlocksTotalCodewords)break;longerBlocksStartAt--}longerBlocksStartAt++;for(var shorterBlocksNumDataCodewords=shorterBlocksTotalCodewords-ecBlocks.ECCodewordsPerBlock,rawCodewordsOffset=0,i=0;shorterBlocksNumDataCodewords>i;i++)for(var j=0;numResultBlocks>j;j++)result[j].codewords[i]=rawCodewords[rawCodewordsOffset++];for(var j=longerBlocksStartAt;numResultBlocks>j;j++)result[j].codewords[shorterBlocksNumDataCodewords]=rawCodewords[rawCodewordsOffset++];for(var max=result[0].codewords.length,i=shorterBlocksNumDataCodewords;max>i;i++)for(var j=0;numResultBlocks>j;j++){var iOffset=longerBlocksStartAt>j?i:i+1;result[j].codewords[iOffset]=rawCodewords[rawCodewordsOffset++]}return result},DataMask={},DataMask.forReference=function(reference){if(0>reference||reference>7)throw"System.ArgumentException";return DataMask.DATA_MASKS[reference]},DataMask.DATA_MASKS=new Array(new DataMask000,new DataMask001,new DataMask010,new DataMask011,new DataMask100,new DataMask101,new DataMask110,new DataMask111),GF256.QR_CODE_FIELD=new GF256(285),GF256.DATA_MATRIX_FIELD=new GF256(301),GF256.addOrSubtract=function(a,b){return a^b},Decoder={},Decoder.rsDecoder=new ReedSolomonDecoder(GF256.QR_CODE_FIELD),Decoder.correctErrors=function(codewordBytes,numDataCodewords){for(var numCodewords=codewordBytes.length,codewordsInts=new Array(numCodewords),i=0;numCodewords>i;i++)codewordsInts[i]=255&codewordBytes[i];var numECCodewords=codewordBytes.length-numDataCodewords;try{Decoder.rsDecoder.decode(codewordsInts,numECCodewords)}catch(rse){throw rse}for(var i=0;numDataCodewords>i;i++)codewordBytes[i]=codewordsInts[i]},Decoder.decode=function(bits){for(var parser=new BitMatrixParser(bits),version=parser.readVersion(),ecLevel=parser.readFormatInformation().ErrorCorrectionLevel,codewords=parser.readCodewords(),dataBlocks=DataBlock.getDataBlocks(codewords,version,ecLevel),totalBytes=0,i=0;i<dataBlocks.Length;i++)totalBytes+=dataBlocks[i].NumDataCodewords;for(var resultBytes=new Array(totalBytes),resultOffset=0,j=0;j<dataBlocks.length;j++){var dataBlock=dataBlocks[j],codewordBytes=dataBlock.Codewords,numDataCodewords=dataBlock.NumDataCodewords;Decoder.correctErrors(codewordBytes,numDataCodewords);for(var i=0;numDataCodewords>i;i++)resultBytes[resultOffset++]=codewordBytes[i]}var reader=new QRCodeDataBlockReader(resultBytes,version.VersionNumber,ecLevel.Bits);return reader},qrcode={},qrcode.imagedata=null,qrcode.width=0,qrcode.height=0,qrcode.qrCodeSymbol=null,qrcode.debug=!1,qrcode.sizeOfDataLengthInfo=[[10,9,8,8],[12,11,16,10],[14,13,16,12]],qrcode.callback=null,qrcode.decode=function(src){if(0==arguments.length){var canvas_qr=document.getElementById("qr-canvas"),context=canvas_qr.getContext("2d");return qrcode.width=canvas_qr.width,qrcode.height=canvas_qr.height,qrcode.imagedata=context.getImageData(0,0,qrcode.width,qrcode.height),qrcode.result=qrcode.process(context),null!=qrcode.callback&&qrcode.callback(qrcode.result),qrcode.result}var image=new Image;image.onload=function(){var canvas_qr=document.createElement("canvas"),context=canvas_qr.getContext("2d"),canvas_out=document.getElementById("out-canvas");if(null!=canvas_out){var outctx=canvas_out.getContext("2d");outctx.clearRect(0,0,320,240),outctx.drawImage(image,0,0,320,240)}canvas_qr.width=image.width,canvas_qr.height=image.height,context.drawImage(image,0,0),qrcode.width=image.width,qrcode.height=image.height;try{qrcode.imagedata=context.getImageData(0,0,image.width,image.height)}catch(e){return qrcode.result="Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!",void(null!=qrcode.callback&&qrcode.callback(qrcode.result))}try{qrcode.result=qrcode.process(context)}catch(e){console.log(e),qrcode.result="error decoding QR Code"}null!=qrcode.callback&&qrcode.callback(qrcode.result)},image.src=src},qrcode.decode_utf8=function(s){return decodeURIComponent(escape(s))},qrcode.process=function(ctx){var start=(new Date).getTime(),image=qrcode.grayScaleToBitmap(qrcode.grayscale());if(qrcode.debug){for(var y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var point=4*x+y*qrcode.width*4;qrcode.imagedata.data[point]=(image[x+y*qrcode.width],0),qrcode.imagedata.data[point+1]=(image[x+y*qrcode.width],0),qrcode.imagedata.data[point+2]=image[x+y*qrcode.width]?255:0}ctx.putImageData(qrcode.imagedata,0,0)}var detector=new Detector(image),qRCodeMatrix=detector.detect();qrcode.debug&&ctx.putImageData(qrcode.imagedata,0,0);for(var reader=Decoder.decode(qRCodeMatrix.bits),data=reader.DataByte,str="",i=0;i<data.length;i++)for(var j=0;j<data[i].length;j++)str+=String.fromCharCode(data[i][j]);var end=(new Date).getTime(),time=end-start;return console.log(time),qrcode.decode_utf8(str)},qrcode.getPixel=function(x,y){if(qrcode.width<x)throw"point error";if(qrcode.height<y)throw"point error";return point=4*x+y*qrcode.width*4,p=(33*qrcode.imagedata.data[point]+34*qrcode.imagedata.data[point+1]+33*qrcode.imagedata.data[point+2])/100,p},qrcode.binarize=function(th){for(var ret=new Array(qrcode.width*qrcode.height),y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var gray=qrcode.getPixel(x,y);ret[x+y*qrcode.width]=th>=gray?!0:!1}return ret},qrcode.getMiddleBrightnessPerArea=function(image){for(var numSqrtArea=4,areaWidth=Math.floor(qrcode.width/numSqrtArea),areaHeight=Math.floor(qrcode.height/numSqrtArea),minmax=new Array(numSqrtArea),i=0;numSqrtArea>i;i++){minmax[i]=new Array(numSqrtArea);for(var i2=0;numSqrtArea>i2;i2++)minmax[i][i2]=new Array(0,0)}for(var ay=0;numSqrtArea>ay;ay++)for(var ax=0;numSqrtArea>ax;ax++){minmax[ax][ay][0]=255;for(var dy=0;areaHeight>dy;dy++)for(var dx=0;areaWidth>dx;dx++){var target=image[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width];target<minmax[ax][ay][0]&&(minmax[ax][ay][0]=target),target>minmax[ax][ay][1]&&(minmax[ax][ay][1]=target)}}for(var middle=new Array(numSqrtArea),i3=0;numSqrtArea>i3;i3++)middle[i3]=new Array(numSqrtArea);for(var ay=0;numSqrtArea>ay;ay++)for(var ax=0;numSqrtArea>ax;ax++)middle[ax][ay]=Math.floor((minmax[ax][ay][0]+minmax[ax][ay][1])/2);return middle},qrcode.grayScaleToBitmap=function(grayScale){for(var middle=qrcode.getMiddleBrightnessPerArea(grayScale),sqrtNumArea=middle.length,areaWidth=Math.floor(qrcode.width/sqrtNumArea),areaHeight=Math.floor(qrcode.height/sqrtNumArea),bitmap=new Array(qrcode.height*qrcode.width),ay=0;sqrtNumArea>ay;ay++)for(var ax=0;sqrtNumArea>ax;ax++)for(var dy=0;areaHeight>dy;dy++)for(var dx=0;areaWidth>dx;dx++)bitmap[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width]=grayScale[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width]<middle[ax][ay]?!0:!1;
    return bitmap},qrcode.grayscale=function(){for(var ret=new Array(qrcode.width*qrcode.height),y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var gray=qrcode.getPixel(x,y);ret[x+y*qrcode.width]=gray}return ret},Array.prototype.remove=function(from,to){var rest=this.slice((to||from)+1||this.length);return this.length=0>from?this.length+from:from,this.push.apply(this,rest)};var MIN_SKIP=3,MAX_MODULES=57,INTEGER_MATH_SHIFT=8,CENTER_QUORUM=2;qrcode.orderBestPatterns=function(patterns){function distance(pattern1,pattern2){return xDiff=pattern1.X-pattern2.X,yDiff=pattern1.Y-pattern2.Y,Math.sqrt(xDiff*xDiff+yDiff*yDiff)}function crossProductZ(pointA,pointB,pointC){var bX=pointB.x,bY=pointB.y;return(pointC.x-bX)*(pointA.y-bY)-(pointC.y-bY)*(pointA.x-bX)}var pointA,pointB,pointC,zeroOneDistance=distance(patterns[0],patterns[1]),oneTwoDistance=distance(patterns[1],patterns[2]),zeroTwoDistance=distance(patterns[0],patterns[2]);if(oneTwoDistance>=zeroOneDistance&&oneTwoDistance>=zeroTwoDistance?(pointB=patterns[0],pointA=patterns[1],pointC=patterns[2]):zeroTwoDistance>=oneTwoDistance&&zeroTwoDistance>=zeroOneDistance?(pointB=patterns[1],pointA=patterns[0],pointC=patterns[2]):(pointB=patterns[2],pointA=patterns[0],pointC=patterns[1]),crossProductZ(pointA,pointB,pointC)<0){var temp=pointA;pointA=pointC,pointC=temp}patterns[0]=pointA,patterns[1]=pointB,patterns[2]=pointC};
angular.module('reg')
  .factory('AuthService', [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    'Session',
    function($http, $rootScope, $state, $window, Session) {
      var authService = {};

      function loginSuccess(data, cb, volunteer){
        // Winner winner you get a token
        if(!volunteer) {Session.create(data.token, data.user);}

        if (cb){
          cb(data.user);
        }
      }

      function loginFailure(data, cb, volunteer){
        if(!volunteer) {$state.go('home');}
        if (cb) {
          cb(data);
        }
      }

      authService.loginWithPassword = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/login', {
            email: email,
            password: password
          })
          .then(response => {
            loginSuccess(response.data, onSuccess);
          }, response => {
            loginFailure(response.data, onFailure);
          });
      };

      authService.loginWithToken = function(token, onSuccess, onFailure){
        return $http
          .post('/auth/login', {
            token: token
          })
          .then(response => {
            loginSuccess(response.data, onSuccess);
          }, response => {
            if (response.status === 400) {
              Session.destroy(loginFailure);
            }
          });
      };

      authService.logout = function(callback) {
        // Clear the session
        Session.destroy(callback);
        $state.go('home');
      };

      authService.register = function(email, password, onSuccess, onFailure ,volunteer) {
        return $http
          .post('/auth/register', {
            email: email,
            password: password,
            volunteer: volunteer,
          })
          .then(response => {
            loginSuccess(response.data, onSuccess, volunteer);
          }, response => {
            loginFailure(response.data, onFailure, volunteer);
          });
      };

      authService.verify = function(token, onSuccess, onFailure) {
        return $http
          .get('/auth/verify/' + token)
          .then(response => {
            Session.setUser(response.data);
            if (onSuccess) {
              onSuccess(response.data);
            }
          }, response => {
            if (onFailure) {
              onFailure(response.data);
            }
          });
      };

      authService.resendVerificationEmail = function(onSuccess, onFailure){
        return $http
          .post('/auth/verify/resend', {
            id: Session.getUserId()
          });
      };

      authService.sendResetEmail = function(email){
        return $http
          .post('/auth/reset', {
            email: email
          });
      };

      authService.resetPassword = function(token, pass, onSuccess, onFailure){
        return $http
          .post('/auth/reset/password', {
            token: token,
            password: pass
          })
          .then(onSuccess, onFailure);
      };

      return authService;
    }
  ]);

angular.module('reg').factory("ChallengeService", [
    "$http",
    function($http) {
      var challenges = "/api/challenges";
      var base = challenges + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(cData) {
            return $http.post(challenges + "/create", {
              cData: cData
            });
          },


        update: function(id, cData) {
            return $http.post(base + id + "/update", {
              cData: cData
            });
          },


        remove: function(id) {
            return $http.post(base + id + "/remove");
        },

        get: function(id) {
            return $http.get(base + id);
        },
        
        getAll: function() {
            return $http.get(base);
        },

        getAnswer: function(id) {
          return $http.get(base + id + "/answer");
        },

  
      };
    }
  ]);
  
angular.module('reg').factory("MarketingService", [
    "$http",
    function($http) {
      var marketing = "/api/marketing";
      var base = marketing + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        createTeam: function(teamData) {
            return $http.post(marketing + "/createTeam", {
              teamData: teamData
            });
          },
        
        getAll: function() {
            return $http.get(base);
        },

        sendFriendInvite: function(username,teammate){
          return $http.post(marketing + "/sendInvite", {
            username: username,
            teammate: teammate
          });
        }
  
      };
    }
  ]);
  
angular.module('reg') 
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
      updateEventTimes: function(start,end){
        return $http.put(base + 'eventtimes', {
          timeStart: start,
          timeEnd: end,
        });
      },
      getWhitelistedEmails: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedEmails: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },

      updateHostSchool: function(hostSchool){
        return $http.put(base + 'hostSchool', {
          hostSchool: hostSchool
        });
      },

      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
      updateAllowMinors: function(allowMinors){
        return $http.put(base + 'minors', { 
          allowMinors: allowMinors 
        });
      },
    };

  }
  ]);

angular.module('reg').factory("SolvedCTFService", [
    "$http",
    function($http) {
      var CTF = "/api/CTF";
      var base = CTF + "/";
  

      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        solve: function(challenge, user, answer, onSuccess, onFailure) {
            return $http.post(CTF + "/solve", {
                challenge: challenge, 
                user : user,
                answer : answer,
            })
            .then(response => {
              onSuccess(challenge);
            }, response => {
              onFailure(response.data);
            });
          },
        
        getAll: function() {
            return $http.get(CTF);
        },
    
      };
    }
  ]);
  
angular.module('reg').factory("TeamService", [
    "$http",
    function($http) {
      var teams = "/api/teams";
      var base = teams + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(teamData) {
            return $http.post(teams + "/create", {
              teamData: teamData
            });
        },

        getAll: function() {
          return $http.get(base);
        },

        update: function(id, cData) {
          return $http.post(base + id + "/update", {
            cData: cData
          });
        },

        join: function(id, newuser) {
          return $http.post(base + id + "/joinTeam", {
            newjoinRequest: newuser
          });
        },

        removejoin: function(id, index, user) {
          return $http.get(base + id)
          .then(team => {
            team.data.joinRequests.splice(index, 1);
            if (!(user==false)){
              $http.post(teams + "/sendRefusedTeam", {
                id: user.id,
              });
            }
            return $http.post(base + id + "/removeJoinTeam", {
              newjoinRequests: team.data.joinRequests
            });
          })
        },

        acceptMember: function(id, newuser,maxTeamSize) {
          return $http.get(base + id)
          .then(team => {

            if (team.data.members.length>=maxTeamSize){ return 'maxTeamSize' }
            $http.post(teams + "/sendAcceptedTeam", {
              id: newuser.id,
            });
            return $http.post(base + id + "/addMember", {
              newMember: newuser,
            });
          })
        },

        removemember: function(id, index, userID) {
          return $http.get(base + id)
          .then(team => {
            var removedUser = team.data.members[index]
            if (index==0){return "removingAdmin"}
            team.data.members.splice(index, 1);
            if (!userID){
              $http.post(teams + "/sendAdminRemovedTeam", {
                id: team.data.members[0].id,
                member: removedUser.name
              });  
            }else{
              $http.post(teams + "/sendRemovedTeam", {
                id: userID,
              });  
            }
            return $http.post(base + id + "/removeMember", {
              newMembers: team.data.members,
              removeduserID: removedUser.id
            });
          })
        },


        remove: function(id) {
            return $http.post(base + id + "/remove");
        },

        get: function(id) {
          return $http.get(base + id);
        },
        
        toggleCloseTeam: function(id, status) {
          return $http.post(base + id + "/toggleCloseTeam", {
            status: status
          });
        },

        toggleHideTeam: function(id, status) {
          return $http.post(base + id + "/toggleHideTeam", {
            status: status
          });
        },

        getSelectedTeams: function(text,skillsFilters) {
          return $http.get( teams + "?" + $.param({
                text: text,
                search: true,
                skillsFilters: skillsFilters ? skillsFilters : {}
              })
          );
        }, 
  


      };
    }
  ]);
  
angular.module("reg").factory("UserService", [
  "$http",
  "Session",
  function($http, Session) {
    var users = "/api/users";
    var base = users + "/";

    return {
      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function() {
        return $http.get(base + Session.getUserId());
      },

      get: function(id) {
        return $http.get(base + id);
      },

      getAll: function() {
        return $http.get(base);
      },

      getPage: function(page, size, text,statusFilters,NotstatusFilters) {
        return $http.get( users + "?" + $.param({
              text: text,
              page: page ? page : 0,
              size: size ? size : 20,
              statusFilters: statusFilters ? statusFilters : {},
              NotstatusFilters: NotstatusFilters ? NotstatusFilters : {}

            })
        );
      },

      uploadCV: function (id, files) {
        var fd = new FormData();
        
        //Take the first selected file
        fd.append("file", files[0],'cv.pdf');

        //ERROR here ... not passing file to fd

        return $http.post(base + id + '/upload/cv', fd, {
          withCredentials: true,
          headers: { 'Content-Type': undefined },
          transformRequest: angular.identity
        });
      },

      updateProfile: function(id, profile) {
        return $http.put(base + id + "/profile", {
          profile: profile
        });
      },

      updateConfirmation: function(id, confirmation) {
        return $http.put(base + id + "/confirm", {
          confirmation: confirmation
        });
      },

      updateAll: function(id, user) {
        return $http.put(base + id + "/updateall", {
          user: user
        });
      },

      declineAdmission: function(id) {
        return $http.post(base + id + "/decline");
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function() {
        return $http.get(base + "stats");
      },

      getTeamStats: function() {
        return $http.get(base + "teamStats");
      },

      updatestats: function() {
        return $http.get(base + "updatestats");
      },

      admitUser: function(id) {
        return $http.post(base + id + "/admit");
      },
      rejectUser: function(id) {
        return $http.post(base + id + "/reject");
      },
      softAdmittUser: function(id) {
        return $http.post(base + id + "/softAdmit");
      },

      updateConfirmationTime: function(id) {
        return $http.post(base + id + "/updateconfirmby");
      },

      softRejectUser: function(id) {
        return $http.post(base + id + "/softReject");
      },

      sendBasicMail: function(id , email) {
        return $http.post(base + id + "/sendBasicMail",JSON.stringify(email));
      },

      checkIn: function(id) {
        return $http.post(base + id + "/checkin");
      },

      checkOut: function(id) {
        return $http.post(base + id + "/checkout");
      },

      removeUser: function(id) {
        return $http.post(base + id + "/removeuser");
      },

      removeteamfield: function(id) {        
        return $http.post(base + id + "/removeteamfield");
      },

      makeAdmin: function(id) {
        return $http.post(base + id + "/makeadmin");
      },

      removeAdmin: function(id) {
        return $http.post(base + id + "/removeadmin");
      },

      massReject: function() {
        return $http.post(base + "massReject");
      },

      getRejectionCount: function() {
        return $http.get(base + "rejectionCount");
      },

      getLaterRejectedCount: function() {
        return $http.get(base + "laterRejectCount");
      },

      massRejectRest: function() {
        return $http.post(base + "massRejectRest");
      },

      getRestRejectionCount: function() {
        return $http.get(base + "rejectionCountRest");
      },

      reject: function(id) {
        return $http.post(base + id + "/reject");
      },

      sendLaggerEmails: function() {
        return $http.post(base + "sendlagemails");
      },

      sendRejectEmails: function() {
        return $http.post(base + "sendRejectEmails");
      },

      sendRejectEmailsRest: function() {
        return $http.post(base + "sendRejectEmailsRest");
      },

      sendRejectEmail: function(id) {
        return $http.post(base + id + "/rejectEmail");
      },

      sendPasswordResetEmail: function(email) {
        return $http.post(base + "sendResetEmail", { email: email });
      },



    };
  }
]);

angular.module('reg')
  .controller('adminChallengeCtrl',[
    '$scope',
    '$http',
    'challenge',
    'ChallengeService',
    function($scope, $http, challenge, ChallengeService){
      $scope.selectedchallenge = challenge.data;
      
      ChallengeService.getAnswer(challenge.data._id).then(response => {
        $scope.selectedchallenge.answer = response.data.answer;
      });

      $scope.togglePassword = function () { $scope.typePassword = !$scope.typePassword; };


      $scope.updateChallenge = function(){
        ChallengeService
          .update($scope.selectedchallenge._id, $scope.selectedchallenge)
          .then(response => {
            $selectedchallenge = response.data;
            swal("Updated!", "Challenge updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });  
      };

    }]);

angular.module("reg").controller("adminChallengesCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "ChallengeService",
  function($scope, $state, $stateParams, ChallengeService) {

    $scope.challenges = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary Challenge.

    function refreshPage() {
      ChallengeService.getAll().then(response => {
        $scope.challenges = response.data;
      });
    }

    refreshPage();

    $scope.goChallenge = function($event, challenge) {

      $event.stopPropagation();
      $state.go("app.admin.challenge", {
        id: challenge._id
      });
    }

    $scope.createChallenge = function() {

      swal("Write the challenge title:", {
        buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
        content: {element: "input", attributes: {placeholder: "Give this challenge a sexy name..",type: "text"} },
      })
      .then((title) => { if (!title) {return;}
        swal("Enter the challenge description:", {
          buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
          content: {element: "input", attributes: {placeholder: "Describe this challenge so that people can get the idea..",type: "text"} },
          })
        .then((description) => { if (!description) {return;}
          swal("Enter the challenge dependency (LINK):", {
            buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
            content: {element: "input", attributes: {placeholder: "http://www.example.com/Challenge42.zip",type: "text"} },
            })
          .then((dependency) => { if (!dependency) {return;}
            swal("Enter the answer:", {
              buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
              content: {element: "input", attributes: {placeholder: "shhhh this si super secret bro",type: "text"} },
              })
            .then((answer) => { if (!answer) {return;}
              swal("Enter the number of points for this challenge:", {
                buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
                content: {element: "input", attributes: {placeholder: "Points awarded to challenge solvers",type: "number"} },
                })
              .then((points) => { if (!points) {return;}
  
                cData = {
                  title:title,
                  description:description,
                  dependency:dependency,
                  answer:answer,
                  points:points,
                }
                ChallengeService.create(cData).then(response => {
                });
                refreshPage();
              });
            });
          });
        });
      });
      
    };

    $scope.removeChallenge = function($event, challenge, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to remove " + challenge.title + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove this challenge",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text: "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }

          ChallengeService.remove(challenge._id).then(response => {
            $scope.challenges[index] = response.data;
            swal(
              "Removed",
              response.data.title + " has been removed.",
              "success"
            );
          });
          refreshPage();
        });
      });
    };

  }
]);

angular.module("reg").controller("AdminMailCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "UserService",
  function($scope, $state, $stateParams, UserService) {
    $scope.pages = [];
    $scope.users = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.



    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {
      $scope.users= response.data.users;
    });

    $scope.sendEmail = function() {
      var filteredUsers = $scope.users.filter(
        u => u.verified
    );

      if ($scope.statusFilters.completedProfile) {
        filteredUsers = filteredUsers.filter(
          u => u.status.completedProfile
      )}

      if ($scope.statusFilters.admitted) {
        filteredUsers = filteredUsers.filter(
          u => u.status.admitted
      )}

      if ($scope.statusFilters.confirmed) {
        filteredUsers = filteredUsers.filter(
          u => u.status.confirmed
      )}

      if ($scope.statusFilters.declined) {
        filteredUsers = filteredUsers.filter(
          u => u.status.declined
      )}

      if ($scope.statusFilters.checkedIn) {
        filteredUsers = filteredUsers.filter(
          u => u.status.checkedIn
      )}

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send this email to ${
          filteredUsers.length
        } selected user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, send the emails"],
        dangerMode: true
      }).then(willSend => {
        email = { subject:$scope.subject , title:$scope.title, body:$scope.body }

        if (willSend) {
          if (filteredUsers.length) {
            filteredUsers.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });
            swal(
              "Sending!",
              `Sending emails to ${
                filteredUsers.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or accept 0 users!", "error");
          }
        }
      });
    };

  }
]);

angular.module("reg").controller("adminMarketingCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "MarketingService",
  function($scope, $state, $stateParams, MarketingService) {

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.




    $scope.createTeams = function(){

      if ($scope.body && $scope.event){
        swal({
          title: "Whoa, wait a minute!",
          text: `You're about to add these teams emails to the marketing database`,
          icon: "warning",
          buttons: ["Cancel", "Yes, Add teams"],
          dangerMode: true
        }).then(value => {
          if (value) {
            var teams = $scope.body.split(';');
            teams.forEach(team => {
              teamData = {
                event:$scope.event,
                members:team.replace(' ','').split(',')
              }
              MarketingService.createTeam(teamData);
            });
            swal("Added", "Teams added to database.", "success");
            $scope.body=""
          }
        });
      }
      else {
        swal("ERROR!", "All fields are required.", "error");
      }
    }


    
  }
]);

angular.module('reg')
  .controller('AdminSettingsCtrl', [
    '$scope',
    '$sce',
    'SettingsService',
    'UserService',
    function($scope, $sce, SettingsService,UserService){

      $scope.settings = {};
      SettingsService
        .getPublicSettings()
        .then(response => {
          updateSettings(response.data);
        });

      function updateSettings(settings){
        $scope.loading = false;
         // Format the dates in settings.
        settings.timeOpen = new Date(settings.timeOpen);
        settings.timeClose = new Date(settings.timeClose);
        settings.timeConfirm = new Date(settings.timeConfirm);
        settings.timeStart = new Date(settings.timeStart);
        settings.timeEnd = new Date(settings.timeEnd);

        $scope.settings = settings;
      }

      // Additional Options --------------------------------------

      $scope.updateAllowMinors = function () {
        SettingsService
          .updateAllowMinors($scope.settings.allowMinors)
          .then(response => {
            $scope.settings.allowMinors = response.data.allowMinors;
            const successText = $scope.settings.allowMinors ?
              "Minors are now allowed to register." :
              "Minors are no longer allowed to register."
            swal("Looks good!", successText, "success");
          });
      };

      // Whitelist --------------------------------------

      SettingsService
        .getWhitelistedEmails()
        .then(response => {
          $scope.whitelist = response.data.join(", ");
        });

        $scope.updateWhitelist = function(){
          SettingsService
            .updateWhitelistedEmails($scope.whitelist.replace(/ /g, '').split(','))
            .then(response => {
              swal('Whitelist updated.');
              $scope.whitelist = response.data.whitelistedEmails.join(", ");
            });
        };

      // Registration Times -----------------------------

      $scope.formatDate = function(date){
        if (!date){
          return "Invalid Date";
        }

        // Hack for timezone
        return moment(date).locale('en').format('dddd, MMMM Do YYYY, h:mm a') +
          " " + date.toTimeString().split(' ')[2];
      };

      // Take a date and remove the seconds.
      function cleanDate(date){
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }

      $scope.updateRegistrationTimes = function(){
        // Clean the dates and turn them to ms.
        var open = cleanDate($scope.settings.timeOpen).getTime();
        var close = cleanDate($scope.settings.timeClose).getTime();

        if (open < 0 || close < 0 || open === undefined || close === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (open >= close){
          swal('Oops...', 'Registration cannot open after it closes.', 'error');
          return;
        }

        SettingsService
          .updateRegistrationTimes(open, close)
          .then(response => {
            updateSettings(response.data);
            swal("Looks good!", "Registration Times Updated", "success");
          });
      };

      $scope.SuggestRegistrationTime = function (hours) {
        $scope.settings.timeClose = new Date( moment($scope.settings.timeOpen).add(hours, 'h'))
      }

      // Event Start Time -----------------------------

      $scope.updateEventTimes = function(){
        // Clean the dates and turn them to ms.
        var start = cleanDate($scope.settings.timeStart).getTime();
        var end = cleanDate($scope.settings.timeEnd).getTime();

        if (start < 0 || end < 0 || start === undefined || end === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (start >= end){
          swal('Oops...', 'Event cannot start after it ends.', 'error');
          return;
        }

        SettingsService
          .updateEventTimes(start, end)
          .then(response => {
            updateSettings(response.data);
            swal("Looks good!", "Event Times Updated", "success");
          });
      };

      $scope.SuggestStartTime = function (hours) {
        $scope.settings.timeEnd = new Date( moment($scope.settings.timeStart).add(hours, 'h'))
      }

      // Confirmation Time -----------------------------

      $scope.updateConfirmationTime = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .then(response => {
            updateSettings(response.data);
            swal("Sounds good!", "Confirmation Date Updated", "success");
          });
      };

      
      $scope.SuggestConfirmationTime = function (hours) {
        $scope.settings.timeConfirm = new Date( moment($scope.settings.timeStart).subtract(hours, 'h'))
      }

      $scope.updateConfirmationUsers = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .then(response => {
            updateSettings(response.data);
            // get all users soft admitted and update confirmation time foreach

            UserService.getPage(0, 0, "", {softAdmitted:true})
            .then(response => {
              console.log(response.data);
              response.data.users.forEach(user => {
                UserService.updateConfirmationTime(user._id)
              });
              //update confirmation time foreach
              swal("Sounds good!", "Confirmation Date Updated for all users", "success");            
            });

          });
      };
      
      // Acceptance / Confirmation Text ----------------

      var converter = new showdown.Converter();

      $scope.markdownPreview = function(text){
        return $sce.trustAsHtml(converter.makeHtml(text));
      };

      $scope.updateWaitlistText = function(){
        var text = $scope.settings.waitlistText;
        SettingsService
          .updateWaitlistText(text)
          .then(response => {
            swal("Looks good!", "Waitlist Text Updated", "success");
            updateSettings(response.data);
          });
      };

      $scope.updateHostSchool = function(){
        var hostSchool = $scope.settings.hostSchool;
        SettingsService
          .updateHostSchool(hostSchool)
          .then(response => {
            swal("Looks good!", "Host School Updated", "success");
            updateSettings(response.data);
          });
      };

    
      $scope.updateAcceptanceText = function(){
        var text = $scope.settings.acceptanceText;
        SettingsService
          .updateAcceptanceText(text)
          .then(response => {
            swal("Looks good!", "Acceptance Text Updated", "success");
            updateSettings(response.data);
          });
      };

      $scope.updateConfirmationText = function(){
        var text = $scope.settings.confirmationText;
        SettingsService
          .updateConfirmationText(text)
          .then(response => {
            swal("Looks good!", "Confirmation Text Updated", "success");
            updateSettings(response.data);
          });
      };

    }]);



angular.module('reg')
.controller('AdminTeamCtrl', [
  '$scope',
  '$state',
  '$timeout',
  'currentUser',
  'settings',
  'Utils',
  'UserService',
  'TeamService',
  'TEAM',
  function ($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM) {
    // Get the current user's most recent data. 
    var Settings = settings.data;

    $scope.regIsOpen = Utils.isRegOpen(Settings);

    $scope.user = currentUser.data;

    function isTeamMember(teams, Userid) {
      var test = false;
      teams.forEach(team => {
        team.members.forEach(member => {
          if (member.id == Userid) test = true;
        });
      });
      return test;
    }

    function selectMember(memberId) {
      UserService.get(memberId).then(response => {
        user = response.data
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
      });
      console.log(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Profile",
          fields: [
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            },
          ]
        },
      ];
    }

    $scope.selectMember = selectMember;


    $scope.isjoined = function (team) {
      var test = false;
      team.joinRequests.forEach(member => {
        if (member.id == currentUser.data._id) test = true;
      })
      return test;
    }

    TeamService.getAll().then(teams => {
      console.log(teams.data);

      $scope.isTeamAdmin = false;
      $scope.isTeamMember = false;
      teams.data.forEach(team => {
        team.isMaxteam = false;

        if (team.members.length >= Settings.maxTeamSize) {
          team.isColosed = true;
          team.isMaxteam = true;
        }

        if (team.members[0].id == currentUser.data._id) {
          team.joinRequests.forEach(member => {
            if (isTeamMember(teams.data, member.id)) {
              member.unavailable = true;
            } else { member.unavailable = false }
          });
          $scope.userAdminTeam = team;
          $scope.isTeamAdmin = true;
        } else {
          team.members.forEach(member => {
            if (member.id == currentUser.data._id) {
              $scope.userMemberTeam = team;
              $scope.isTeamMember = true;
            }
          })
        }
      })
      
      $scope.teams = teams.data;

    });


    $scope.createTeam = function () {

      teamData = {
        description: $scope.newTeam_description,
        members: [{ id: currentUser.data._id, name: currentUser.data.profile.name, skill: $scope.newTeam_Adminskill }],
        skills: { code: $scope.skillcode, design: $scope.skilldesign, hardware: $scope.skillhardware, idea: $scope.skillidea },
        isColosed: false,
      }
      console.log(teamData);
      console.log($scope.newTeam_Adminskill);

      TeamService.create(teamData);
      $state.reload();
    };


    $scope.ShowcreateTeam = function () {
      $scope.ShowNewTeamFrom = true;
      $scope.skillcode = true
      $scope.skilldesign = true
      $scope.skillhardware = true
      $scope.skillidea = true
      $scope.newTeam_Adminskill = "code"
    }


    $scope.ShowJoinTeam = function(){
      $scope.ShowJoinTeamFrom = true;  
    }


    $scope.joinTeamCode = function () {

      teamID = $scope.newTeam_Code;
      newTeam_skill= $scope.newTeam_skill;

      newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:newTeam_skill};
      TeamService.join(teamID,newuser); 
      swal(
        "Joined",
        "You have appliced to join this team, wait for the Team-Admin to accept your application.",
        "success"
      );  
      $state.reload();
 
    }
    
    $scope.joinTeam = function (team) {

      var value;
      const select = document.createElement('select');
      select.className = 'select-custom'


      var option = document.createElement('option');
      option.disabled = true;
      option.innerHTML = 'Select a skill';
      option.value = "code"
      select.appendChild(option);


      if (team.skills.code) {
        option = document.createElement('option');
        option.innerHTML = 'Code';
        option.value = "code"
        select.appendChild(option);
      }
      if (team.skills.design) {
        option = document.createElement('option');
        option.innerHTML = 'Design';
        option.value = "design"
        select.appendChild(option);
      }
      if (team.skills.hardware) {
        option = document.createElement('option');
        option.innerHTML = 'Hardware';
        option.value = "hardware"
        select.appendChild(option);
      }
      if (team.skills.idea) {
        option = document.createElement('option');
        option.innerHTML = 'Idea';
        option.value = "idea"
        select.appendChild(option);
      }

      select.onchange = function selectChanged(e) {
        value = e.target.value
      }

      swal({
        title: "Please select your skill to join",

        content: {
          element: select,
        }
      }).then(function () {

        newuser = { id: currentUser.data._id, name: currentUser.data.profile.name, skill: value };
        TeamService.join(team._id, newuser);
        swal(
          "Joined",
          "You have appliced to join this team, wait for the Team-Admin to accept your application.",
          "success"
        );
        $state.reload();
      })
    }


    $scope.acceptMember = function (teamID, member, index) {

      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to accept " + member.name + " to your team! This will send him a notification email and will show in the public teams page.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, let him in",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.acceptMember(teamID, member, Settings.maxTeamSize).then(response => {
          if (response == "maxTeamSize") {
            swal(
              "Error",
              "Maximum number of members (" + Settings.maxTeamSize + ") reached",
              "error"
            );
          } else {
            TeamService.removejoin(teamID, index, false).then(response2 => {
              swal(
                "Accepted",
                member.name + " has been accepted to your team.",
                "success"
              );
              $state.reload();
            });
          }
        });
      });
    }



    $scope.refuseMember = function (teamID, member, index) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to refuse " + member.name + " from your team! This will send him a notification email.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, refuse him",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.removejoin(teamID, index, member).then(response => {
          swal(
            "Refused",
            member.name + " has been refused from your team.",
            "success"
          );
          $state.reload();
        });
      });
    }


    $scope.removeMemberfromTeam = function (teamID, member, index) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to remove " + member.name + " from your team! This will send him a notification email.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove him",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.removemember(teamID, index, member.id).then(response => {
          if (response == "removingAdmin") {
            swal(
              "Error",
              "You can't remove the Team Admin, But you can close the team.",
              "error"
            );
          } else {
            TeamService.removejoin(teamID, index, false).then(response2 => {
              swal(
                "Removed",
                member.name + " has been removed from your team.",
                "success"
              );
              $state.reload();
            });
          }
        });
      });
    }



    $scope.removeTeam = function (team) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to remove this team with all it's members! This will send them a notification email. You need to find another team to work with.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove team",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }

        email = {
          subject: "Your team has been removed",
          title: "Time for a backup plan",
          body: "The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
        }

        TeamService.remove(team._id).then(response => {
          team.members.forEach(user => {
            UserService.sendBasicMail(user.id, email);
          });
          team.joinRequests.forEach(user => {
            UserService.sendBasicMail(user.id, email);
          });

          swal(
            "Removed",
            "Team has been removed.",
            "success"
          );
          $state.reload();
        });
      });
    }


    $scope.leaveTeam = function (team) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to leave your team! This will send the admin a notification email.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove him",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        var index = 0;
        team.members.forEach(member => {
          if (member.id == currentUser.data._id) {
            TeamService.removemember(team._id, index).then(response => {
              swal(
                "Removed",
                "You have successfully left this team. Please find another team or create your own.",
                "success"
              );
              $state.reload();
            });

          }
          index++;
        })
      });
    }


    $scope.canceljoinTeam = function (team) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to cancel your request to join this team!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, Cancel",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        var index = 0;

        team.joinRequests.forEach(member => {
          if (member.id == currentUser.data._id) {
            TeamService.removejoin(team._id, index, false).then(response => {
              swal(
                "Removed",
                "You have successfully canceled you request to join this team. Please find another team or create your own.",
                "success"
              );
              $state.reload();
            });

          }
          index++;
        })
      });
    }


    $scope.toggleCloseTeam = function (teamID, status) {
      if (status == true) {
        text = "You are about to Close this team. This won't allow other members to join your team!"
      } else { text = "You are about to reopen this team. This will allow other members to join your team!" }

      swal({
        title: "Whoa, wait a minute!",
        text: text,
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.toggleCloseTeam(teamID, status).then(response => {
          swal(
            "Done",
            "Operation successfully Completed.",
            "success"
          );
          $state.reload();
        });
      });
    }



    $scope.toggleHideTeam = function (teamID, status) {
      if (status == true) {
        text = "You are about to Hide this team. This won't allow other members to see your team!"
      } else { text = "You are about to Show this team. This will allow other members to see your team!" }

      swal({
        title: "Whoa, wait a minute!",
        text: text,
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.toggleHideTeam(teamID, status).then(response => {
          swal(
            "Done",
            "Operation successfully Completed.",
            "success"
          );
          $state.reload();
        });
      });
    }

    $scope.$watch("queryText", function (queryText) {
      TeamService.getSelectedTeams(queryText, $scope.skillsFilters).then(
        response => {
          $scope.teams = response.data.teams;
        }
      );
    });

    $scope.applyskillsFilter = function () {
      TeamService.getSelectedTeams($scope.queryText, $scope.skillsFilters).then(
        response => {
          $scope.teams = response.data.teams;
        }
      );
    };





  }]);

angular.module('reg') .config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#9B66FE', '#FF6484', '#FEA03F', '#FBD04D', '#4DBFC0', '#33A3EF', '#CACBCF'],
    responsive: true
  });
}])
.controller('AdminStatsCtrl',[
    '$scope',
    "$state",
    'UserService',
    function($scope, $state, UserService){
      


      var timeFormat = 'MM/DD/YYYY';


      UserService
      .getAll()
      .then(response => {
        var users = response.data;
        var result=[ [],[] ];


        function newDate(Day) {
          return moment(Day).toDate();
        } 
  

        users.forEach(user => {

          if (result[0].includes(moment(user.timestamp).format(timeFormat))){
            var index = result[0].indexOf(moment(user.timestamp).format(timeFormat))
            result[1][index]++

          }else{
            result[0].push(moment(user.timestamp).format(timeFormat))
            result[1].push(1)
          }


        });
        console.log(result)

        $scope.applicants = {
          labels : result[0],
          series : ['Application Timeline'],
          data : result[1],
          options: {
            title: {
              display: true,
              text: 'Applications timeline'
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  format: timeFormat,
                  // round: 'day'
                  tooltipFormat: 'll'
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
              }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Applicants number '
                }
              }]
            },
          }
         }

      })


      $scope.population = {
        labels : ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        series : ['Application Timeline'],
        data : [
          [65, 59, 90, 81, 56, 55, 40],
          [-28, -48, -40, -19, -67, -27, -90]
        ],
        options: {
          title: {
            display: true,
            text: 'Applications timeline'
          },
          scales: {
						xAxes: [{
							stacked: true,
						}],
						yAxes: [{
              stacked: true,
              tickFormat: function(d){
                return d3.format(',f')(Math.abs(d));   // Use Math.abs() to get the absolute value
            }
        
						}]
					},
        }
       }

      UserService
        .getStats()
        .then(stats => {
          $scope.stats = stats.data; 

          // Meals 
          labels=[]
          for (let i = 0; i < stats.data.live.meal.length; i++) {
            labels.push('Meal '+(i+1))      
          }
          $scope.meals = { 
            labels : labels,
            series : ['Meals'],
            data : stats.data.live.meal,
            options : {
              "scales":{
                "xAxes":[{"ticks":{beginAtZero:true,max:stats.data.total}}]
              },
              title: {
                display: true,
                text: 'Meals Consumed'
              }
            }
           }
           
          // Workshops 
          labels=[]
          for (let i = 0; i < stats.data.live.workshop.length; i++) {
            labels.push('Workshop '+(i+1))
          }

          $scope.workshops = { 
            labels : labels,
            series : ['Workshops'],
            data : stats.data.live.workshop,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Workshops attendance'
              }
            }
           }

          // clubs
          $scope.clubs = {
            labels : stats.data.source.clubsLabels,
            series : ['Clubs'],
            data : stats.data.source.clubs,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Applicants via Clubs'
              },
              legend: {
                display: true,
                position: 'right',
              },
            }
           }

           // Get the most active club
           var arr =stats.data.source.clubs
           var max = arr[0];
           var maxIndex = 0;
           for (var i = 1; i < arr.length; i++) {
               if (arr[i] > max) {
                   maxIndex = i;
                   max = arr[i];
               }
           }

           $scope.firstClub = stats.data.source.clubsLabels[maxIndex]

       


          // sources 
          $scope.source = {
            labels : ['Facebook','Email','Clubs'],
            series : ['Sources'],
            data : stats.data.source.general,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Applicants sources'
              },
              legend: {
                display: true,
                position: 'right',
              },
            }
           }



          $scope.loading = false;
        });  


      UserService
        .getTeamStats()
        .then(teamstats => {
          $scope.teamstats = teamstats.data; 
        });  


      $scope.fromNow = function(date){
        return moment(date).locale('en').fromNow();
      };

      $scope.updatestats = function(){
        UserService.updatestats()
        $state.reload();
      };

      Chart.defaults.global.colors = [
        {
          backgroundColor: 'rgba(52, 152, 219, 0.5)',
          pointBackgroundColor: 'rgba(52, 152, 219, 0.5)',
          pointHoverBackgroundColor: 'rgba(151,187,205,0.5)',
          borderColor: 'rgba(0,0,0,0',
          pointBorderColor: '#fff',
          pointHoverBorderColor: 'rgba(151,187,205,0.5)'
        }
      ]        


      $scope.sendLaggerEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has not submitted an application. Are you sure?.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendLaggerEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };

      $scope.sendRejectEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has been rejected. Are you sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendRejectEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };

      $scope.sendRejectEmailsRest = function(){
        UserService
          .getLaterRejectedCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will send rejection email to ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .sendRejectEmailsRest()
                  .then(function(){
                    sweetAlert('Your emails have been sent.');
                });
            })
          })
      };

      $scope.massReject = function() {
        UserService
          .getRejectionCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will reject ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .massReject()
                  .then(function(){
                    sweetAlert('Mass Rejection successful.');
                });
            })
          })
      }

      $scope.massRejectRest = function() {
        UserService
          .getRestRejectionCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will reject ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .massRejectRest()
                  .then(function(){
                    sweetAlert('Mass Rejection successful.');
                });
            })
          })
      }




    }]);

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();

      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };


      $scope.updateConfirmation = function(){
        UserService
          .updateConfirmation($scope.selectedUser._id, $scope.selectedUser.confirmation)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Confirmation updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };


      $scope.updateAllUser = function(){

        UserService
          .updateAll($scope.selectedUser._id, $scope.selectedUser)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "ALL Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });  
      };





    }]);

angular.module("reg").controller("AdminUsersCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "UserService",
  'AuthService',
  function($scope, $state, $stateParams, UserService, AuthService) {
    $scope.pages = [];
    $scope.users = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.
    $scope.selectedUser = {};
    $scope.selectedUser.sections = generateSections({
      status: "",
      confirmation: {
        dietaryRestrictions: []
      },
      profile: ""
    });

    function updatePage(data) {
      $scope.users = data.users;
      $scope.currentPage = data.page;
      $scope.pageSize = data.size;

      var p = [];
      for (var i = 0; i < data.totalPages; i++) {
        p.push(i);
      }
      $state.go("app.admin.users", {
        page: 0,
        size: $stateParams.size || 20
      });
      $scope.pages = p;
    }

    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {

      updatePage(response.data);
    });

    $scope.$watch("queryText", function(queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {
      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters,$scope.NotstatusFilters).then(
          response => {
            updatePage(response.data);
        });
    };


    $scope.goToPage = function(page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.goUser = function($event, user) {
      $event.stopPropagation();

      $state.go("app.admin.user", {
        id: user._id
      });
    };


    $scope.acceptUser = function($event, user, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, accept them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to accept " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }
        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, accept this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having accepted this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }
          
          UserService.softAdmittUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Accepted",
              response.data.profile.name + " has been admitted.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };



    $scope.rejecttUser = function($event, user, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, reject them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to reject " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, reject this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having rejected this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }
          
          UserService.softRejectUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Rejected",
              response.data.profile.name + " has been rejected.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };




    $scope.removeUser = function($event, user, index) {
      $event.stopPropagation();


      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to remove " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having removed this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.removeUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Removed",
              response.data.profile.name + " has been removed.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };

    $scope.sendAcceptanceEmails = function() {
      const filterSoftAccepted = $scope.users.filter(
        u => u.status.softAdmitted && !u.status.admitted
      );

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send acceptance emails (and accept) ${
          filterSoftAccepted.length
        } user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, accept them and send the emails"],
        dangerMode: true
      }).then(willSend => {
        if (willSend) {
          if (filterSoftAccepted.length) {
            filterSoftAccepted.forEach(user => {
              UserService.admitUser(user._id); 
            });
            swal(
              "Sending!",
              `Accepting and sending emails to ${
                filterSoftAccepted.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or accept 0 users!", "error");
          }
        }
      });
    };



    $scope.sendRejectionEmails = function() {
      const filterSoftRejected = $scope.users.filter(
        u => u.status.softRejected
      );

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send rejection emails (and reject) ${
          filterSoftRejected.length
        } user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, reject them and send the emails"],
        dangerMode: true
      }).then(willSend => {
        if (willSend) {
          if (filterSoftRejected.length) {
            filterSoftRejected.forEach(user => {
              UserService.rejectUser(user._id); 
            });
            swal(
              "Sending!",
              `Rejecting and sending emails to ${
                filterSoftRejected.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or reject 0 users!", "error");
          }
        }
      });
    };


    $scope.exportUsers = function(){
      var columns = ["N°", "Gender", "Full Name","School"];
      var rows = [];
      UserService.getAll().then(users => {
        var i=1;
        users.data.forEach(user => {
          rows.push([i++,user.profile.gender,user.profile.name,user.profile.school])
        });
        var doc = new jsPDF('p', 'pt');


        var totalPagesExp = "{total_pages_count_string}";

        var pageContent = function (data) {
            // HEADER
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            // if (base64Img) {
            //     doc.addImage(base64Img, 'JPEG', data.settings.margin.left, 15, 10, 10);
            // }
            doc.text("Participants List", data.settings.margin.left + 15, 22);
    
            // FOOTER
            var str = "Page " + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + " of " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight  - 10);
        };
        
        doc.autoTable(columns, rows, {
            addPageContent: pageContent,
            margin: {top: 30},
            theme: 'grid'
        });
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
        }
        doc.save('Participants List.pdf');
      })
    }


    $scope.toggleAdmin = function($event, user, index) {
      $event.stopPropagation();

      if (!user.admin) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about make " + user.profile.name + " an admin!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            confirm: {
              text: "Yes, make them an admin",
              className: "danger-button",
              closeModal: false,
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.makeAdmin(user._id).then(response => {
            $scope.users[index] = response.data;
            swal("Made", response.data.profile.name + " an admin.", "success");
            $state.reload();
          });
        });
      } else {
        UserService.getAll().then(response=>{
          var count = 0;
          response.data.forEach(user => {
            if (user.admin) count++;
          });
          if (count>1) {
            UserService.removeAdmin(user._id).then(response => {
              $scope.users[index] = response.data;
              swal("Removed", response.data.profile.name + " as admin", "success");
              $state.reload();
            });
          }else {
            swal("No other Admin","You can't remove all admins.", "error");
          }
        })

      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).locale('en').format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function(user) {
      if (user.admin) {
        return "admin";
      }
      if (user.status.confirmed) {
        return "positive";
      }
      if (user.status.admitted && !user.status.confirmed) {
        return "warning";
      }
    };

    function selectUser(user) {
      $scope.selectedUser = user;
      $scope.selectedUser.sections = generateSections(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Basic Info",
          fields: [
            {
              name: "Created On",
              value: formatTime(user.timestamp)
            },
            {
              name: "Last Updated",
              value: formatTime(user.lastUpdated)
            },
            {
              name: "Confirm By",
              value: formatTime(user.status.confirmBy) || "N/A"
            },
            {
              name: "Checked In",
              value: formatTime(user.status.checkInTime) || "N/A"
            },
            {
              name: "Email",
              value: user.email
            }
          ]
        },
        {
          name: "Profile",
          fields: [
            {
              name: "Name",
              value: user.profile.name
            },
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "Description",
              value: user.profile.description
            },
            {
              name: "Essay",
              value: user.profile.essay
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            },
            {
              name:"CV link",
              value: user.profile.pitchLink
            },
          ]
        },
        {
          name: "Confirmation",
          fields: [
            {
              name: "Phone Number",
              value: user.confirmation.phoneNumber
            },
            {
              name: "Needs Hardware",
              value: user.confirmation.wantsHardware,
              type: "boolean"
            },
            {
              name: "Hardware Requested",
              value: user.confirmation.hardware
            },
            {
              name:"National Card ID",
              value: user.confirmation.nationalCardID
            }
          ]
        },
        {
          name: "Travel",
          fields: [
            {
              name: "Additional Notes",
              value: user.confirmation.notes
            }
          ]
        }
      ];
    }

    function onSuccess() {
      swal("Updated!", "New Volunteer Added.", "success");
      $state.reload();
    }

    function onError(data){
      swal("Try again!", data.message, "error")
    }

    $scope.addVolunteer = function(){

      swal("Write the challenge title:", {
        buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Invite",value: true,visible: true} },
        content: {element: "input", attributes: {placeholder: "example@gmail.com",type: "text"} },
      }).then((mail) => { if (!mail) {return;} 
        AuthService.register(
          mail, "hackathon", onSuccess, onError, true)
      });
    };



    $scope.selectUser = selectUser;
  }
]);
angular.module('reg')
  .service('settings', function() {})
  .controller('BaseCtrl', [
    '$scope',
    'EVENT_INFO',
    function($scope, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

    }]);

angular.module('reg')
  .controller('adminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
    }]);
angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    'MarketingService',
    function ($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService, MarketingService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from HostSchool?
      $scope.isHostSchool = $scope.user.email.split('@')[1] == settings.data.hostSchool;

      // If so, default them to adult: true
      if ($scope.isHostSchool) {
        $scope.user.profile.adult = true;
      }

      // Populate the school dropdown
      populateSchools();
      _setupForm();

      populateCountries();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

      function populateSchools() {
        $http
          .get('/assets/schools.json')
          .then(function (res) {
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]) {
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        $http
          .get('/assets/schools.csv')
          .then(function (res) {
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for (i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({ title: $scope.schools[i] })
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });
      }


      function populateCountries() {
        $http
          .get('/assets/countries.csv')
          .then(function (res) {
            $scope.countries = res.data.split('\n');
            $scope.countries.push('Other');
            var content = [];
            for (i = 0; i < $scope.countries.length; i++) {
              $scope.countries[i] = $scope.countries[i].trim();
              content.push({ title: $scope.countries[i] })
            }



            $('#country.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.country = result.title.trim();
                }
              })

              $('#companycountry.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.companycountry = result.title.trim();
                }
              })


          });
      }


      // function populateClubs() {
      //   $http
      //     .get('/assets/clubs.csv')
      //     .then(function (res) {
      //       $scope.clubs = res.data.split('\n');
      //       $scope.clubs.push('Other');

      //       var content = [];

      //       for (i = 0; i < $scope.clubs.length; i++) {
      //         $scope.clubs[i] = $scope.clubs[i].trim();
      //         content.push({ title: $scope.clubs[i] })
      //       }

      //       $('#club.ui.search')
      //         .search({
      //           source: content,
      //           cache: true,
      //           onSelect: function (result, response) {
      //             $scope.club = result.title.trim();
      //           }
      //         })
      //     });
      //   if ($scope.user.profile.source != undefined) {
      //     $scope.UserSource = $scope.user.profile.source.split('#')[0];
      //     $scope.club = $scope.user.profile.source.split('#')[1];
      //   }
      // }


      function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
      }

      function sendMarketingEmails() {
        MarketingService.getAll().then(teams => {
          var emails = [];
          teams.data.forEach(team => {
            var isTeammate = false;
            team.members.forEach(member => {
              if (member == currentUser.data.email) {
                isTeammate = true;
              }
            });
            if (isTeammate) {
              team.members.forEach(member => {
                if (!(member == currentUser.data.email)) {
                  emails.push({ email: member, event: team.event })
                }
              });
            }
          });
          removeDuplicates(emails, 'email').forEach(teammate => {
            MarketingService.sendFriendInvite(currentUser.data.profile.name, teammate)
          });
        })
      }


      function _updateUser(e) {

        //Check if User's first submission
        var sendMail = true;
        if (currentUser.data.status.completedProfile) { sendMail = false }

        // Get user Source
        if ($scope.UserSource != '2') { $scope.user.profile.source = $scope.UserSource }
        else { $scope.user.profile.source = $scope.UserSource + "#" + $scope.club }

        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              if (sendMail) { sendMarketingEmails(); }
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });

      }

      function isMinor() {
        return !$scope.user.profile.adult;
      }

      function minorsAreAllowed() {
        return settings.data.allowMinors;
      }

      function minorsValidation() {
        // Are minors allowed to register?
        if (isMinor() && !minorsAreAllowed()) {
          return false;
        }
        return true;
      }

      function _setupForm() {
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        };

        // Semantic-UI form valid ation
        $('.ui.form').form({
          on: 'blur',
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            country: {
              identifier: 'country',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your country of residence.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender. '
                }
              ]
            },
            company: {
              identifier: 'company',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your company name.'
                }
              ]
            },
            industry: {
              identifier: 'industry',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your company industry.'
                }
              ]
            },
            title: {
              identifier: 'title',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your title in your company.'
                }
              ]
            },
            adresse: {
              identifier: 'adresse',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your company adresse.'
                }
              ]
            },
            companycountry: {
              identifier: 'companycountry',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your company HQ country.'
                }
              ]
            },

            sector: {
              identifier: 'sector',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your company sector.'
                }
              ]
            },
            essay: {
              identifier: 'essay',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please tell us would you like to get out of UVSQ Conf.'
                }
              ]
            },
            userSource: {
              identifier: 'userSource',
              rules: [
                {
                  type: 'empty',
                  prompt: 'How did you hear about us ?'
                }
              ]
            },
            userType: {
              identifier: 'userType',
              rules: [
                {
                  type: 'empty',
                  prompt: 'How do you plan to attend UVSQ Conf?'
                }
              ]
            },


          }
        });
      }

      $scope.submitForm = function () {
        if ($('.ui.form').form('is valid')) {
          // $('.ui.submit.button').click();
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);

angular.module('reg')
.controller('CheckinCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'UserService',
  function($scope, $state, $stateParams, UserService){
    $('#reader').html5_qrcode(function(userID){
          //Change the input fields value and send post request to the backend
          
          UserService.get(userID).then(response => {

            user =response.data;

            if (!user.status.checkedIn) {
              swal({
                title: "Whoa, wait a minute!",
                text: "You are about to check in " + user.profile.name + "!",
                icon: "warning",
                buttons: {
                  cancel: {
                    text: "Cancel",
                    value: null,
                    visible: true
                  },
                  checkIn: {
                    className: "danger-button",
                    closeModal: false,
                    text: "Yes, check them in",
                    value: true,
                    visible: true
                  }
                }
              }).then(value => {
                if (!value) {
                  return;
                }
      
                UserService.checkIn(user._id).then(response => {
                  $scope.queryText = user.email;
                  swal(
                    "Checked in",
                    user.profile.name + " has been checked in.",
                    "success"
                  );
                });
              });
            } else {
              swal(
                "Already checkedIn",
                user.profile.name + " has been checked-in at: "+ formatTime(user.status.checkInTime),
                "warning"
              );
          }
          });

        },
      function(error){
      }, function(videoError){
        //the video stream could be opened
      }
    );
    $scope.pages = [];
    $scope.users = [];
    $scope.sortBy = 'timestamp'
    $scope.sortDir = false
    $scope.statusFilters= {verified:true,completedProfile:true,admitted: true,confirmed:true}

    $scope.filter = deserializeFilters($stateParams.filter);
    $scope.filter.text = $stateParams.query || "";

    function deserializeFilters(text) {
      var out = {};
      if (!text) return out;
      text.split(",").forEach(function(f){out[f]=true});
      return (text.length===0)?{}:out;
    }

    function serializeFilters(filters) {
      var out = "";
      for (var v in filters) {if(typeof(filters[v])==="boolean"&&filters[v]) out += v+",";}
      return (out.length===0)?"":out.substr(0,out.length-1);
    }

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $('.ui.dimmer').remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.
    $scope.selectedUser = {};
    $scope.selectedUser.sections = generateSections({
      status: "",
      confirmation: {
        dietaryRestrictions: []
      },
      profile: ""
    });

    function updatePage(data) {
      $scope.users = data.users;
      $scope.currentPage = data.page;
      $scope.pageSize = data.size;

      var p = [];
      for (var i = 0; i < data.totalPages; i++) {
        p.push(i);
      }
      $scope.pages = p;
    }
    
    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {
      updatePage(response.data);
    });

    $scope.$watch("queryText", function(queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {

      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters).then(
          response => {
            updatePage(response.data);
        });
    };


    $scope.goToPage = function(page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.checkIn = function($event, user, index) {
      $event.stopPropagation();

      if (!user.status.checkedIn) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to check in " + user.profile.name + "!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, check them in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.checkIn(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Checked in",
              response.data.profile.name + " has been checked in.",
              "success"
            );
            $state.reload();
          });
        });
      } else {
        swal(
          "Already checkedIn",
          user.profile.name + " has been checked-in at: "+ formatTime(user.status.checkInTime),
          "warning"
        );
      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).locale('en').format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function(user) {
      if (user.admin) {
        return "admin";
      }
      if (user.status.confirmed) {
        return "positive";
      }
      if (user.status.admitted && !user.status.confirmed) {
        return "warning";
      }
    };

    function selectUser(user) {
      $scope.selectedUser = user;
      $scope.selectedUser.sections = generateSections(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Basic Info",
          fields: [
            {
              name: "Created On",
              value: formatTime(user.timestamp)
            },
            {
              name: "Last Updated",
              value: formatTime(user.lastUpdated)
            },
            {
              name: "Confirm By",
              value: formatTime(user.status.confirmBy) || "N/A"
            },
            {
              name: "Checked In",
              value: formatTime(user.status.checkInTime) || "N/A"
            },
            {
              name: "Email",
              value: user.email
            }
          ]
        },
        {
          name: "Profile",
          fields: [
            {
              name: "Name",
              value: user.profile.name
            },
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Graduation Year",
              value: user.profile.graduationYear
            },
            {
              name: "Hackathons visited",
              value: user.profile.howManyHackathons
            },
            {
              name: "Description",
              value: user.profile.description
            },
            {
              name: "Essay",
              value: user.profile.essay
            },
            {
              name: "Major",
              value: user.profile.major
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Facebook",
              value: user.profile.facebook
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            }
          ]
        },
        {
          name: "Confirmation",
          fields: [
            {
              name: "Phone Number",
              value: user.confirmation.phoneNumber
            },
            {
              name: "Needs Hardware",
              value: user.confirmation.wantsHardware,
              type: "boolean"
            },
            {
              name: "Hardware Requested",
              value: user.confirmation.hardware
            }
          ]
        },
        {
          name: "Travel",
          fields: [
            {
              name: "Additional Notes",
              value: user.confirmation.notes
            }
          ]
        }
      ];
    }
    $scope.selectUser = selectUser;
  }]);
angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;
        

        // UserService.uploadCV(user._id, angular.element(document.querySelector('#cv'))[0].files).then(response => {
        //   swal("Uploaded", "CV uploaded.", "success")


        UserService
        .updateConfirmation(user._id, confirmation)
        .then(response => {
          swal("Woo!", "You're confirmed!", "success").then(value => {
            $state.go("app.dashboard");
          });
        }, response => {
          swal("Uh oh!", "Something went wrong.", "error");
        })


        // }, response => {
        //   swal("Uh oh!", "Something went wrong. (File)", "error");
        // })
  
        

        
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            signatureCodeOfConduct: {
              identifier: 'signatureCodeOfConduct',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            nationalCardID: {
              identifier: 'nationalCardID',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your National Card ID.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);

angular.module('reg')
  .controller('DashboardCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, EVENT_INFO, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;
      $scope.timeClose = Utils.formatTime(Settings.timeClose);
      $scope.timeConfirm = Utils.formatTime(Settings.timeConfirm);

      $scope.DASHBOARD = DASHBOARD;

      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }
      }

      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(response => {
            swal("Check your Inbox!", "Your email has been sent.", "success"); 
            
          });
      };

      // $scope.printConfirmation =function(ImageURL){

      //   html2canvas($('#qrCode'), {
      //     allowTaint: true,
      //     onrendered: function (canvas) {
      //         var imgData = canvas.toDataURL("image/jpeg", 1.0);
      //         var pdf = new jsPDF('p', 'mm', 'a0');
  
      //         pdf.addImage(imgData, 'JPEG', 0, 0);
      //         pdf.save("Current Data2.pdf")
      //     }
      // });
      
      // }


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));

      $scope.declineAdmission = function(){

      swal({
        title: "Whoa!",
        text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          confirm: {
            text: "Yes, I can't make it",
            value: true,
            visible: true,
            className: "danger-button"
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }

        UserService
          .declineAdmission(user._id)
          .then(response => {
            $rootScope.currentUser = response.data;
            $scope.user = response.data;
          });
      });
    };
  }]);

angular.module('reg')
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    'EVENT_INFO',
    function($rootScope, $scope, $http, $state, settings, Utils, AuthService, EVENT_INFO){
      $scope.loading = true;

      $scope.EVENT_INFO = EVENT_INFO;

      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);


      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };




      $scope.loading = false;

    }]);

angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    'EVENT_INFO',
    function($scope, $http, $state, settings, Utils, AuthService, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };

    }
  ]);

angular.module('reg')
  .controller('ResetCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'AuthService',
    function($scope, $stateParams, $state, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      $scope.changePassword = function(){
        var password = $scope.password;
        var confirm = $scope.confirm;

        if (password !== confirm){
          $scope.error = "Passwords don't match!";
          $scope.confirm = "";
          return;
        }

        AuthService.resetPassword(
          token,
          $scope.password,
          message => {
            swal("Neato!", "Your password has been changed!", "success").then(value => {
              $state.go("home");
            });
          },
          data => {
            $scope.error = data.message;
            $scope.loading = false;
        });
      };
    }]);

angular.module('reg')
  .controller('VerifyCtrl', [
    '$scope',
    '$stateParams',
    'AuthService',
    function($scope, $stateParams, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      if (token) {
        AuthService.verify(token,
          function(user){
            $scope.success = true;
            $scope.loading = false;
          },
          function(err){
            $scope.loading = false;
          });
      }
    }]);



angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function ($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM) {
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      function isTeamMember(teams, Userid) {
        var test = false;
        teams.forEach(team => {
          team.members.forEach(member => {
            if (member.id == Userid) test = true;
          });
        });
        return test;
      }

      function selectMember(memberId) {
        UserService.get(memberId).then(response => {
          user = response.data
          $scope.selectedUser = user;
          $scope.selectedUser.sections = generateSections(user);
        });
        console.log(user);
        $(".long.user.modal").modal("show");
      }

      function generateSections(user) {
        return [
          {
            name: "Profile",
            fields: [
              {
                name: "Gender",
                value: user.profile.gender
              },
              {
                name: "School",
                value: user.profile.school
              },
              {
                name: "Github",
                value: user.profile.github
              },
              {
                name: "Linkedin",
                value: user.profile.linkedin
              },
            ]
          },
        ];
      }

      $scope.selectMember = selectMember;


      $scope.isjoined = function (team) {
        var test = false;
        team.joinRequests.forEach(member => {
          if (member.id == currentUser.data._id) test = true;
        })
        return test;
      }

      TeamService.getAll().then(teams => {
        $scope.isTeamAdmin = false;
        $scope.isTeamMember = false;
        teams.data.forEach(team => {
          team.isMaxteam = false;

          if (team.members.length >= Settings.maxTeamSize) {
            team.isColosed = true;
            team.isMaxteam = true;
          }

          if (team.members[0].id == currentUser.data._id) {
            team.joinRequests.forEach(member => {
              if (isTeamMember(teams.data, member.id)) {
                member.unavailable = true;
              } else { member.unavailable = false }
            });
            $scope.userAdminTeam = team;
            $scope.isTeamAdmin = true;
          } else {
            team.members.forEach(member => {
              if (member.id == currentUser.data._id) {
                $scope.userMemberTeam = team;
                $scope.isTeamMember = true;
              }
            })
          }
        })
        $scope.teams = teams.data;

      });


      $scope.createTeam = function () {

        teamData = {
          description: $scope.newTeam_description,
          members: [{ id: currentUser.data._id, name: currentUser.data.profile.name, skill: $scope.newTeam_Adminskill }],
          skills: { code: $scope.skillcode, design: $scope.skilldesign, hardware: $scope.skillhardware, idea: $scope.skillidea },
          isColosed: false,
        }

        UserService.get(currentUser.data._id).then(user=>{
          console.log(user.data.team);
          
          if (typeof(user.data.team)=== "undefined") {
            TeamService.create(teamData);
            $state.reload();
          } else {
            swal(
              "You've another team",
              "You can't be part of two teams at the same time, please leave your current team to create another one.",
              "error"
            )
          }
        })
      };


      $scope.ShowcreateTeam = function () {
        $scope.ShowNewTeamFrom = true;
        $scope.skillcode = true
        $scope.skilldesign = true
        $scope.skillhardware = true
        $scope.skillidea = true
        $scope.newTeam_Adminskill = "code"
      }


      $scope.ShowJoinTeam = function(){
        $scope.ShowJoinTeamFrom = true;  
      }


      $scope.joinTeamCode = function () {

        teamID = $scope.newTeam_Code;
        newTeam_skill= $scope.newTeam_skill;

        newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:newTeam_skill};
        TeamService.join(teamID,newuser).then( e=>         
          swal(
          "Joined",
          "You have appliced to join this team, wait for the Team-Admin to accept your application.",
          "success"
        )
        ).catch(err=> 
          swal(
            "Team not found",
            "The team code you entered doesn't exist.",
            "error"
          )
          ); 
        $state.reload();
      }
      
      $scope.joinTeam = function (team) {

        var value;
        const select = document.createElement('select');
        select.className = 'select-custom'


        var option = document.createElement('option');
        option.disabled = true;
        option.innerHTML = 'Select a skill';
        option.value = "code"
        select.appendChild(option);


        if (team.skills.code) {
          option = document.createElement('option');
          option.innerHTML = 'Code';
          option.value = "code"
          select.appendChild(option);
        }
        if (team.skills.design) {
          option = document.createElement('option');
          option.innerHTML = 'Design';
          option.value = "design"
          select.appendChild(option);
        }
        if (team.skills.hardware) {
          option = document.createElement('option');
          option.innerHTML = 'Hardware';
          option.value = "hardware"
          select.appendChild(option);
        }
        if (team.skills.idea) {
          option = document.createElement('option');
          option.innerHTML = 'Idea';
          option.value = "idea"
          select.appendChild(option);
        }

        select.onchange = function selectChanged(e) {
          value = e.target.value
        }

        swal({
          title: "Please select your skill to join",

          content: {
            element: select,
          }
        }).then(function () {

          newuser = { id: currentUser.data._id, name: currentUser.data.profile.name, skill: value };
          
          TeamService.join(team._id, newuser).then( e=>         
            swal(
            "Joined",
            "You have appliced to join this team, wait for the Team-Admin to accept your application.",
            "success"
          )
          ).catch(err=> 
            swal(
              "Team not found",
              "The team code you entered doesn't exist.",
              "error"
            )
            ); 
          $state.reload();
        })
      }


      $scope.acceptMember = function (teamID, member, index) {

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + member.name + " to your team! This will send him a notification email and will show in the public teams page.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, let him in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.acceptMember(teamID, member, Settings.maxTeamSize).then(response => {
            if (response == "maxTeamSize") {
              swal(
                "Error",
                "Maximum number of members (" + Settings.maxTeamSize + ") reached",
                "error"
              );
            } else {
              TeamService.removejoin(teamID, index, false).then(response2 => {
                swal(
                  "Accepted",
                  member.name + " has been accepted to your team.",
                  "success"
                );
                $state.reload();
              });
            }
          });
        });
      }



      $scope.refuseMember = function (teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to refuse " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, refuse him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removejoin(teamID, index, member).then(response => {
            swal(
              "Refused",
              member.name + " has been refused from your team.",
              "success"
            );
            $state.reload();
          });
        });
      }


      $scope.removeMemberfromTeam = function (teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removemember(teamID, index, member.id).then(response => {
            if (response == "removingAdmin") {
              swal(
                "Error",
                "You can't remove the Team Admin, But you can close the team.",
                "error"
              );
            } else {
              TeamService.removejoin(teamID, index, false).then(response2 => {
                swal(
                  "Removed",
                  member.name + " has been removed from your team.",
                  "success"
                );
                $state.reload();
              });
            }
          });
        });
      }



      $scope.removeTeam = function (team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove this team with all it's members! This will send them a notification email. You need to find another team to work with.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove team",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          email = {
            subject: "Your team has been removed",
            title: "Time for a backup plan",
            body: "The team you have been part of (Member/requested to join) has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
          }

          TeamService.remove(team._id).then(response => {
            team.members.forEach(user => {
              UserService.removeteamfield(user.id)
              if (user.id != currentUser.data._id) {
                UserService.sendBasicMail(user.id, email);
              }
            });
            team.joinRequests.forEach(user => {
              UserService.sendBasicMail(user.id, email);
            });

            swal(
              "Removed",
              "Team has been removed.",
              "success"
            );
            $state.reload();
          });
        });
      }


      $scope.leaveTeam = function (team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to leave your team! This will send the admin a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index = 0;
          team.members.forEach(member => {
            if (member.id == currentUser.data._id) {
              TeamService.removemember(team._id, index).then(response => {
                swal(
                  "Removed",
                  "You have successfully left this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });

            }
            index++;
          })
        });
      }


      $scope.canceljoinTeam = function (team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to cancel your request to join this team!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, Cancel",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index = 0;

          team.joinRequests.forEach(member => {
            if (member.id == currentUser.data._id) {
              TeamService.removejoin(team._id, index, false).then(response => {
                swal(
                  "Removed",
                  "You have successfully canceled you request to join this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });

            }
            index++;
          })
        });
      }


      $scope.toggleCloseTeam = function (teamID, status) {
        if (status == true) {
          text = "You are about to Close this team. This won't allow other members to join your team!"
        } else { text = "You are about to reopen this team. This will allow other members to join your team!" }

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleCloseTeam(teamID, status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });
      }



      $scope.toggleHideTeam = function (teamID, status) {
        if (status == true) {
          text = "You are about to Hide this team. This won't allow other members to see your team!"
        } else { text = "You are about to Show this team. This will allow other members to see your team!" }

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleHideTeam(teamID, status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });
      }

      $scope.$watch("queryText", function (queryText) {
        TeamService.getSelectedTeams(queryText, $scope.skillsFilters).then(
          response => {
            $scope.teams = response.data.teams;
          }
        );
      });

      $scope.applyskillsFilter = function () {
        TeamService.getSelectedTeams($scope.queryText, $scope.skillsFilters).then(
          response => {
            $scope.teams = response.data.teams;
          }
        );
      };





    }]);

angular.module('reg')
  .service('settings', function() {})
  .controller('SidebarCtrl', [
    '$rootScope',
    '$scope',
    'SettingsService',
    'Utils',
    'AuthService',
    'Session',
    'EVENT_INFO',
    function($rootScope, $scope, SettingsService, Utils, AuthService, Session, EVENT_INFO){

      var user = $rootScope.currentUser;

      $scope.EVENT_INFO = EVENT_INFO;

      $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);
      //$scope.pastSatart = Utils.isAfter(settings.timeStart);

      SettingsService
      .getPublicSettings()
      .then(response => {
        $scope.pastSatart = Utils.isAfter(response.data.timeStart)
      });

      $scope.logout = function(){
        AuthService.logout();
      };

      $scope.showSidebar = false;
      $scope.toggleSidebar = function(){
        $scope.showSidebar = !$scope.showSidebar;
      };

      // oh god jQuery hack
      $('.item').on('click', function(){
        $scope.showSidebar = false;
      });

    }]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwicXJzY2FubmVyL2h0bWw1LXFyY29kZS5taW4uanMiLCJxcnNjYW5uZXIvanNxcmNvZGUtY29tYmluZWQubWluLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9DaGFsbGVuZ2VTZXJ2aWNlLmpzIiwic2VydmljZXMvTWFya2V0aW5nU2VydmljZS5qcyIsInNlcnZpY2VzL1NldHRpbmdzU2VydmljZS5qcyIsInNlcnZpY2VzL1NvbHZlZENURlNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4vY2hhbGxlbmdlL2FkbWluQ2hhbGxlbmdlQ3RybC5qcyIsImFkbWluL2NoYWxsZW5nZXMvYWRtaW5DaGFsbGVuZ2VzQ3RybC5qcyIsImFkbWluL21haWwvYWRtaW5NYWlsQ3RybC5qcyIsImFkbWluL21hcmtldGluZy9hZG1pbk1hcmtldGluZ0N0cmwuanMiLCJhZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluL3RlYW1zL2FkbWluVGVhbXNDdHJsLmpzIiwiYWRtaW4vc3RhdHMvYWRtaW5TdGF0c0N0cmwuanMiLCJhZG1pbi91c2VyL2FkbWluVXNlckN0cmwuanMiLCJhZG1pbi91c2Vycy9hZG1pblVzZXJzQ3RybC5qcyIsIkJhc2VDdHJsLmpzIiwiYWRtaW4vYWRtaW5DdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY2hlY2tpbi9jaGVja2luQ3RybC5qcyIsImNvbmZpcm1hdGlvbi9jb25maXJtYXRpb25DdHJsLmpzIiwiZGFzaGJvYXJkL2Rhc2hib2FyZEN0cmwuanMiLCJob21lL0hvbWVDdHJsLmpzIiwibG9naW4vbG9naW5DdHJsLmpzIiwicmVzZXQvcmVzZXRDdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwic2lkZWJhci9zaWRlYmFyQ3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLE1BQUEsUUFBQSxPQUFBLE9BQUE7RUFDQTtFQUNBOzs7QUFHQTtHQUNBLE9BQUE7SUFDQTtJQUNBLFNBQUEsY0FBQTs7O01BR0EsY0FBQSxhQUFBLEtBQUE7OztHQUdBLElBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxhQUFBLFFBQUE7OztNQUdBLElBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsWUFBQSxlQUFBOzs7OztBQ3RCQSxRQUFBLE9BQUE7S0FDQSxTQUFBLGNBQUE7UUFDQSxNQUFBOztLQUVBLFNBQUEsYUFBQTtRQUNBLFlBQUE7UUFDQSxrQkFBQTtRQUNBLFlBQUE7UUFDQSxpQkFBQTtRQUNBLFdBQUE7UUFDQSw2QkFBQTtRQUNBLHVCQUFBO1FBQ0EsZ0NBQUE7UUFDQSxtQ0FBQTtRQUNBLDZCQUFBO1FBQ0EsMEJBQUE7UUFDQSxVQUFBOztLQUVBLFNBQUEsT0FBQTtRQUNBLG9CQUFBOzs7O0FDbEJBLFFBQUEsT0FBQTtHQUNBLE9BQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtNQUNBO01BQ0E7TUFDQSxtQkFBQTs7O0lBR0EsbUJBQUEsVUFBQTs7O0lBR0E7T0FDQSxNQUFBLFNBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTtVQUNBLGVBQUE7O1FBRUEsU0FBQTtVQUNBLGdDQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxRQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7VUFDQSxlQUFBOztRQUVBLFNBQUE7VUFDQSxnQ0FBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CQSxNQUFBLE9BQUE7UUFDQSxPQUFBO1VBQ0EsSUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztVQUVBLGVBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7Y0FDQSw4QkFBQSxTQUFBLGlCQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7O1FBS0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsaUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxtQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxvQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOzs7O09BSUEsTUFBQSxrQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxZQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLGFBQUE7UUFDQSxPQUFBO1VBQ0EsSUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOzs7UUFHQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxlQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGtCQUFBOzs7T0FHQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsa0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSx3QkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLHVCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsU0FBQTtVQUNBLGtEQUFBLFNBQUEsY0FBQSxpQkFBQTtZQUNBLE9BQUEsaUJBQUEsSUFBQSxhQUFBOzs7O09BSUEsTUFBQSx1QkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtVQUNBO1VBQ0E7VUFDQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsa0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxTQUFBO1VBQ0Esd0NBQUEsU0FBQSxjQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUEsSUFBQSxhQUFBOzs7O09BSUEsTUFBQSxzQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLFNBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxVQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsT0FBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7Ozs7SUFJQSxrQkFBQSxVQUFBO01BQ0EsU0FBQTs7OztHQUlBLElBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFBOztNQUVBLFdBQUEsSUFBQSx1QkFBQSxXQUFBO1NBQ0EsU0FBQSxLQUFBLFlBQUEsU0FBQSxnQkFBQSxZQUFBOzs7TUFHQSxXQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQTs7UUFFQSxJQUFBLGVBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxnQkFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGVBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxtQkFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGtCQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsa0JBQUEsUUFBQSxLQUFBOztRQUVBLElBQUEsZ0JBQUEsQ0FBQSxRQUFBLFlBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLGlCQUFBLFFBQUEsWUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsZ0JBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsb0JBQUEsQ0FBQSxRQUFBLFVBQUEsYUFBQSxnQkFBQSxDQUFBLFFBQUEsVUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxtQkFBQSxDQUFBLFFBQUEsVUFBQSxVQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxtQkFBQSxDQUFBLFFBQUEsVUFBQSxPQUFBLFVBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7Ozs7OztBQy9UQSxRQUFBLE9BQUE7R0FDQSxRQUFBLG1CQUFBO0lBQ0E7SUFDQSxTQUFBLFFBQUE7TUFDQSxPQUFBO1VBQ0EsU0FBQSxTQUFBLE9BQUE7WUFDQSxJQUFBLFFBQUEsUUFBQTtZQUNBLElBQUEsTUFBQTtjQUNBLE9BQUEsUUFBQSxvQkFBQTs7WUFFQSxPQUFBOzs7OztBQ1ZBLFFBQUEsT0FBQTtHQUNBLFFBQUEsV0FBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQTs7SUFFQSxLQUFBLFNBQUEsU0FBQSxPQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsTUFBQTtNQUNBLFFBQUEsYUFBQSxTQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsY0FBQSxLQUFBLFVBQUE7TUFDQSxXQUFBLGNBQUE7OztJQUdBLEtBQUEsVUFBQSxTQUFBLFdBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxXQUFBLGNBQUE7TUFDQSxJQUFBLFdBQUE7UUFDQTs7OztJQUlBLEtBQUEsV0FBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsWUFBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7O0FDckNBLFFBQUEsT0FBQTtHQUNBLFFBQUEsU0FBQTtJQUNBLFVBQUE7TUFDQSxPQUFBO1FBQ0EsV0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsS0FBQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQTs7UUFFQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLENBQUEsS0FBQTtZQUNBLE9BQUE7OztVQUdBLE9BQUEsSUFBQSxLQUFBOztVQUVBLE9BQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO1lBQ0EsTUFBQSxLQUFBLGVBQUEsTUFBQSxLQUFBOzs7Ozs7QUNuQkEsQ0FBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsT0FBQTtRQUNBLGNBQUEsU0FBQSxlQUFBLGFBQUEsWUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLFdBQUE7Z0JBQ0EsSUFBQSxjQUFBLEVBQUE7O2dCQUVBLElBQUEsU0FBQSxZQUFBO2dCQUNBLElBQUEsUUFBQSxZQUFBOztnQkFFQSxJQUFBLFVBQUEsTUFBQTtvQkFDQSxTQUFBOzs7Z0JBR0EsSUFBQSxTQUFBLE1BQUE7b0JBQ0EsUUFBQTs7OztnQkFJQSxJQUFBLFVBQUEsRUFBQSxtQkFBQSxRQUFBLGlCQUFBLFNBQUEscUNBQUEsU0FBQTtnQkFDQSxJQUFBLGFBQUEsRUFBQSxvQ0FBQSxRQUFBLEtBQUEsa0JBQUEsU0FBQSxLQUFBLHVDQUFBLFNBQUE7O2dCQUVBLElBQUEsUUFBQSxRQUFBO2dCQUNBLElBQUEsU0FBQSxXQUFBO2dCQUNBLElBQUEsVUFBQSxPQUFBLFdBQUE7Z0JBQ0EsSUFBQTs7Z0JBRUEsSUFBQSxPQUFBLFdBQUE7b0JBQ0EsSUFBQSxrQkFBQTt3QkFDQSxRQUFBLFVBQUEsT0FBQSxHQUFBLEdBQUEsS0FBQTs7d0JBRUEsSUFBQTs0QkFDQSxPQUFBOzBCQUNBLE9BQUEsR0FBQTs0QkFDQSxZQUFBLEdBQUE7Ozt3QkFHQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzsyQkFFQTt3QkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzs7O2dCQUlBLE9BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsVUFBQSxPQUFBO2dCQUNBLFVBQUEsZUFBQSxVQUFBLGdCQUFBLFVBQUEsc0JBQUEsVUFBQSxtQkFBQSxVQUFBOztnQkFFQSxJQUFBLGtCQUFBLFNBQUEsUUFBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLG1CQUFBO29CQUNBLEVBQUEsS0FBQSxZQUFBLElBQUEsVUFBQTs7b0JBRUEsTUFBQTtvQkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzs7O2dCQUlBLElBQUEsVUFBQSxjQUFBO29CQUNBLFVBQUEsYUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBLG1CQUFBLGlCQUFBLFNBQUEsT0FBQTt3QkFDQSxXQUFBLE9BQUE7O3VCQUVBO29CQUNBLFFBQUEsSUFBQTs7OztnQkFJQSxPQUFBLFdBQUEsVUFBQSxRQUFBO29CQUNBLGNBQUEsUUFBQTs7OztRQUlBLG1CQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxXQUFBOztnQkFFQSxFQUFBLE1BQUEsS0FBQSxVQUFBLGlCQUFBLFFBQUEsU0FBQSxZQUFBO29CQUNBLFdBQUE7OztnQkFHQSxhQUFBLEVBQUEsTUFBQSxLQUFBOzs7O0dBSUE7OztBQ2xGQSxTQUFBLElBQUEsTUFBQSxjQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxjQUFBLGNBQUEsS0FBQSxpQkFBQSxRQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLGlCQUFBLGdCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsZ0JBQUEsU0FBQSxTQUFBLG9CQUFBLFVBQUEsVUFBQSxDQUFBLEtBQUEsb0JBQUEsb0JBQUEsVUFBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFVBQUEsV0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFdBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsbUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxvQkFBQSxLQUFBLFlBQUEsS0FBQSxpQkFBQSxZQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsU0FBQSxPQUFBLElBQUEsT0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBLFlBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLFNBQUEsUUFBQSxjQUFBLHdCQUFBLFVBQUEsVUFBQSxVQUFBLFVBQUEsQ0FBQSxLQUFBLGNBQUEsY0FBQSxLQUFBLHdCQUFBLHdCQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsVUFBQSxVQUFBLFVBQUEsV0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLFlBQUEsVUFBQSxvQkFBQSxTQUFBLFVBQUEsY0FBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsS0FBQSxlQUFBLE1BQUEsS0FBQSxpQkFBQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGdCQUFBLEtBQUEsaUJBQUEsMEJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSwwQkFBQSxLQUFBLGlCQUFBLGlCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsaUJBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxHQUFBLEVBQUEsS0FBQSxnQkFBQSxLQUFBLHFCQUFBLFVBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxvQkFBQSxVQUFBLElBQUEsVUFBQSxXQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsVUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLHdCQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsd0JBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxVQUFBLFVBQUEsS0FBQSx3QkFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsT0FBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsVUFBQSxJQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsVUFBQSxHQUFBLEdBQUEsS0FBQSxjQUFBLElBQUEsVUFBQSxVQUFBLFVBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLFVBQUEsRUFBQSxVQUFBLEdBQUEsRUFBQSxJQUFBLFdBQUEsS0FBQSxvQkFBQSxTQUFBLFFBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsU0FBQSxlQUFBLENBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsU0FBQSxxQkFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsaUJBQUEsU0FBQSxPQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLFlBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxZQUFBLE9BQUEsRUFBQSxHQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLGNBQUEsS0FBQSxpQkFBQSxTQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxHQUFBLEVBQUEsUUFBQSxHQUFBLFlBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFFBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxZQUFBLFFBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxjQUFBLEtBQUEsYUFBQSxVQUFBLENBQUEsT0FBQSxJQUFBLHFCQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEscUJBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUEsT0FBQSxDQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsU0FBQSxNQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxvQkFBQSxLQUFBLEtBQUEseUJBQUEsU0FBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsT0FBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxLQUFBLEtBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxPQUFBLE1BQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxNQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsR0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxRQUFBLFFBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxNQUFBLE1BQUEsRUFBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBLE1BQUEsT0FBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsT0FBQSxJQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsU0FBQSxLQUFBLGlDQUFBLFNBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLHlCQUFBLE1BQUEsTUFBQSxJQUFBLEtBQUEsTUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLE9BQUEsRUFBQSxVQUFBLE1BQUEsT0FBQSxNQUFBLFVBQUEsU0FBQSxHQUFBLFVBQUEsT0FBQSxRQUFBLE1BQUEsQ0FBQSxPQUFBLE1BQUEsRUFBQSxRQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsTUFBQSxHQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxDQUFBLElBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxFQUFBLEVBQUEsVUFBQSxNQUFBLE9BQUEsTUFBQSxVQUFBLFNBQUEsR0FBQSxVQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxPQUFBLEVBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE9BQUEsR0FBQSxTQUFBLEtBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBLHlCQUFBLE1BQUEsTUFBQSxTQUFBLFVBQUEsT0FBQSxHQUFBLEtBQUEsMEJBQUEsU0FBQSxRQUFBLGFBQUEsQ0FBQSxJQUFBLGVBQUEsS0FBQSxpQ0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLGFBQUEsR0FBQSxLQUFBLE1BQUEsYUFBQSxJQUFBLGVBQUEsS0FBQSxpQ0FBQSxLQUFBLE1BQUEsYUFBQSxHQUFBLEtBQUEsTUFBQSxhQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUEsTUFBQSxnQkFBQSxlQUFBLEVBQUEsTUFBQSxnQkFBQSxlQUFBLEVBQUEsQ0FBQSxlQUFBLGdCQUFBLElBQUEsS0FBQSxvQkFBQSxTQUFBLFFBQUEsU0FBQSxXQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsMEJBQUEsUUFBQSxVQUFBLEtBQUEsMEJBQUEsUUFBQSxhQUFBLEdBQUEsS0FBQSxTQUFBLFNBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLEtBQUEsaUJBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxXQUFBLENBQUEsSUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsVUFBQSxZQUFBLHFCQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLFlBQUEsVUFBQSxDQUFBLHFCQUFBLHNCQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxLQUFBLEVBQUEsWUFBQSxNQUFBLEtBQUEsRUFBQSxZQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUEsUUFBQSxPQUFBLFdBQUEsS0FBQSxzQkFBQSxTQUFBLHFCQUFBLGNBQUEsY0FBQSxnQkFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsZ0JBQUEsc0JBQUEsbUJBQUEsS0FBQSxJQUFBLEVBQUEsY0FBQSxXQUFBLG9CQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsRUFBQSxjQUFBLFdBQUEsR0FBQSxFQUFBLHFCQUFBLG9CQUFBLG1CQUFBLEtBQUEsUUFBQSxJQUFBLGtCQUFBLEtBQUEsSUFBQSxFQUFBLGNBQUEsV0FBQSxxQkFBQSxLQUFBLElBQUEsT0FBQSxPQUFBLEVBQUEsY0FBQSxXQUFBLGdCQUFBLElBQUEsdUJBQUEsS0FBQSxNQUFBLG1CQUFBLGtCQUFBLG9CQUFBLG1CQUFBLHFCQUFBLGtCQUFBLHFCQUFBLEtBQUEscUJBQUEsT0FBQSxnQkFBQSxRQUFBLEtBQUEsZ0JBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxpQkFBQSxVQUFBLENBQUEsSUFBQSxhQUFBLGFBQUEsbUJBQUEsbUJBQUEsY0FBQSxVQUFBLElBQUEsTUFBQSxrQkFBQSxhQUFBLGlCQUFBLEVBQUEsYUFBQSxpQkFBQSxFQUFBLG1CQUFBLG1CQUFBLGNBQUEsSUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLGFBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsbUJBQUEsbUJBQUEsZUFBQSxJQUFBLFVBQUEscUJBQUEsNkJBQUEsSUFBQSxJQUFBLGNBQUEsSUFBQSxtQkFBQSxtQkFBQSxJQUFBLGNBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLGFBQUEsYUFBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE9BQUEsV0FBQSxLQUFBLFdBQUEsU0FBQSxNQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsUUFBQSxZQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQSxZQUFBLEtBQUEseUJBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsU0FBQSxXQUFBLEtBQUEsV0FBQSxXQUFBLEtBQUEsb0JBQUEsUUFBQSxTQUFBLFlBQUEsR0FBQSxFQUFBLFdBQUEsS0FBQSxRQUFBLElBQUEsVUFBQSxLQUFBLGlCQUFBLFFBQUEsU0FBQSxXQUFBLFlBQUEsbUJBQUEsUUFBQSxrQ0FBQSxXQUFBLHdCQUFBLG1CQUFBLG9CQUFBLEVBQUEsaUJBQUEsS0FBQSxHQUFBLG1CQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG9CQUFBLEVBQUEsRUFBQSx3QkFBQSxjQUFBLEtBQUEsTUFBQSxRQUFBLEVBQUEscUJBQUEsYUFBQSxRQUFBLElBQUEsY0FBQSxLQUFBLE1BQUEsUUFBQSxFQUFBLHFCQUFBLGFBQUEsUUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsaUJBQUEsS0FBQSxzQkFBQSxXQUFBLGNBQUEsY0FBQSxHQUFBLE1BQUEsSUFBQSxPQUFBLFVBQUEsS0FBQSxnQkFBQSxRQUFBLFNBQUEsV0FBQSxpQkFBQSxXQUFBLEtBQUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxVQUFBLFdBQUEsT0FBQSxPQUFBLE1BQUEsaUJBQUEsSUFBQSxNQUFBLFdBQUEsUUFBQSxVQUFBLElBQUEsTUFBQSxXQUFBLFFBQUEsU0FBQSxrQkFBQSxJQUFBLGVBQUEsS0FBQSxTQUFBLEtBQUEsT0FBQSxVQUFBLENBQUEsSUFBQSxLQUFBLENBQUEsSUFBQSxxQkFBQSxrQkFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLHlCQUFBLE9BQUEsU0FBQSxrQkFBQSxXQUFBLENBQUEsS0FBQSxxQkFBQSxxQkFBQSxRQUFBLFlBQUEsRUFBQSxHQUFBLEtBQUEsU0FBQSxFQUFBLFdBQUEsS0FBQSxpQkFBQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHVCQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLFVBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxDQUFBLElBQUEsTUFBQSxFQUFBLE9BQUEsS0FBQSxzQkFBQSxNQUFBLHNCQUFBLEtBQUEsVUFBQSxNQUFBLFVBQUEsU0FBQSxxQkFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsc0JBQUEsUUFBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsdUJBQUEsU0FBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxLQUFBLHlDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsT0FBQSxPQUFBLElBQUEsUUFBQSxPQUFBLEVBQUEsSUFBQSxHQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxLQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxFQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxTQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBLGlCQUFBLFlBQUEsVUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLG1EQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsWUFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsT0FBQSxJQUFBLEVBQUEsUUFBQSxLQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsS0FBQSxZQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsTUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLG1DQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsTUFBQSxLQUFBLHNDQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUEsUUFBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLHdDQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFFBQUEsRUFBQSxLQUFBLE1BQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxRQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxTQUFBLFVBQUEsaUJBQUEsVUFBQSxDQUFBLEtBQUEsaUJBQUEsaUJBQUEsS0FBQSxVQUFBLFVBQUEsS0FBQSxpQkFBQSxtQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLG1CQUFBLEtBQUEsaUJBQUEsWUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFlBQUEsU0FBQSxnQkFBQSxVQUFBLENBQUEsSUFBQSxVQUFBLFVBQUEsVUFBQSxHQUFBLEdBQUEsV0FBQSxJQUFBLEVBQUEsV0FBQSxLQUFBLHdCQUFBLEtBQUEsVUFBQSxVQUFBLEtBQUEsY0FBQSxLQUFBLEtBQUEsaUJBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLEVBQUEsWUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLFlBQUEsRUFBQSxHQUFBLGFBQUEsRUFBQSxFQUFBLGFBQUEsR0FBQSxLQUFBLHNCQUFBLFVBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxpQkFBQSxPQUFBLEtBQUEsaUJBQUEsSUFBQSxJQUFBLGVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLEdBQUEsS0FBQSxpQkFBQSxrQkFBQSx3QkFBQSxnQkFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQSxlQUFBLEVBQUEsSUFBQSxJQUFBLEtBQUEsVUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsS0FBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLEdBQUEsS0FBQSxpQkFBQSxrQkFBQSx3QkFBQSxnQkFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsK0JBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxjQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQSxtQkFBQSxVQUFBLElBQUEsRUFBQSxHQUFBLEdBQUEsbUJBQUEsT0FBQSxRQUFBLG9CQUFBLG9CQUFBLElBQUEsSUFBQSxZQUFBLEVBQUEsTUFBQSxVQUFBLEdBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLE1BQUEsSUFBQSxZQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsYUFBQSxHQUFBLEtBQUEsY0FBQSxRQUFBLHlCQUFBLGFBQUEsTUFBQSxLQUFBLGVBQUEsS0FBQSxjQUFBLHFCQUFBLFVBQUEsT0FBQSxLQUFBLGNBQUEsWUFBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsTUFBQSxJQUFBLFlBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxhQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUEseUJBQUEsYUFBQSxNQUFBLEtBQUEsZUFBQSxLQUFBLGNBQUEscUJBQUEsVUFBQSxPQUFBLEtBQUEsY0FBQSxLQUFBLHFCQUFBLEtBQUEsY0FBQSxVQUFBLENBQUEsSUFBQSxXQUFBLEtBQUEsd0JBQUEsUUFBQSxLQUFBLGNBQUEsU0FBQSxTQUFBLGFBQUEsV0FBQSxVQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsU0FBQSxnQkFBQSxLQUFBLFVBQUEsV0FBQSxJQUFBLElBQUEsZ0JBQUEsUUFBQSx1QkFBQSxVQUFBLENBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxRQUFBLGdCQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxFQUFBLFVBQUEsTUFBQSxRQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQSxFQUFBLE1BQUEsTUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLE1BQUEsZ0JBQUEsWUFBQSxFQUFBLElBQUEsS0FBQSxXQUFBLGNBQUEsRUFBQSxLQUFBLFVBQUEsWUFBQSxFQUFBLElBQUEsS0FBQSxhQUFBLEdBQUEsR0FBQSxXQUFBLE9BQUEsZ0JBQUEsWUFBQSxTQUFBLEVBQUEsWUFBQSxJQUFBLFdBQUEsQ0FBQSxFQUFBLEdBQUEsY0FBQSxRQUFBLGVBQUEsS0FBQSxzQkFBQSxPQUFBLFFBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxFQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxNQUFBLENBQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEVBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxNQUFBLEtBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsU0FBQSxtQkFBQSxNQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLFNBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxVQUFBLHFCQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLHFCQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLFdBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxLQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsV0FBQSxFQUFBLEVBQUEsSUFBQSxxQkFBQSxxQkFBQSxPQUFBLEVBQUEsR0FBQSxLQUFBLEdBQUEsT0FBQSxRQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxJQUFBLElBQUEsU0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLHNCQUFBLFdBQUEsS0FBQSxzQkFBQSxLQUFBLE1BQUEsY0FBQSxLQUFBLEdBQUEsU0FBQSxNQUFBLE1BQUEsV0FBQSxHQUFBLE1BQUEsV0FBQSxHQUFBLGVBQUEsS0FBQSxtQkFBQSxPQUFBLGdCQUFBLEtBQUEsb0JBQUEsTUFBQSxlQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsZUFBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFNBQUEsU0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLElBQUEsZUFBQSxJQUFBLEdBQUEsRUFBQSxTQUFBLEtBQUEsMENBQUEsU0FBQSxVQUFBLE1BQUEsY0FBQSxTQUFBLFVBQUEsZ0JBQUEsTUFBQSxLQUFBLHNCQUFBLFNBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLEVBQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFVBQUEsTUFBQSxVQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEtBQUEsbUJBQUEsRUFBQSxVQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLHVCQUFBLE1BQUEsZUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsUUFBQSx3QkFBQSxFQUFBLFFBQUEsTUFBQSxRQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsSUFBQSxXQUFBLEVBQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxFQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxFQUFBLGNBQUEsS0FBQSxNQUFBLGNBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxjQUFBLE1BQUEsbUJBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxVQUFBLE9BQUEsY0FBQSxXQUFBLEVBQUEsRUFBQSxVQUFBLE9BQUEsY0FBQSxXQUFBLElBQUEsaUJBQUEsRUFBQSxlQUFBLEdBQUEsR0FBQSxHQUFBLGlCQUFBLEtBQUEsOENBQUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLGtCQUFBLE1BQUEsRUFBQSxVQUFBLFNBQUEsTUFBQSxFQUFBLFVBQUEsU0FBQSxPQUFBLElBQUEsTUFBQSxNQUFBLFFBQUEsS0FBQSxtQkFBQSxTQUFBLGFBQUEsQ0FBQSxJQUFBLFVBQUEsYUFBQSxPQUFBLEdBQUEsR0FBQSxVQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsZUFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLFVBQUEsRUFBQSxJQUFBLEdBQUEsYUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsVUFBQSxLQUFBLHNEQUFBLE9BQUEsUUFBQSxLQUFBLG9CQUFBLFNBQUEsZUFBQSxlQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxlQUFBLE9BQUEsT0FBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsUUFBQSxlQUFBLElBQUEsWUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxLQUFBLE1BQUEsU0FBQSxZQUFBLE1BQUEsY0FBQSxFQUFBLEtBQUEsTUFBQSxTQUFBLGVBQUEsR0FBQSxjQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxlQUFBLFdBQUEsV0FBQSxLQUFBLE1BQUEsUUFBQSxjQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQSxZQUFBLE9BQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxhQUFBLENBQUEsR0FBQSxNQUFBLGNBQUEsR0FBQSxhQUFBLE9BQUEsS0FBQSwyQkFBQSxLQUFBLE1BQUEsTUFBQSxJQUFBLG1CQUFBLGFBQUEsT0FBQSxHQUFBLG1CQUFBLEdBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsYUFBQSxFQUFBLG1CQUFBLGNBQUEsR0FBQSxhQUFBLGVBQUEsZUFBQSxHQUFBLGNBQUEsbUJBQUEsS0FBQSxhQUFBLE1BQUEsS0FBQSxpQkFBQSxDQUFBLEtBQUEsYUFBQSxJQUFBLE1BQUEsbUJBQUEsY0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxLQUFBLGFBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxJQUFBLGFBQUEsYUFBQSxVQUFBLEtBQUEsYUFBQSxhQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxLQUFBLEtBQUEsaUJBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGFBQUEsT0FBQSxJQUFBLEtBQUEsaUJBQUEsZUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGVBQUEsS0FBQSxlQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsYUFBQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLGVBQUEsR0FBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxPQUFBLE1BQUEsY0FBQSxPQUFBLEtBQUEsYUFBQSxJQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsUUFBQSxLQUFBLGFBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxNQUFBLGNBQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEtBQUEsYUFBQSxJQUFBLE9BQUEsU0FBQSxLQUFBLGNBQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxLQUFBLEtBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxJQUFBLG9CQUFBLEtBQUEsYUFBQSxtQkFBQSxNQUFBLGFBQUEsR0FBQSxvQkFBQSxPQUFBLG1CQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsb0JBQUEsb0JBQUEsbUJBQUEsbUJBQUEsS0FBQSxJQUFBLElBQUEsUUFBQSxJQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLG1CQUFBLE9BQUEsb0JBQUEsT0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEtBQUEsUUFBQSxJQUFBLG1CQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLE9BQUEsSUFBQSxRQUFBLEdBQUEsTUFBQSxjQUFBLG9CQUFBLEVBQUEsWUFBQSxtQkFBQSxJQUFBLE9BQUEsSUFBQSxVQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLGNBQUEsS0FBQSxhQUFBLFFBQUEsY0FBQSxPQUFBLGNBQUEsTUFBQSxhQUFBLFFBQUEsY0FBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxHQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxjQUFBLEdBQUEsRUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLFFBQUEsRUFBQSxHQUFBLE1BQUEsY0FBQSxRQUFBLEVBQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLGNBQUEsS0FBQSxPQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsYUFBQSxHQUFBLFFBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsMkJBQUEsR0FBQSxHQUFBLFlBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxLQUFBLGFBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxhQUFBLEdBQUEsYUFBQSxPQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxjQUFBLElBQUEsSUFBQSxTQUFBLEtBQUEsTUFBQSxLQUFBLFVBQUEsS0FBQSx1QkFBQSxNQUFBLGVBQUEsTUFBQSxRQUFBLDhCQUFBLEtBQUEsTUFBQSxRQUFBLHdCQUFBLFVBQUEsUUFBQSxNQUFBLFFBQUEsQ0FBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLGlCQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxVQUFBLGVBQUEsVUFBQSxRQUFBLCtCQUFBLEtBQUEsTUFBQSxtQkFBQSxpQkFBQSxPQUFBLGtCQUFBLEtBQUEsTUFBQSxjQUFBLGlCQUFBLE9BQUEsU0FBQSxTQUFBLGNBQUEsbUJBQUEsVUFBQSxVQUFBLGNBQUEsTUFBQSxPQUFBLElBQUEsTUFBQSxTQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsTUFBQSxHQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxLQUFBLElBQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsR0FBQSxJQUFBLEdBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxVQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsS0FBQSxpQkFBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLE1BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsY0FBQSxTQUFBLE9BQUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsMkJBQUEsR0FBQSxHQUFBLFlBQUEsT0FBQSxLQUFBLElBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxPQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEVBQUEsT0FBQSxhQUFBLEdBQUEsWUFBQSxJQUFBLFVBQUEsS0FBQSxlQUFBLEtBQUEsSUFBQSxTQUFBLEVBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxLQUFBLDJCQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLEtBQUEsNkJBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEdBQUEsR0FBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxLQUFBLFNBQUEsQ0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsRUFBQSxRQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsU0FBQSxjQUFBLEtBQUEsS0FBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsb0JBQUEsb0JBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsSUFBQSxLQUFBLGlCQUFBLElBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxJQUFBLEtBQUEsZUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLEtBQUEsWUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsWUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsZUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBLHFCQUFBLE9BQUEsR0FBQSxnQkFBQSxlQUFBLEtBQUEscUJBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxTQUFBLGtCQUFBLGVBQUEsQ0FBQSxLQUFBLFdBQUEsZUFBQSxHQUFBLEtBQUEsUUFBQSxlQUFBLEdBQUEsS0FBQSxTQUFBLGVBQUEsR0FBQSxLQUFBLGlCQUFBLGFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsaUJBQUEsVUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQSxpQkFBQSxXQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsV0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsV0FBQSxDQUFBLEVBQUEsS0FBQSxxQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEtBQUEsb0JBQUEsS0FBQSxLQUFBLGlCQUFBLHVCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEsdUJBQUEsS0FBQSxrQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsZ0JBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsV0FBQSxHQUFBLEdBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBLGlCQUFBLE1BQUEsR0FBQSxFQUFBLGdCQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsV0FBQSxLQUFBLE1BQUEsQ0FBQSxpQkFBQSxvQkFBQSxHQUFBLFlBQUEsS0FBQSxNQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxhQUFBLEtBQUEsSUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxhQUFBLEtBQUEsSUFBQSxFQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLEVBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLGNBQUEsU0FBQSxXQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLG1CQUFBLFNBQUEsT0FBQSxRQUFBLFNBQUEsd0JBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxLQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSxFQUFBLHdCQUFBLElBQUEsS0FBQSxrQkFBQSxZQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLHFCQUFBLFNBQUEsT0FBQSxRQUFBLFNBQUEsd0JBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE1BQUEsV0FBQSxLQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsbUJBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxXQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxRQUFBLEtBQUEscUJBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxNQUFBLFNBQUEsV0FBQSxHQUFBLGlCQUFBLENBQUEsTUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLG9CQUFBLGdCQUFBLEVBQUEsTUFBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE9BQUEsWUFBQSxvQkFBQSxRQUFBLFNBQUEsQ0FBQSxPQUFBLGlCQUFBLE1BQUEsQ0FBQSxFQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsSUFBQSxjQUFBLFFBQUEsUUFBQSxxQkFBQSxLQUFBLGdCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEscUJBQUEsS0FBQSxvQkFBQSx5QkFBQSxPQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsbUJBQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxFQUFBLFVBQUEsS0FBQSx1Q0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxnQkFBQSxFQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxpQkFBQSxLQUFBLGdCQUFBLEdBQUEsb0JBQUEsSUFBQSxJQUFBLFFBQUEsZ0JBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLGdCQUFBLFFBQUEsS0FBQSxnQkFBQSxPQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxJQUFBLFFBQUEsb0JBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsTUFBQSxPQUFBLEtBQUEsZ0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsZ0JBQUEsS0FBQSxLQUFBLFlBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxHQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxxQkFBQSxLQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLGdCQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsY0FBQSxDQUFBLEdBQUEsTUFBQSxxQkFBQSxPQUFBLEtBQUEsV0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLENBQUEsS0FBQSxJQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEtBQUEsSUFBQSxxQkFBQSxFQUFBLE9BQUEsSUFBQSxHQUFBLHFCQUFBLFFBQUEsT0FBQSxHQUFBLEtBQUEsNkJBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxnQkFBQSxHQUFBLFFBQUEsT0FBQSxnQkFBQSxpQkFBQSxpQkFBQSxRQUFBLHFCQUFBLEdBQUEsRUFBQSxlQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxRQUFBLGdCQUFBLElBQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxRQUFBLEtBQUEsZ0JBQUEsR0FBQSxnQkFBQSxLQUFBLElBQUEsUUFBQSxvQkFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxnQkFBQSxLQUFBLGtCQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsU0FBQSxPQUFBLGFBQUEsTUFBQSxVQUFBLElBQUEsSUFBQSxLQUFBLENBQUEsRUFBQSxXQUFBLElBQUEsTUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsR0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsR0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxFQUFBLGVBQUEsZUFBQSxXQUFBLHFCQUFBLEdBQUEsSUFBQSxFQUFBLGNBQUEsR0FBQSxHQUFBLGFBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsR0FBQSxHQUFBLFVBQUEsR0FBQSxNQUFBLEVBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxtQ0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLGNBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLEVBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsUUFBQSxJQUFBLGFBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsT0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxhQUFBLE9BQUEsV0FBQSxFQUFBLHFCQUFBLFdBQUEsZ0JBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsTUFBQSxZQUFBLE1BQUEsV0FBQSxHQUFBLEtBQUEsYUFBQSxLQUFBLGtDQUFBLElBQUEsWUFBQSxLQUFBLHFCQUFBLE9BQUEsT0FBQSxrQkFBQSxhQUFBLElBQUEsa0JBQUEsY0FBQSxTQUFBLGlCQUFBLEtBQUEsS0FBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsb0JBQUEsb0JBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxlQUFBLFVBQUEsQ0FBQSxLQUFBLFNBQUEsS0FBQSxZQUFBLFNBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxXQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsSUFBQSxXQUFBLEtBQUEscUJBQUEsT0FBQSxHQUFBLGdCQUFBLGVBQUEsS0FBQSxxQkFBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLFNBQUEsdUJBQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLFdBQUEsb0JBQUEsQ0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLGdCQUFBLElBQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLFdBQUEsV0FBQSxLQUFBLHFCQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsY0FBQSxTQUFBLFdBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxrQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsV0FBQSxLQUFBLFdBQUEsWUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFdBQUEsV0FBQSxLQUFBLFlBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxXQUFBLEtBQUEscUJBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsZ0JBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSxFQUFBLHdCQUFBLElBQUEsS0FBQSxrQkFBQSxZQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLHFCQUFBLFNBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsbUJBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxFQUFBLFdBQUEsR0FBQSxpQkFBQSxHQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsSUFBQSxJQUFBLG9CQUFBLENBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxNQUFBLFFBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsT0FBQSxZQUFBLG9CQUFBLFFBQUEsU0FBQSxPQUFBLElBQUEsaUJBQUEsUUFBQSxRQUFBLHFCQUFBLElBQUEsTUFBQSxJQUFBLGlCQUFBLFFBQUEsUUFBQSxxQkFBQSxLQUFBLGdCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEscUJBQUEsS0FBQSxvQkFBQSx5QkFBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxHQUFBLFdBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxHQUFBLEtBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLElBQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxHQUFBLElBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsYUFBQSxFQUFBLEtBQUEsR0FBQSxDQUFBLEdBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsR0FBQSxhQUFBLFdBQUEscUJBQUEsR0FBQSxHQUFBLGFBQUEsQ0FBQSxHQUFBLEtBQUEsa0JBQUEsWUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsVUFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLGFBQUEsT0FBQSxXQUFBLEVBQUEscUJBQUEsR0FBQSxjQUFBLGVBQUEsV0FBQSxnQkFBQSxJQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLE1BQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsT0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSwyQ0FBQSxTQUFBLHNCQUFBLE9BQUEsUUFBQSx1QkFBQSxDQUFBLEtBQUEsYUFBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsdUJBQUEsdUJBQUEsR0FBQSxRQUFBLEtBQUEsZUFBQSxFQUFBLFNBQUEsSUFBQSxJQUFBLFFBQUEsS0FBQSxlQUFBLEVBQUEsU0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLGVBQUEsR0FBQSxLQUFBLFlBQUEsU0FBQSxRQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxHQUFBLEVBQUEsT0FBQSxPQUFBLEtBQUEsV0FBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsT0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsWUFBQSxRQUFBLEtBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLENBQUEsS0FBQSxPQUFBLEtBQUEsY0FBQSxRQUFBLFNBQUEsS0FBQSxXQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEtBQUEsV0FBQSxRQUFBLEVBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEVBQUEsS0FBQSxZQUFBLEtBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLElBQUEsZUFBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsUUFBQSxTQUFBLEtBQUEsV0FBQSxHQUFBLEtBQUEsZUFBQSxJQUFBLGdCQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLEtBQUEsZUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLElBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsSUFBQSxJQUFBLGVBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsT0FBQSxLQUFBLGVBQUEsZ0JBQUEsZUFBQSxLQUFBLFdBQUEsS0FBQSxXQUFBLENBQUEsUUFBQSxHQUFBLEVBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEVBQUEsS0FBQSxZQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGFBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSx1QkFBQSxFQUFBLEVBQUEsS0FBQSxZQUFBLElBQUEsS0FBQSxjQUFBLFNBQUEsY0FBQSxDQUFBLElBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQSxHQUFBLGVBQUEsT0FBQSxFQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsWUFBQSxPQUFBLHFCQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLHdCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxRQUFBLEdBQUEsb0JBQUEsSUFBQSxNQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsQ0FBQSxRQUFBLEtBQUEsWUFBQSxJQUFBLElBQUEsWUFBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLGFBQUEsUUFBQSxHQUFBLFNBQUEsb0JBQUEsYUFBQSxTQUFBLG9CQUFBLGNBQUEsUUFBQSxPQUFBLEdBQUEsU0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLFNBQUEsb0JBQUEsU0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLGdCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxRQUFBLEdBQUEsR0FBQSxRQUFBLEdBQUEsUUFBQSxLQUFBLFlBQUEsSUFBQSxJQUFBLFVBQUEsU0FBQSxLQUFBLEdBQUEsVUFBQSxTQUFBLEtBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLEdBQUEsVUFBQSxTQUFBLEtBQUEsUUFBQSxHQUFBLEdBQUEsU0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLFFBQUEsR0FBQSxTQUFBLGNBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLGlCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxHQUFBLFFBQUEsS0FBQSxZQUFBLEdBQUEsT0FBQSxLQUFBLFNBQUEsZUFBQSxPQUFBLEdBQUEsT0FBQSxRQUFBLEtBQUEsZUFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsY0FBQSxHQUFBLEVBQUEsQ0FBQSxRQUFBLFlBQUEsSUFBQSxJQUFBLFVBQUEsUUFBQSxJQUFBLFdBQUEsUUFBQSxJQUFBLFNBQUEsQ0FBQSxZQUFBLEdBQUEsVUFBQSxhQUFBLEVBQUEsYUFBQSxPQUFBLFNBQUEsTUFBQSxTQUFBLE1BQUEsU0FBQSxNQUFBLGVBQUEsT0FBQSxhQUFBLGNBQUEsZUFBQSxPQUFBLEdBQUEsT0FBQSxlQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLFlBQUEsRUFBQSxzQkFBQSxFQUFBLGVBQUEsRUFBQSxXQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxPQUFBLE9BQUEsRUFBQSxNQUFBLEtBQUEsbUJBQUEsR0FBQSxNQUFBLGFBQUEsTUFBQSx1QkFBQSxNQUFBLGdCQUFBLE1BQUEsV0FBQSxLQUFBLGlCQUFBLEtBQUEsY0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLFdBQUEsSUFBQSxHQUFBLFdBQUEsS0FBQSxjQUFBLE1BQUEsV0FBQSxFQUFBLEtBQUEsd0JBQUEsV0FBQSxPQUFBLE1BQUEsS0FBQSxZQUFBLElBQUEsSUFBQSxTQUFBLEtBQUEsZ0JBQUEsWUFBQSxHQUFBLElBQUEsTUFBQSxTQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxPQUFBLElBQUEsR0FBQSxHQUFBLFNBQUEsV0FBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE1BQUEsS0FBQSxzQkFBQSxJQUFBLElBQUEsU0FBQSxLQUFBLHdCQUFBLFlBQUEsR0FBQSxJQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxNQUFBLEtBQUEsZUFBQSxJQUFBLGlCQUFBLEtBQUEsaUJBQUEsWUFBQSxPQUFBLEtBQUEsa0JBQUEsTUFBQSxLQUFBLFdBQUEsSUFBQSxTQUFBLEtBQUEsZUFBQSxZQUFBLE9BQUEsS0FBQSxXQUFBLE9BQUEsU0FBQSxZQUFBLEdBQUEsWUFBQSxvQkFBQSxTQUFBLE1BQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLE9BQUEsSUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSw2QkFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLFFBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFFBQUEsT0FBQSxRQUFBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsR0FBQSxPQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsT0FBQSxDQUFBLEVBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLEVBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsNkJBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxLQUFBLFlBQUEsWUFBQSxTQUFBLE1BQUEsVUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLFdBQUEsT0FBQSxJQUFBLE1BQUEsV0FBQSxHQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxPQUFBLFVBQUEsaUJBQUEsUUFBQSxZQUFBLG9CQUFBLE1BQUEsUUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUEsT0FBQSxFQUFBLElBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsWUFBQSxHQUFBLEVBQUEsSUFBQSxNQUFBLE9BQUEsQ0FBQSxLQUFBLDZCQUFBLE9BQUEsTUFBQSxZQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsVUFBQSxxQkFBQSw2QkFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE9BQUEsWUFBQSxZQUFBLE1BQUEsVUFBQSxZQUFBLFFBQUEsb0JBQUEsSUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGdCQUFBLFFBQUEsb0JBQUEsU0FBQSxjQUFBLENBQUEsR0FBQSxFQUFBLGVBQUEsY0FBQSxHQUFBLEtBQUEsb0JBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQSxJQUFBLFFBQUEsa0NBQUEsU0FBQSxVQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsRUFBQSxLQUFBLDBDQUFBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsb0JBQUEsVUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLENBQUEsS0FBQSw4QkFBQSxRQUFBLHlCQUFBLFNBQUEsWUFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLFdBQUEsWUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsb0JBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxjQUFBLFFBQUEsb0JBQUEsR0FBQSxHQUFBLGVBQUEsWUFBQSxPQUFBLEtBQUEsb0JBQUEsRUFBQSxHQUFBLElBQUEsZUFBQSxrQkFBQSxpQkFBQSxZQUFBLGVBQUEsZUFBQSxpQkFBQSxZQUFBLEVBQUEsRUFBQSxlQUFBLGdCQUFBLE9BQUEsR0FBQSxlQUFBLEtBQUEsb0JBQUEsYUFBQSxNQUFBLHFCQUFBLDZCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxLQUFBLHNCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsc0JBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLE9BQUEscUJBQUEsc0JBQUEsU0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxJQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsWUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLFlBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsWUFBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLHFCQUFBLHNCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxnQkFBQSxJQUFBLG9CQUFBLE1BQUEsMEJBQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsS0FBQSxzQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxrQkFBQSxpQkFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsR0FBQSxFQUFBLHNCQUFBLEdBQUEsR0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxJQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLElBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxLQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxNQUFBLGtCQUFBLHdCQUFBLFNBQUEsaUJBQUEsQ0FBQSxJQUFBLFdBQUEsa0JBQUEsMEJBQUEsa0JBQUEsT0FBQSxNQUFBLFdBQUEsV0FBQSxrQkFBQSwwQkFBQSxpQkFBQSxzQkFBQSxrQkFBQSwwQkFBQSxTQUFBLGlCQUFBLENBQUEsSUFBQSxJQUFBLGVBQUEsV0FBQSxlQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsMEJBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxXQUFBLDBCQUFBLEdBQUEsV0FBQSxXQUFBLEdBQUEsR0FBQSxZQUFBLGlCQUFBLE9BQUEsSUFBQSxrQkFBQSxXQUFBLElBQUEsSUFBQSxlQUFBLEtBQUEsaUJBQUEsaUJBQUEsWUFBQSxlQUFBLGlCQUFBLGVBQUEsV0FBQSxHQUFBLGVBQUEsZ0JBQUEsT0FBQSxHQUFBLGVBQUEsSUFBQSxrQkFBQSxnQkFBQSxNQUFBLHFCQUFBLFFBQUEsU0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsS0FBQSxvQkFBQSxPQUFBLFNBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLHFCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsY0FBQSxTQUFBLGFBQUEsUUFBQSxRQUFBLENBQUEsR0FBQSxhQUFBLFFBQUEsUUFBQSxlQUFBLEtBQUEsb0JBQUEsSUFBQSxJQUFBLFNBQUEsUUFBQSxvQkFBQSxTQUFBLFlBQUEsRUFBQSxhQUFBLFNBQUEsY0FBQSxFQUFBLEVBQUEsRUFBQSxhQUFBLE9BQUEsSUFBQSxhQUFBLGFBQUEsR0FBQSxNQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLGdCQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsSUFBQSxJQUFBLFFBQUEsYUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxpQkFBQSxRQUFBLGNBQUEsa0JBQUEsU0FBQSxvQkFBQSxpQkFBQSxPQUFBLG1CQUFBLElBQUEsVUFBQSxpQkFBQSxJQUFBLE1BQUEsb0JBQUEsSUFBQSxJQUFBLDRCQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsb0JBQUEsT0FBQSxPQUFBLEVBQUEscUJBQUEsR0FBQSxDQUFBLElBQUEsYUFBQSxPQUFBLHFCQUFBLFVBQUEsT0FBQSxHQUFBLGNBQUEsNEJBQUEsTUFBQSxzQkFBQSxzQkFBQSxJQUFBLElBQUEsOEJBQUEsNEJBQUEsU0FBQSxvQkFBQSxtQkFBQSxFQUFBLEVBQUEsRUFBQSw4QkFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsT0FBQSxHQUFBLFVBQUEsR0FBQSxhQUFBLHNCQUFBLElBQUEsSUFBQSxFQUFBLG9CQUFBLGdCQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSwrQkFBQSxhQUFBLHNCQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsRUFBQSw4QkFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxvQkFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsYUFBQSxzQkFBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsYUFBQSxTQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQUEsV0FBQSxVQUFBLEVBQUEsS0FBQSwyQkFBQSxPQUFBLFNBQUEsV0FBQSxZQUFBLFNBQUEsV0FBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsYUFBQSxNQUFBLGNBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxrQkFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLGNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsUUFBQSxVQUFBLElBQUEsbUJBQUEsTUFBQSxlQUFBLFFBQUEsY0FBQSxTQUFBLGNBQUEsaUJBQUEsQ0FBQSxJQUFBLElBQUEsYUFBQSxjQUFBLE9BQUEsY0FBQSxJQUFBLE1BQUEsY0FBQSxFQUFBLEVBQUEsYUFBQSxFQUFBLElBQUEsY0FBQSxHQUFBLElBQUEsY0FBQSxHQUFBLElBQUEsZUFBQSxjQUFBLE9BQUEsaUJBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxPQUFBLGNBQUEsZ0JBQUEsTUFBQSxJQUFBLENBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLGNBQUEsR0FBQSxjQUFBLElBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsZ0JBQUEsTUFBQSxRQUFBLE9BQUEsY0FBQSxRQUFBLE9BQUEsd0JBQUEscUJBQUEsVUFBQSxPQUFBLGdCQUFBLFdBQUEsVUFBQSxjQUFBLFVBQUEsUUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxXQUFBLE9BQUEsSUFBQSxZQUFBLFdBQUEsR0FBQSxpQkFBQSxJQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsWUFBQSxhQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFVBQUEsV0FBQSxHQUFBLGNBQUEsVUFBQSxVQUFBLGlCQUFBLFVBQUEsaUJBQUEsUUFBQSxjQUFBLGNBQUEsa0JBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxpQkFBQSxFQUFBLElBQUEsWUFBQSxnQkFBQSxjQUFBLEdBQUEsSUFBQSxPQUFBLElBQUEsc0JBQUEsWUFBQSxRQUFBLGNBQUEsUUFBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxNQUFBLENBQUEsRUFBQSxPQUFBLHFCQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBLE9BQUEsQ0FBQSxJQUFBLFVBQUEsU0FBQSxlQUFBLGFBQUEsUUFBQSxVQUFBLFdBQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsUUFBQSxhQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE1BQUEsT0FBQSxVQUFBLENBQUEsSUFBQSxVQUFBLFNBQUEsY0FBQSxVQUFBLFFBQUEsVUFBQSxXQUFBLE1BQUEsV0FBQSxTQUFBLGVBQUEsY0FBQSxHQUFBLE1BQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFdBQUEsTUFBQSxPQUFBLFVBQUEsRUFBQSxFQUFBLElBQUEsS0FBQSxPQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsSUFBQSxLQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFVBQUEsTUFBQSxFQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsUUFBQSxhQUFBLEVBQUEsRUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLE1BQUEsRUFBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLGtIQUFBLEtBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUEsRUFBQSxDQUFBLFFBQUEsSUFBQSxHQUFBLE9BQUEsT0FBQSx5QkFBQSxNQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxTQUFBLEVBQUEsQ0FBQSxPQUFBLG1CQUFBLE9BQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxJQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsSUFBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLGtCQUFBLE9BQUEsYUFBQSxHQUFBLE9BQUEsTUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxNQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLEVBQUEsSUFBQSxhQUFBLE9BQUEsVUFBQSxFQUFBLEdBQUEsSUFBQSxTQUFBLElBQUEsU0FBQSxPQUFBLGFBQUEsU0FBQSxTQUFBLE9BQUEsT0FBQSxJQUFBLGFBQUEsT0FBQSxVQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsT0FBQSxRQUFBLE9BQUEsYUFBQSxNQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxHQUFBLE9BQUEsSUFBQSxLQUFBLE9BQUEsYUFBQSxLQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsWUFBQSxNQUFBLE9BQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsT0FBQSxNQUFBLEVBQUEsS0FBQSxjQUFBLEdBQUEsT0FBQSxPQUFBLEVBQUEsS0FBQSxjQUFBLE9BQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxHQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxJQUFBLElBQUEsR0FBQSxPQUFBLFNBQUEsU0FBQSxHQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxLQUFBLE9BQUEsU0FBQSxFQUFBLEdBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUEsS0FBQSxPQUFBLDJCQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsSUFBQSxZQUFBLEVBQUEsVUFBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLGFBQUEsT0FBQSxJQUFBLE1BQUEsYUFBQSxFQUFBLEVBQUEsWUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLGFBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxJQUFBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxRQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxHQUFBLFNBQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLE1BQUEsYUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxNQUFBLENBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxRQUFBLE9BQUEsa0JBQUEsU0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSwyQkFBQSxXQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxhQUFBLFdBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxLQUFBLE9BQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsVUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQTtJQUNBLE9BQUEsUUFBQSxPQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxHQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFVBQUEsT0FBQSxTQUFBLEtBQUEsR0FBQSxDQUFBLElBQUEsS0FBQSxLQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLElBQUEsU0FBQSxFQUFBLFlBQUEsR0FBQSxtQkFBQSxFQUFBLGNBQUEsRUFBQSxPQUFBLGtCQUFBLFNBQUEsU0FBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFNBQUEsQ0FBQSxPQUFBLE1BQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsU0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBLENBQUEsSUFBQSxHQUFBLE9BQUEsRUFBQSxHQUFBLE9BQUEsRUFBQSxNQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUEsS0FBQSxPQUFBLEVBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLGdCQUFBLFNBQUEsU0FBQSxHQUFBLFNBQUEsSUFBQSxlQUFBLFNBQUEsU0FBQSxHQUFBLFNBQUEsSUFBQSxnQkFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsR0FBQSxnQkFBQSxpQkFBQSxnQkFBQSxpQkFBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsSUFBQSxpQkFBQSxnQkFBQSxpQkFBQSxpQkFBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsSUFBQSxjQUFBLE9BQUEsT0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQTtBQ0ZBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxJQUFBLFVBQUE7O1FBRUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUE7O1FBRUEsSUFBQSxHQUFBO1VBQ0EsR0FBQSxLQUFBOzs7O01BSUEsU0FBQSxhQUFBLE1BQUEsSUFBQSxVQUFBO1FBQ0EsR0FBQSxDQUFBLFdBQUEsQ0FBQSxPQUFBLEdBQUE7UUFDQSxJQUFBLElBQUE7VUFDQSxHQUFBOzs7O01BSUEsWUFBQSxvQkFBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7O1dBRUEsS0FBQTs7YUFFQTs7Ozs7TUFLQSxZQUFBLGlCQUFBLFNBQUEsT0FBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTs7V0FFQSxLQUFBOzthQUVBOzs7Ozs7O01BT0EsWUFBQSxTQUFBLFNBQUEsVUFBQTs7UUFFQSxRQUFBLFFBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFlBQUEsV0FBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGtCQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBOztXQUVBLEtBQUE7O2FBRUE7Ozs7O01BS0EsWUFBQSxTQUFBLFNBQUEsT0FBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsSUFBQSxrQkFBQTtXQUNBLEtBQUE7Ozs7O2FBS0E7Ozs7Ozs7TUFPQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLEtBQUEsV0FBQTs7O01BR0EsT0FBQTs7OztBQy9HQSxRQUFBLE9BQUEsT0FBQSxRQUFBLG9CQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLGFBQUE7TUFDQSxJQUFBLE9BQUEsYUFBQTs7TUFFQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsYUFBQSxXQUFBO2NBQ0EsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLFdBQUE7Y0FDQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLFFBQUEsV0FBQTtZQUNBLE9BQUEsTUFBQSxJQUFBOzs7UUFHQSxXQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQTs7Ozs7Ozs7QUN0Q0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxvQkFBQTtJQUNBO0lBQ0EsU0FBQSxPQUFBO01BQ0EsSUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBLFlBQUE7O01BRUEsT0FBQTs7Ozs7UUFLQSxZQUFBLFNBQUEsVUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUEsZUFBQTtjQUNBLFVBQUE7Ozs7UUFJQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7O1FBR0Esa0JBQUEsU0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxZQUFBLGVBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTs7Ozs7Ozs7QUN4QkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxjQUFBO1VBQ0EsV0FBQTtVQUNBLFNBQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7Ozs7TUFJQSxrQkFBQSxTQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxZQUFBOzs7O01BSUEsd0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxnQkFBQTtVQUNBLE1BQUE7OztNQUdBLG1CQUFBLFNBQUEsWUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsVUFBQTtVQUNBLGFBQUE7Ozs7Ozs7O0FDNURBLFFBQUEsT0FBQSxPQUFBLFFBQUEsb0JBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLElBQUEsT0FBQSxNQUFBOzs7TUFHQSxPQUFBOzs7OztRQUtBLE9BQUEsU0FBQSxXQUFBLE1BQUEsUUFBQSxXQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFNBQUE7O2FBRUEsS0FBQTs7ZUFFQTs7Ozs7UUFLQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7Ozs7OztBQzFCQSxRQUFBLE9BQUEsT0FBQSxRQUFBLGVBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsT0FBQSxRQUFBOztNQUVBLE9BQUE7Ozs7O1FBS0EsUUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxRQUFBLFdBQUE7Y0FDQSxVQUFBOzs7O1FBSUEsUUFBQSxXQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLFFBQUEsU0FBQSxJQUFBLE9BQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsV0FBQTtZQUNBLE9BQUE7Ozs7UUFJQSxNQUFBLFNBQUEsSUFBQSxTQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGFBQUE7WUFDQSxnQkFBQTs7OztRQUlBLFlBQUEsU0FBQSxJQUFBLE9BQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7O1FBYUEsY0FBQSxTQUFBLElBQUEsUUFBQSxhQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7OztRQVlBLGNBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBc0JBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLGlCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG9CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGdCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG1CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGtCQUFBLFNBQUEsS0FBQSxlQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsZUFBQSxnQkFBQSxnQkFBQTs7Ozs7Ozs7Ozs7QUM5R0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxlQUFBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQTs7OztNQUlBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUE7OztNQUdBLEtBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7OztNQUdBLFNBQUEsU0FBQSxNQUFBLE1BQUEsS0FBQSxjQUFBLGtCQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBLE9BQUEsT0FBQTtjQUNBLE1BQUEsT0FBQSxPQUFBO2NBQ0EsZUFBQSxnQkFBQSxnQkFBQTtjQUNBLGtCQUFBLG1CQUFBLG1CQUFBOzs7Ozs7TUFNQSxVQUFBLFVBQUEsSUFBQSxPQUFBO1FBQ0EsSUFBQSxLQUFBLElBQUE7OztRQUdBLEdBQUEsT0FBQSxRQUFBLE1BQUEsR0FBQTs7OztRQUlBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLElBQUE7VUFDQSxpQkFBQTtVQUNBLFNBQUEsRUFBQSxnQkFBQTtVQUNBLGtCQUFBLFFBQUE7Ozs7TUFJQSxlQUFBLFNBQUEsSUFBQSxTQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxTQUFBOzs7O01BSUEsb0JBQUEsU0FBQSxJQUFBLGNBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsWUFBQTtVQUNBLGNBQUE7Ozs7TUFJQSxXQUFBLFNBQUEsSUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLGNBQUE7VUFDQSxNQUFBOzs7O01BSUEsa0JBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O01BT0EsVUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsY0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsYUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsV0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7O01BRUEsWUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7O01BRUEsZ0JBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSx3QkFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGdCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsZUFBQSxTQUFBLEtBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxpQkFBQSxLQUFBLFVBQUE7OztNQUdBLFNBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxVQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsWUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGlCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsV0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGFBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxtQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsdUJBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSx1QkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGtCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxrQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0Esc0JBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUE7OztNQUdBLGlCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0Esd0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxrQkFBQSxFQUFBLE9BQUE7Ozs7Ozs7OztBQy9LQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxXQUFBLGlCQUFBO01BQ0EsT0FBQSxvQkFBQSxVQUFBOztNQUVBLGlCQUFBLFVBQUEsVUFBQSxLQUFBLEtBQUEsS0FBQTs7OztNQUlBLE9BQUEsaUJBQUEsWUFBQSxFQUFBLE9BQUEsZUFBQSxDQUFBLE9BQUE7OztNQUdBLE9BQUEsa0JBQUEsVUFBQTtRQUNBO1dBQ0EsT0FBQSxPQUFBLGtCQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7O0FDdEJBLFFBQUEsT0FBQSxPQUFBLFdBQUEsdUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7O0lBRUEsT0FBQSxhQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7OztJQUdBLFNBQUEsY0FBQTtNQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7SUFLQTs7SUFFQSxPQUFBLGNBQUEsU0FBQSxRQUFBLFdBQUE7O01BRUEsT0FBQTtNQUNBLE9BQUEsR0FBQSx1QkFBQTtRQUNBLElBQUEsVUFBQTs7OztJQUlBLE9BQUEsa0JBQUEsV0FBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLENBQUEsTUFBQSxhQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxDQUFBLFNBQUEsU0FBQSxZQUFBLENBQUEsYUFBQSxvQ0FBQSxNQUFBOztPQUVBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3Q0EsT0FBQSxrQkFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdBLFFBQUEsT0FBQSxPQUFBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOzs7OztJQUtBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7OztJQUlBLE9BQUEsWUFBQSxXQUFBO01BQ0EsSUFBQSxnQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxPQUFBLGNBQUEsa0JBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLFFBQUEsT0FBQSxPQUFBLFdBQUEsc0JBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7Ozs7OztJQU1BLEVBQUEsY0FBQTs7Ozs7O0lBTUEsT0FBQSxjQUFBLFVBQUE7O01BRUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsQ0FBQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztXQWVBO1FBQ0EsS0FBQSxVQUFBLDRCQUFBOzs7Ozs7Ozs7QUMxQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE1BQUEsZ0JBQUEsWUFBQTs7TUFFQSxPQUFBLFdBQUE7TUFDQTtTQUNBO1NBQ0EsS0FBQTs7OztNQUlBLFNBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQSxVQUFBOztRQUVBLFNBQUEsV0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsY0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsVUFBQSxJQUFBLEtBQUEsU0FBQTs7UUFFQSxPQUFBLFdBQUE7Ozs7O01BS0EsT0FBQSxvQkFBQSxZQUFBO1FBQ0E7V0FDQSxrQkFBQSxPQUFBLFNBQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7OztNQVdBO1NBQ0E7U0FDQSxLQUFBOzs7O1FBSUEsT0FBQSxrQkFBQSxVQUFBO1VBQ0E7YUFDQSx3QkFBQSxPQUFBLFVBQUEsUUFBQSxNQUFBLElBQUEsTUFBQTthQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFNBQUEsS0FBQTtRQUNBLElBQUEsQ0FBQSxLQUFBO1VBQ0EsT0FBQTs7OztRQUlBLE9BQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBLGVBQUEsTUFBQSxLQUFBOzs7O01BSUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxPQUFBLElBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTs7OztNQUlBLE9BQUEsMEJBQUEsVUFBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsVUFBQTtRQUNBLElBQUEsUUFBQSxVQUFBLE9BQUEsU0FBQSxXQUFBOztRQUVBLElBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxTQUFBLGFBQUEsVUFBQSxVQUFBO1VBQ0EsT0FBQSxLQUFBLFdBQUEsa0NBQUE7O1FBRUEsSUFBQSxRQUFBLE1BQUE7VUFDQSxLQUFBLFdBQUEsNkNBQUE7VUFDQTs7O1FBR0E7V0FDQSx3QkFBQSxNQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSwwQkFBQSxVQUFBLE9BQUE7UUFDQSxPQUFBLFNBQUEsWUFBQSxJQUFBLE1BQUEsT0FBQSxPQUFBLFNBQUEsVUFBQSxJQUFBLE9BQUE7Ozs7O01BS0EsT0FBQSxtQkFBQSxVQUFBOztRQUVBLElBQUEsUUFBQSxVQUFBLE9BQUEsU0FBQSxXQUFBO1FBQ0EsSUFBQSxNQUFBLFVBQUEsT0FBQSxTQUFBLFNBQUE7O1FBRUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLFVBQUEsYUFBQSxRQUFBLFVBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQSxrQ0FBQTs7UUFFQSxJQUFBLFNBQUEsSUFBQTtVQUNBLEtBQUEsV0FBQSxxQ0FBQTtVQUNBOzs7UUFHQTtXQUNBLGlCQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7TUFNQSxPQUFBLG1CQUFBLFVBQUEsT0FBQTtRQUNBLE9BQUEsU0FBQSxVQUFBLElBQUEsTUFBQSxPQUFBLE9BQUEsU0FBQSxXQUFBLElBQUEsT0FBQTs7Ozs7TUFLQSxPQUFBLHlCQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUEsVUFBQSxPQUFBLFNBQUEsYUFBQTs7UUFFQTtXQUNBLHVCQUFBO1dBQ0EsS0FBQTs7Ozs7OztNQU9BLE9BQUEsMEJBQUEsVUFBQSxPQUFBO1FBQ0EsT0FBQSxTQUFBLGNBQUEsSUFBQSxNQUFBLE9BQUEsT0FBQSxTQUFBLFdBQUEsU0FBQSxPQUFBOzs7TUFHQSxPQUFBLDBCQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUEsVUFBQSxPQUFBLFNBQUEsYUFBQTs7UUFFQTtXQUNBLHVCQUFBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW1CQSxJQUFBLFlBQUEsSUFBQSxTQUFBOztNQUVBLE9BQUEsa0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxLQUFBLFlBQUEsVUFBQSxTQUFBOzs7TUFHQSxPQUFBLHFCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSxtQkFBQTtXQUNBLEtBQUE7Ozs7OztNQU1BLE9BQUEsbUJBQUEsVUFBQTtRQUNBLElBQUEsYUFBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLGlCQUFBO1dBQ0EsS0FBQTs7Ozs7OztNQU9BLE9BQUEsdUJBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLHFCQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSx5QkFBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EsdUJBQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7O0FDdE5BLFFBQUEsT0FBQTtDQUNBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxVQUFBLFFBQUEsUUFBQSxVQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsYUFBQSxNQUFBOztJQUVBLElBQUEsV0FBQSxTQUFBOztJQUVBLE9BQUEsWUFBQSxNQUFBLFVBQUE7O0lBRUEsT0FBQSxPQUFBLFlBQUE7O0lBRUEsU0FBQSxhQUFBLE9BQUEsUUFBQTtNQUNBLElBQUEsT0FBQTtNQUNBLE1BQUEsUUFBQTs7Ozs7TUFLQSxPQUFBOzs7SUFHQSxTQUFBLGFBQUEsVUFBQTtNQUNBLFlBQUEsSUFBQSxVQUFBLEtBQUE7Ozs7O01BS0EsUUFBQSxJQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7O0lBT0EsT0FBQSxlQUFBOzs7SUFHQSxPQUFBLFdBQUEsVUFBQSxNQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLFFBQUE7OztNQUdBLE9BQUE7OztJQUdBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQ0EsT0FBQSxhQUFBLFlBQUE7O01BRUEsV0FBQTtRQUNBLGFBQUEsT0FBQTtRQUNBLFNBQUEsQ0FBQSxFQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUEsRUFBQSxNQUFBLE9BQUEsV0FBQSxRQUFBLE9BQUEsYUFBQSxVQUFBLE9BQUEsZUFBQSxNQUFBLE9BQUE7UUFDQSxXQUFBOztNQUVBLFFBQUEsSUFBQTtNQUNBLFFBQUEsSUFBQSxPQUFBOztNQUVBLFlBQUEsT0FBQTtNQUNBLE9BQUE7Ozs7SUFJQSxPQUFBLGlCQUFBLFlBQUE7TUFDQSxPQUFBLGtCQUFBO01BQ0EsT0FBQSxZQUFBO01BQ0EsT0FBQSxjQUFBO01BQ0EsT0FBQSxnQkFBQTtNQUNBLE9BQUEsWUFBQTtNQUNBLE9BQUEscUJBQUE7Ozs7SUFJQSxPQUFBLGVBQUEsVUFBQTtNQUNBLE9BQUEsbUJBQUE7Ozs7SUFJQSxPQUFBLGVBQUEsWUFBQTs7TUFFQSxTQUFBLE9BQUE7TUFDQSxlQUFBLE9BQUE7O01BRUEsU0FBQSxDQUFBLEdBQUEsWUFBQSxLQUFBLEtBQUEsS0FBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE1BQUE7TUFDQSxZQUFBLEtBQUEsT0FBQTtNQUNBO1FBQ0E7UUFDQTtRQUNBOztNQUVBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsVUFBQSxNQUFBOztNQUVBLElBQUE7TUFDQSxNQUFBLFNBQUEsU0FBQSxjQUFBO01BQ0EsT0FBQSxZQUFBOzs7TUFHQSxJQUFBLFNBQUEsU0FBQSxjQUFBO01BQ0EsT0FBQSxXQUFBO01BQ0EsT0FBQSxZQUFBO01BQ0EsT0FBQSxRQUFBO01BQ0EsT0FBQSxZQUFBOzs7TUFHQSxJQUFBLEtBQUEsT0FBQSxNQUFBO1FBQ0EsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFlBQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsUUFBQTtRQUNBLFNBQUEsU0FBQSxjQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBO1FBQ0EsT0FBQSxZQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFVBQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxNQUFBO1FBQ0EsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFlBQUE7OztNQUdBLE9BQUEsV0FBQSxTQUFBLGNBQUEsR0FBQTtRQUNBLFFBQUEsRUFBQSxPQUFBOzs7TUFHQSxLQUFBO1FBQ0EsT0FBQTs7UUFFQSxTQUFBO1VBQ0EsU0FBQTs7U0FFQSxLQUFBLFlBQUE7O1FBRUEsVUFBQSxFQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE9BQUE7UUFDQSxZQUFBLEtBQUEsS0FBQSxLQUFBO1FBQ0E7VUFDQTtVQUNBO1VBQ0E7O1FBRUEsT0FBQTs7Ozs7SUFLQSxPQUFBLGVBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJBLE9BQUEsZUFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsT0FBQSx1QkFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBO01BQ0EsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCQSxPQUFBLGFBQUEsVUFBQSxNQUFBO01BQ0EsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBOEJBLE9BQUEsWUFBQSxVQUFBLE1BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCQSxPQUFBLGlCQUFBLFVBQUEsTUFBQTtNQUNBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCQSxPQUFBLGtCQUFBLFVBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxVQUFBLE1BQUE7UUFDQSxPQUFBO2FBQ0EsRUFBQSxPQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJBLE9BQUEsaUJBQUEsVUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLFVBQUEsTUFBQTtRQUNBLE9BQUE7YUFDQSxFQUFBLE9BQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O0lBZUEsT0FBQSxPQUFBLGFBQUEsVUFBQSxXQUFBO01BQ0EsWUFBQSxpQkFBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7SUFNQSxPQUFBLG9CQUFBLFlBQUE7TUFDQSxZQUFBLGlCQUFBLE9BQUEsV0FBQSxPQUFBLGVBQUE7UUFDQTs7Ozs7Ozs7Ozs7O0FDOWpCQSxRQUFBLE9BQUEsUUFBQSxPQUFBLENBQUEsbUJBQUEsVUFBQSxpQkFBQTs7RUFFQSxnQkFBQSxXQUFBO0lBQ0EsYUFBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0lBQ0EsWUFBQTs7O0NBR0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxRQUFBLFlBQUE7Ozs7TUFJQSxJQUFBLGFBQUE7OztNQUdBO09BQ0E7T0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE0REEsT0FBQSxhQUFBO1FBQ0EsU0FBQSxDQUFBLFVBQUEsWUFBQSxZQUFBLGFBQUEsVUFBQSxXQUFBO1FBQ0EsU0FBQSxDQUFBO1FBQ0EsT0FBQTtVQUNBLENBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUE7VUFDQSxDQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUE7O1FBRUEsU0FBQTtVQUNBLE9BQUE7WUFDQSxTQUFBO1lBQ0EsTUFBQTs7VUFFQSxRQUFBO01BQ0EsT0FBQSxDQUFBO09BQ0EsU0FBQTs7TUFFQSxPQUFBLENBQUE7Y0FDQSxTQUFBO2NBQ0EsWUFBQSxTQUFBLEVBQUE7Z0JBQ0EsT0FBQSxHQUFBLE9BQUEsTUFBQSxLQUFBLElBQUE7Ozs7Ozs7O01BUUE7U0FDQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFnSEE7U0FDQTtTQUNBLEtBQUE7Ozs7O01BS0EsT0FBQSxVQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUEsTUFBQTs7O01BR0EsT0FBQSxjQUFBLFVBQUE7UUFDQSxZQUFBO1FBQ0EsT0FBQTs7O01BR0EsTUFBQSxTQUFBLE9BQUEsU0FBQTtRQUNBO1VBQ0EsaUJBQUE7VUFDQSxzQkFBQTtVQUNBLDJCQUFBO1VBQ0EsYUFBQTtVQUNBLGtCQUFBO1VBQ0EsdUJBQUE7Ozs7O01BS0EsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGdCQUFBO2FBQ0EsVUFBQTtZQUNBO2VBQ0E7ZUFDQSxLQUFBLFVBQUE7Z0JBQ0EsV0FBQTs7Ozs7TUFLQSxPQUFBLG1CQUFBLFVBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBO1lBQ0E7ZUFDQTtlQUNBLEtBQUEsVUFBQTtnQkFDQSxXQUFBOzs7OztNQUtBLE9BQUEsdUJBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7O01BTUEsT0FBQSxhQUFBLFdBQUE7UUFDQTtXQUNBO1dBQ0EsUUFBQSxTQUFBLE9BQUE7WUFDQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0Esa0JBQUE7Y0FDQSxvQkFBQTtjQUNBLG1CQUFBO2NBQ0EsZ0JBQUE7aUJBQ0EsVUFBQTs7Z0JBRUE7bUJBQ0E7bUJBQ0EsS0FBQSxVQUFBO29CQUNBLFdBQUE7Ozs7OztNQU1BLE9BQUEsaUJBQUEsV0FBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7Ozs7Ozs7QUM1VkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxnQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsTUFBQSxZQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUE7OztNQUdBOztNQUVBLFNBQUEsaUJBQUE7O1FBRUE7V0FDQSxJQUFBO1dBQ0EsS0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFVBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBLGFBQUEsTUFBQSxNQUFBLEtBQUE7O1lBRUEsSUFBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLGFBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtjQUNBLE9BQUEsbUJBQUE7Ozs7Ozs7TUFPQSxPQUFBLGdCQUFBLFVBQUE7UUFDQTtXQUNBLGNBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxhQUFBO1dBQ0EsS0FBQTs7O2FBR0E7Ozs7OztNQU1BLE9BQUEscUJBQUEsVUFBQTtRQUNBO1dBQ0EsbUJBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxhQUFBO1dBQ0EsS0FBQTs7O2FBR0E7Ozs7OztNQU1BLE9BQUEsZ0JBQUEsVUFBQTs7UUFFQTtXQUNBLFVBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7Ozs7OztBQzVEQSxRQUFBLE9BQUEsT0FBQSxXQUFBLGtCQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxhQUFBO0lBQ0EsT0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7O0lBRUEsT0FBQSxlQUFBO0lBQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7TUFDQSxRQUFBO01BQ0EsY0FBQTtRQUNBLHFCQUFBOztNQUVBLFNBQUE7OztJQUdBLFNBQUEsV0FBQSxNQUFBO01BQ0EsT0FBQSxRQUFBLEtBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQTtNQUNBLE9BQUEsV0FBQSxLQUFBOztNQUVBLElBQUEsSUFBQTtNQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFlBQUEsS0FBQTtRQUNBLEVBQUEsS0FBQTs7TUFFQSxPQUFBLEdBQUEsbUJBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSxhQUFBLFFBQUE7O01BRUEsT0FBQSxRQUFBOzs7SUFHQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7O0lBS0EsT0FBQSxPQUFBLGFBQUEsU0FBQSxXQUFBO01BQ0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsV0FBQSxPQUFBLGVBQUE7UUFDQTs7Ozs7OztJQU9BLE9BQUEsb0JBQUEsWUFBQTtNQUNBO1NBQ0EsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLE9BQUEsV0FBQSxPQUFBLGNBQUEsT0FBQSxrQkFBQTtVQUNBOzs7Ozs7SUFNQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsT0FBQSxHQUFBLG1CQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsYUFBQSxRQUFBOzs7O0lBSUEsT0FBQSxTQUFBLFNBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQTs7TUFFQSxPQUFBLEdBQUEsa0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O0lBS0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZDQSxPQUFBLGNBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQ0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBOzs7TUFHQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Q0EsT0FBQSx1QkFBQSxXQUFBO01BQ0EsTUFBQSxxQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxVQUFBLEVBQUEsTUFBQSxLQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O1FBR0EsTUFBQTtRQUNBLFNBQUEsQ0FBQSxVQUFBO1FBQ0EsWUFBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQkEsT0FBQSxzQkFBQSxXQUFBO01BQ0EsTUFBQSxxQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxVQUFBLEVBQUEsTUFBQSxLQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O1FBR0EsTUFBQTtRQUNBLFNBQUEsQ0FBQSxVQUFBO1FBQ0EsWUFBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCQSxPQUFBLGNBQUEsVUFBQTtNQUNBLElBQUEsVUFBQSxDQUFBLE1BQUEsVUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsWUFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNENBLE9BQUEsY0FBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxJQUFBLENBQUEsS0FBQSxPQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLHdCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxNQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7YUFXQTtRQUNBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJBLFNBQUEsV0FBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLEtBQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7O1lBRUE7Y0FDQSxLQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7Ozs7SUFPQSxTQUFBLFlBQUE7TUFDQSxLQUFBLFlBQUEsd0JBQUE7TUFDQSxPQUFBOzs7SUFHQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEtBQUEsY0FBQSxLQUFBLFNBQUE7OztJQUdBLE9BQUEsZUFBQSxVQUFBOztNQUVBLEtBQUEsOEJBQUE7UUFDQSxTQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUE7UUFDQSxTQUFBLENBQUEsU0FBQSxTQUFBLFlBQUEsQ0FBQSxhQUFBLG9CQUFBLE1BQUE7U0FDQSxLQUFBOzs7Ozs7OztJQVFBLE9BQUEsYUFBQTs7O0FDL2tCQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFlBQUEsV0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7Ozs7QUNQQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUE7TUFDQSxPQUFBLFVBQUE7O0FDTEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxtQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFVBQUEsUUFBQSxZQUFBLFFBQUEsT0FBQSxhQUFBLFVBQUEsU0FBQSxhQUFBLGtCQUFBOzs7TUFHQSxPQUFBLE9BQUEsWUFBQTs7O01BR0EsT0FBQSxlQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTs7O01BR0EsSUFBQSxPQUFBLGNBQUE7UUFDQSxPQUFBLEtBQUEsUUFBQSxRQUFBOzs7O01BSUE7TUFDQTs7TUFFQTs7TUFFQSxPQUFBLGNBQUEsS0FBQSxRQUFBLFNBQUEsS0FBQTs7TUFFQSxTQUFBLGtCQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxJQUFBLFVBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUE7O1lBRUEsSUFBQSxRQUFBLFFBQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtjQUNBLE9BQUEsbUJBQUE7Ozs7UUFJQTtXQUNBLElBQUE7V0FDQSxLQUFBLFVBQUEsS0FBQTtZQUNBLE9BQUEsVUFBQSxJQUFBLEtBQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxLQUFBOztZQUVBLElBQUEsVUFBQTs7WUFFQSxLQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsR0FBQTtjQUNBLFFBQUEsS0FBQSxFQUFBLE9BQUEsT0FBQSxRQUFBOzs7WUFHQSxFQUFBO2VBQ0EsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQTtrQkFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsTUFBQTs7Ozs7OztNQU9BLFNBQUEsb0JBQUE7UUFDQTtXQUNBLElBQUE7V0FDQSxLQUFBLFVBQUEsS0FBQTtZQUNBLE9BQUEsWUFBQSxJQUFBLEtBQUEsTUFBQTtZQUNBLE9BQUEsVUFBQSxLQUFBO1lBQ0EsSUFBQSxVQUFBO1lBQ0EsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFVBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxVQUFBLEtBQUEsT0FBQSxVQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsVUFBQTs7Ozs7WUFLQSxFQUFBO2VBQ0EsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQTtrQkFDQSxPQUFBLEtBQUEsUUFBQSxVQUFBLE9BQUEsTUFBQTs7OztjQUlBLEVBQUE7ZUFDQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBO2tCQUNBLE9BQUEsS0FBQSxRQUFBLGlCQUFBLE9BQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BdUNBLFNBQUEsaUJBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxzQkFBQTtRQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JBLFNBQUEsWUFBQSxHQUFBOzs7UUFHQSxJQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUEsS0FBQSxPQUFBLGtCQUFBLEVBQUEsV0FBQTs7O1FBR0EsSUFBQSxPQUFBLGNBQUEsS0FBQSxFQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTthQUNBLEVBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLGFBQUEsTUFBQSxPQUFBOztRQUVBO1dBQ0EsY0FBQSxRQUFBLGFBQUEsT0FBQSxLQUFBO1dBQ0EsS0FBQTs7Ozs7YUFLQTs7Ozs7O01BTUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxDQUFBLE9BQUEsS0FBQSxRQUFBOzs7TUFHQSxTQUFBLG1CQUFBO1FBQ0EsT0FBQSxTQUFBLEtBQUE7OztNQUdBLFNBQUEsbUJBQUE7O1FBRUEsSUFBQSxhQUFBLENBQUEsb0JBQUE7VUFDQSxPQUFBOztRQUVBLE9BQUE7OztNQUdBLFNBQUEsYUFBQTs7UUFFQSxFQUFBLEdBQUEsS0FBQSxTQUFBLE1BQUEsY0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBOzs7O1FBSUEsRUFBQSxZQUFBLEtBQUE7VUFDQSxJQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsU0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxTQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsVUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxTQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsZ0JBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7O1lBS0EsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxZQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsVUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7Ozs7Ozs7OztNQVVBLE9BQUEsYUFBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBLFlBQUEsS0FBQSxhQUFBOztVQUVBO2VBQ0E7VUFDQSxLQUFBLFVBQUEsbUNBQUE7Ozs7O0FDbFZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsZUFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBQSxRQUFBLFFBQUEsY0FBQSxZQUFBO0lBQ0EsRUFBQSxXQUFBLGFBQUEsU0FBQSxPQUFBOzs7VUFHQSxZQUFBLElBQUEsUUFBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStDQSxTQUFBLE1BQUE7U0FDQSxTQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7SUFDQSxPQUFBLGVBQUEsQ0FBQSxTQUFBLEtBQUEsaUJBQUEsS0FBQSxVQUFBLEtBQUEsVUFBQTs7SUFFQSxPQUFBLFNBQUEsbUJBQUEsYUFBQTtJQUNBLE9BQUEsT0FBQSxPQUFBLGFBQUEsU0FBQTs7SUFFQSxTQUFBLG1CQUFBLE1BQUE7TUFDQSxJQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsTUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsQ0FBQSxJQUFBLEdBQUE7TUFDQSxPQUFBLENBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTs7O0lBR0EsU0FBQSxpQkFBQSxTQUFBO01BQ0EsSUFBQSxNQUFBO01BQ0EsS0FBQSxJQUFBLEtBQUEsU0FBQSxDQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsV0FBQSxRQUFBLElBQUEsT0FBQSxFQUFBO01BQ0EsT0FBQSxDQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsSUFBQSxPQUFBLEVBQUEsSUFBQSxPQUFBOzs7Ozs7O0lBT0EsRUFBQSxjQUFBOztJQUVBLE9BQUEsZUFBQTtJQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsUUFBQTtNQUNBLGNBQUE7UUFDQSxxQkFBQTs7TUFFQSxTQUFBOzs7SUFHQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUE7TUFDQSxPQUFBLFdBQUEsS0FBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxZQUFBLEtBQUE7UUFDQSxFQUFBLEtBQUE7O01BRUEsT0FBQSxRQUFBOzs7SUFHQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7SUFJQSxPQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7TUFDQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7O0lBT0EsT0FBQSxvQkFBQSxZQUFBOztNQUVBO1NBQ0EsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLE9BQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O0lBTUEsT0FBQSxXQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsR0FBQSxtQkFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLGFBQUEsUUFBQTs7OztJQUlBLE9BQUEsVUFBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxJQUFBLENBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsK0JBQUEsS0FBQSxRQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7YUFlQTtRQUNBO1VBQ0E7VUFDQSxLQUFBLFFBQUEsT0FBQSw2QkFBQSxXQUFBLEtBQUEsT0FBQTtVQUNBOzs7OztJQUtBLFNBQUEsV0FBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7OztJQU1BLE9BQUEsYUFBQTs7QUM3VEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxvQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBLFFBQUEsYUFBQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE9BQUEsbUJBQUEsS0FBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGFBQUEsTUFBQTs7TUFFQTs7TUFFQSxPQUFBLFdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUE7Ozs7O01BS0EsSUFBQSxzQkFBQTtRQUNBLGNBQUE7UUFDQSxTQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxlQUFBOzs7TUFHQSxJQUFBLEtBQUEsYUFBQSxvQkFBQTtRQUNBLEtBQUEsYUFBQSxvQkFBQSxRQUFBLFNBQUEsWUFBQTtVQUNBLElBQUEsZUFBQSxvQkFBQTtZQUNBLG9CQUFBLGVBQUE7Ozs7O01BS0EsT0FBQSxzQkFBQTs7OztNQUlBLFNBQUEsWUFBQSxFQUFBO1FBQ0EsSUFBQSxlQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLE1BQUE7UUFDQSxPQUFBLEtBQUEsT0FBQSxxQkFBQSxRQUFBLFNBQUEsSUFBQTtVQUNBLElBQUEsT0FBQSxvQkFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBOzs7UUFHQSxhQUFBLHNCQUFBOzs7Ozs7O1FBT0E7U0FDQSxtQkFBQSxLQUFBLEtBQUE7U0FDQSxLQUFBOzs7O1dBSUE7Ozs7Ozs7Ozs7Ozs7O01BY0EsU0FBQSxZQUFBOztRQUVBLEVBQUEsWUFBQSxLQUFBO1VBQ0EsUUFBQTtZQUNBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsd0JBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxnQkFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxZQUFBLEtBQUEsWUFBQTtVQUNBO2VBQ0E7VUFDQSxLQUFBLFVBQUEsbUNBQUE7Ozs7OztBQ2pJQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGlCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxNQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsYUFBQSxZQUFBLFVBQUE7TUFDQSxJQUFBLFdBQUEsU0FBQTtNQUNBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBO01BQ0EsT0FBQSxZQUFBLE1BQUEsV0FBQSxTQUFBO01BQ0EsT0FBQSxjQUFBLE1BQUEsV0FBQSxTQUFBOztNQUVBLE9BQUEsWUFBQTs7TUFFQSxLQUFBLElBQUEsT0FBQSxPQUFBLFdBQUE7UUFDQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsbUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLGtCQUFBLE1BQUEsV0FBQSxTQUFBOztRQUVBLElBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQSx1QkFBQTtVQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsc0JBQUEsTUFBQSxXQUFBLEtBQUEsT0FBQTs7Ozs7TUFLQSxJQUFBLFlBQUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsSUFBQSxtQkFBQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxZQUFBLFNBQUEsT0FBQTtRQUNBLElBQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsS0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUEsWUFBQSxLQUFBLE9BQUEsYUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTs7UUFFQSxPQUFBOzs7TUFHQSxPQUFBLGVBQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGNBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BeUJBLElBQUEsWUFBQSxJQUFBLFNBQUE7TUFDQSxPQUFBLGlCQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsbUJBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTs7TUFFQSxPQUFBLG1CQUFBLFVBQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxXQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUN6SEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLE9BQUEsYUFBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7Ozs7TUFJQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLE9BQUEsYUFBQTs7TUFFQSxTQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFNBQUEsUUFBQSxLQUFBO1FBQ0EsT0FBQSxRQUFBLEtBQUE7OztNQUdBLFNBQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTs7O01BR0EsT0FBQSxRQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsV0FBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLGdCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsYUFBQTs7O01BR0EsT0FBQSxpQkFBQSxXQUFBO1FBQ0EsSUFBQSxRQUFBLE9BQUE7UUFDQSxZQUFBLGVBQUE7UUFDQSxLQUFBLGdCQUFBLDJDQUFBOzs7Ozs7TUFNQSxPQUFBLFVBQUE7Ozs7QUMvREEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQSxhQUFBLFdBQUE7O01BRUEsT0FBQSxhQUFBOzs7TUFHQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLE9BQUEsYUFBQTs7TUFFQSxTQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFNBQUEsUUFBQSxLQUFBO1FBQ0EsT0FBQSxRQUFBLEtBQUE7OztNQUdBLFNBQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTs7O01BR0EsT0FBQSxRQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsV0FBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLGdCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsYUFBQTs7O01BR0EsT0FBQSxpQkFBQSxXQUFBO1FBQ0EsSUFBQSxRQUFBLE9BQUE7UUFDQSxZQUFBLGVBQUE7UUFDQSxLQUFBLGdCQUFBLDJDQUFBOzs7Ozs7QUNuREEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsY0FBQSxRQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsT0FBQSxpQkFBQSxVQUFBO1FBQ0EsSUFBQSxXQUFBLE9BQUE7UUFDQSxJQUFBLFVBQUEsT0FBQTs7UUFFQSxJQUFBLGFBQUEsUUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsVUFBQTtVQUNBOzs7UUFHQSxZQUFBO1VBQ0E7VUFDQSxPQUFBO1VBQ0E7Ozs7O1VBS0E7Ozs7Ozs7QUM3QkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxjQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxhQUFBOztNQUVBLE9BQUEsVUFBQTs7TUFFQSxJQUFBLE9BQUE7UUFDQSxZQUFBLE9BQUE7VUFDQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7WUFDQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBOzs7Ozs7O0FDZkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsVUFBQSxRQUFBLFFBQUEsVUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLGFBQUEsTUFBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUEsTUFBQSxVQUFBOztNQUVBLE9BQUEsT0FBQSxZQUFBOztNQUVBLFNBQUEsYUFBQSxPQUFBLFFBQUE7UUFDQSxJQUFBLE9BQUE7UUFDQSxNQUFBLFFBQUE7Ozs7O1FBS0EsT0FBQTs7O01BR0EsU0FBQSxhQUFBLFVBQUE7UUFDQSxZQUFBLElBQUEsVUFBQSxLQUFBOzs7OztRQUtBLFFBQUEsSUFBQTtRQUNBLEVBQUEsb0JBQUEsTUFBQTs7O01BR0EsU0FBQSxpQkFBQSxNQUFBO1FBQ0EsT0FBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOztjQUVBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7O2NBRUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7Y0FFQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7O01BT0EsT0FBQSxlQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQSxNQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsS0FBQSxhQUFBLFFBQUE7OztRQUdBLE9BQUE7OztNQUdBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQ0EsT0FBQSxhQUFBLFlBQUE7O1FBRUEsV0FBQTtVQUNBLGFBQUEsT0FBQTtVQUNBLFNBQUEsQ0FBQSxFQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE9BQUEsT0FBQTtVQUNBLFFBQUEsRUFBQSxNQUFBLE9BQUEsV0FBQSxRQUFBLE9BQUEsYUFBQSxVQUFBLE9BQUEsZUFBQSxNQUFBLE9BQUE7VUFDQSxXQUFBOzs7UUFHQSxZQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQkEsT0FBQSxpQkFBQSxZQUFBO1FBQ0EsT0FBQSxrQkFBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsY0FBQTtRQUNBLE9BQUEsZ0JBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLHFCQUFBOzs7O01BSUEsT0FBQSxlQUFBLFVBQUE7UUFDQSxPQUFBLG1CQUFBOzs7O01BSUEsT0FBQSxlQUFBLFlBQUE7O1FBRUEsU0FBQSxPQUFBO1FBQ0EsZUFBQSxPQUFBOztRQUVBLFNBQUEsQ0FBQSxHQUFBLFlBQUEsS0FBQSxLQUFBLEtBQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxNQUFBO1FBQ0EsWUFBQSxLQUFBLE9BQUEsU0FBQSxNQUFBOzs7Ozs7VUFNQSxNQUFBOzs7Ozs7O1FBT0EsT0FBQTs7O01BR0EsT0FBQSxXQUFBLFVBQUEsTUFBQTs7UUFFQSxJQUFBO1FBQ0EsTUFBQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTs7O1FBR0EsSUFBQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsV0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7O1FBR0EsSUFBQSxLQUFBLE9BQUEsTUFBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOztRQUVBLElBQUEsS0FBQSxPQUFBLFFBQUE7VUFDQSxTQUFBLFNBQUEsY0FBQTtVQUNBLE9BQUEsWUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsWUFBQTs7UUFFQSxJQUFBLEtBQUEsT0FBQSxVQUFBO1VBQ0EsU0FBQSxTQUFBLGNBQUE7VUFDQSxPQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFlBQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsTUFBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOzs7UUFHQSxPQUFBLFdBQUEsU0FBQSxjQUFBLEdBQUE7VUFDQSxRQUFBLEVBQUEsT0FBQTs7O1FBR0EsS0FBQTtVQUNBLE9BQUE7O1VBRUEsU0FBQTtZQUNBLFNBQUE7O1dBRUEsS0FBQSxZQUFBOztVQUVBLFVBQUEsRUFBQSxJQUFBLFlBQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxPQUFBOztVQUVBLFlBQUEsS0FBQSxLQUFBLEtBQUEsU0FBQSxNQUFBOzs7Ozs7WUFNQSxNQUFBOzs7Ozs7O1VBT0EsT0FBQTs7Ozs7TUFLQSxPQUFBLGVBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTs7UUFFQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BMkJBLE9BQUEsZUFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7TUFnQkEsT0FBQSx1QkFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTJCQSxPQUFBLGFBQUEsVUFBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUNBLE9BQUEsWUFBQSxVQUFBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXVCQSxPQUFBLGlCQUFBLFVBQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXdCQSxPQUFBLGtCQUFBLFVBQUEsUUFBQSxRQUFBO1FBQ0EsSUFBQSxVQUFBLE1BQUE7VUFDQSxPQUFBO2VBQ0EsRUFBQSxPQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUJBLE9BQUEsaUJBQUEsVUFBQSxRQUFBLFFBQUE7UUFDQSxJQUFBLFVBQUEsTUFBQTtVQUNBLE9BQUE7ZUFDQSxFQUFBLE9BQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O01BZUEsT0FBQSxPQUFBLGFBQUEsVUFBQSxXQUFBO1FBQ0EsWUFBQSxpQkFBQSxXQUFBLE9BQUEsZUFBQTtVQUNBOzs7Ozs7TUFNQSxPQUFBLG9CQUFBLFlBQUE7UUFDQSxZQUFBLGlCQUFBLE9BQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7Ozs7Ozs7O0FDdGxCQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFlBQUEsV0FBQTtHQUNBLFdBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsaUJBQUEsT0FBQSxhQUFBLFNBQUEsV0FBQTs7TUFFQSxJQUFBLE9BQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7O01BRUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOzs7TUFHQTtPQUNBO09BQ0EsS0FBQTs7OztNQUlBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsWUFBQTs7O01BR0EsT0FBQSxjQUFBO01BQ0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBLENBQUEsT0FBQTs7OztNQUlBLEVBQUEsU0FBQSxHQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsY0FBQTs7OztBQUlBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVnJywgW1xuICAndWkucm91dGVyJyxcbiAgJ2NoYXJ0LmpzJyxcbl0pO1xuXG5hcHBcbiAgLmNvbmZpZyhbXG4gICAgJyRodHRwUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuXG4gICAgICAvLyBBZGQgYXV0aCB0b2tlbiB0byBBdXRob3JpemF0aW9uIGhlYWRlclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG5cbiAgICB9XSlcbiAgLnJ1bihbXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oQXV0aFNlcnZpY2UsIFNlc3Npb24pe1xuXG4gICAgICAvLyBTdGFydHVwLCBsb2dpbiBpZiB0aGVyZSdzICBhIHRva2VuLlxuICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xuICAgICAgaWYgKHRva2VuKXtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4odG9rZW4pO1xuICAgICAgfVxuXG4gIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAgIC5jb25zdGFudCgnRVZFTlRfSU5GTycsIHtcbiAgICAgICAgTkFNRTogJ1VWU1EgQ29uZiAyMDIyJyxcbiAgICB9KVxuICAgIC5jb25zdGFudCgnREFTSEJPQVJEJywge1xuICAgICAgICBVTlZFUklGSUVEOiAnWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGFuIGVtYWlsIGFza2luZyB5b3UgdmVyaWZ5IHlvdXIgZW1haWwuIENsaWNrIHRoZSBsaW5rIGluIHRoZSBlbWFpbCBhbmQgeW91IGNhbiBzdGFydCB5b3VyIGFwcGxpY2F0aW9uIScsXG4gICAgICAgIElOQ09NUExFVEVfVElUTEU6ICdZb3Ugc3RpbGwgbmVlZCB0byBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIScsXG4gICAgICAgIElOQ09NUExFVEU6ICdJZiB5b3UgZG8gbm90IGNvbXBsZXRlIHlvdXIgYXBwbGljYXRpb24gYmVmb3JlIHRoZSBbQVBQX0RFQURMSU5FXSwgeW91IHdpbGwgbm90IGJlIGNvbnNpZGVyZWQgZm9yIHRoZSBldmVudCEnLFxuICAgICAgICBTVUJNSVRURURfVElUTEU6ICdZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHN1Ym1pdHRlZCEnLFxuICAgICAgICBTVUJNSVRURUQ6ICdGZWVsIGZyZWUgdG8gZWRpdCBpdCBhdCBhbnkgdGltZS4gSG93ZXZlciwgb25jZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkLCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBlZGl0IGl0IGFueSBmdXJ0aGVyLlxcbkFkbWlzc2lvbnMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5IGEgcmFuZG9tIGxvdHRlcnkuIFBsZWFzZSBtYWtlIHN1cmUgeW91ciBpbmZvcm1hdGlvbiBpcyBhY2N1cmF0ZSBiZWZvcmUgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCEnLFxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURTogJ0JlY2F1c2UgeW91IGhhdmUgbm90IGNvbXBsZXRlZCB5b3VyIHByb2ZpbGUgaW4gdGltZSwgeW91IHdpbGwgbm90IGJlIGVsaWdpYmxlIGZvciB0aGUgbG90dGVyeSBwcm9jZXNzLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5fQ09ORklSTV9USVRMRTogJ1lvdSBtdXN0IGNvbmZpcm0gYnkgW0NPTkZJUk1fREVBRExJTkVdLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTTogJ0FsdGhvdWdoIHlvdSB3ZXJlIGFjY2VwdGVkLCB5b3UgZGlkIG5vdCBjb21wbGV0ZSB5b3VyIGNvbmZpcm1hdGlvbiBpbiB0aW1lLlxcblVuZm9ydHVuYXRlbHksIHRoaXMgbWVhbnMgdGhhdCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBhdHRlbmQgdGhlIGV2ZW50LCBhcyB3ZSBtdXN0IGJlZ2luIHRvIGFjY2VwdCBvdGhlciBhcHBsaWNhbnRzIG9uIHRoZSB3YWl0bGlzdC5cXG5XZSBob3BlIHRvIHNlZSB5b3UgYWdhaW4gbmV4dCB5ZWFyIScsXG4gICAgICAgIENPTkZJUk1FRF9OT1RfUEFTVF9USVRMRTogJ1lvdSBjYW4gZWRpdCB5b3VyIGNvbmZpcm1hdGlvbiBpbmZvcm1hdGlvbiB1bnRpbCBbQ09ORklSTV9ERUFETElORV0nLFxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBVVlNRIENvbmYgMjAyMiEgOihcXG5NYXliZSBuZXh0IHllYXIhIFdlIGhvcGUgeW91IHNlZSB5b3UgYWdhaW4gc29vbi4nLFxuICAgIH0pXG4gICAgLmNvbnN0YW50KCdURUFNJyx7XG4gICAgICAgIE5PX1RFQU1fUkVHX0NMT1NFRDogJ1VuZm9ydHVuYXRlbHksIGl0XFwncyB0b28gbGF0ZSB0byBlbnRlciB0aGUgbG90dGVyeSB3aXRoIGEgdGVhbS5cXG5Ib3dldmVyLCB5b3UgY2FuIHN0aWxsIGZvcm0gdGVhbXMgb24geW91ciBvd24gYmVmb3JlIG9yIGR1cmluZyB0aGUgZXZlbnQhJyxcbiAgICB9KTtcbiIsIlxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb25maWcoW1xuICAgICckc3RhdGVQcm92aWRlcicsXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbihcbiAgICAgICRzdGF0ZVByb3ZpZGVyLFxuICAgICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICAgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgIC8vIEZvciBhbnkgdW5tYXRjaGVkIHVybCwgcmVkaXJlY3QgdG8gL3N0YXRlMVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvNDA0XCIpO1xuICAgIFxuICAgIC8vIFNldCB1cCBkZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZSxcbiAgICAgICAgICByZXF1aXJlTG9nb3V0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiBcIi9cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2UsXG4gICAgICAgICAgcmVxdWlyZUxvZ291dDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgIC8vICAgdXJsOiBcIi9cIixcbiAgICAgIC8vICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS9ob21lLmh0bWxcIixcbiAgICAgIC8vICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJyxcbiAgICAgIC8vICAgZGF0YToge1xuICAgICAgLy8gICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgIC8vICAgfSxcbiAgICAgIC8vICAgcmVzb2x2ZToge1xuICAgICAgLy8gICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XG4gICAgICAvLyAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9KVxuXG4gICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYmFzZS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcIkJhc2VDdHJsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc2lkZWJhckBhcHAnOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zaWRlYmFyL3NpZGViYXIuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgICB1cmw6IFwiL2Rhc2hib2FyZFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmFwcGxpY2F0aW9uJywge1xuICAgICAgICB1cmw6IFwiL2FwcGxpY2F0aW9uXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ0FwcGxpY2F0aW9uQ3RybCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmNvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbi5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtYXRpb25DdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVBZG1pdHRlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmNoYWxsZW5nZXMnLCB7XG4gICAgICAgIHVybDogXCIvY2hhbGxlbmdlc1wiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhbGxlbmdlc0N0cmwnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC50ZWFtJywge1xuICAgICAgICB1cmw6IFwiL3RlYW1cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1RlYW1DdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4nLCB7XG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJyc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL2FkbWluLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkN0cmwnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZUFkbWluOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5jaGVja2luJywge1xuICAgICAgICB1cmw6ICcvY2hlY2tpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2hlY2tpbi9jaGVja2luLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tpbkN0cmwnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZVZvbHVudGVlcjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW5cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vc3RhdHMvc3RhdHMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4ubWFpbCcsIHtcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9tYWlsXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21haWwvbWFpbC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pbk1haWxDdHJsJ1xuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLmNoYWxsZW5nZXMnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vY2hhbGxlbmdlc1wiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5DaGFsbGVuZ2VzQ3RybCdcbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5jaGFsbGVuZ2UnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vY2hhbGxlbmdlcy86aWRcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vY2hhbGxlbmdlL2NoYWxsZW5nZS5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZUN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgJ2NoYWxsZW5nZSc6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgQ2hhbGxlbmdlU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gQ2hhbGxlbmdlU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5tYXJrZXRpbmcnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vbWFya2V0aW5nXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21hcmtldGluZy9tYXJrZXRpbmcuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5NYXJrZXRpbmdDdHJsJ1xuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xuICAgICAgICB1cmw6IFwiL2FkbWluL3VzZXJzP1wiICtcbiAgICAgICAgICAnJnBhZ2UnICtcbiAgICAgICAgICAnJnNpemUnICtcbiAgICAgICAgICAnJnF1ZXJ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vdXNlcnMvdXNlcnMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4udXNlcicsIHtcbiAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vdXNlci91c2VyLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlckN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgJ3VzZXInOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9zZXR0aW5nc1wiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4udGVhbXMnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vdGVhbXNcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vdGVhbXMvdGVhbXMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5UZWFtQ3RybCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgncmVzZXQnLCB7XG4gICAgICAgIHVybDogXCIvcmVzZXQvOnRva2VuXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Jlc2V0L3Jlc2V0Lmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0Q3RybCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ3ZlcmlmeScsIHtcbiAgICAgICAgdXJsOiBcIi92ZXJpZnkvOnRva2VuXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3ZlcmlmeS92ZXJpZnkuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnVmVyaWZ5Q3RybCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJzQwNCcsIHtcbiAgICAgICAgdXJsOiBcIi80MDRcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICB9XSlcbiAgLnJ1bihbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbihcbiAgICAgICRyb290U2NvcGUsXG4gICAgICAkc3RhdGUsXG4gICAgICBTZXNzaW9uICl7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgICAgfSk7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblxuICAgICAgICB2YXIgcmVxdWlyZUxvZ2luID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVMb2dpbjtcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dvdXQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ291dDtcbiAgICAgICAgdmFyIHJlcXVpcmVBZG1pbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlQWRtaW47XG4gICAgICAgIHZhciByZXF1aXJlVm9sdW50ZWVyID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVWb2x1bnRlZXI7XG4gICAgICAgIHZhciByZXF1aXJlVmVyaWZpZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZlcmlmaWVkO1xuICAgICAgICB2YXIgcmVxdWlyZUFkbWl0dGVkID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pdHRlZDtcbiAgXG4gICAgICAgIGlmIChyZXF1aXJlTG9naW4gJiYgIVNlc3Npb24uZ2V0VG9rZW4oKSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmIChyZXF1aXJlTG9nb3V0ICYmIFNlc3Npb24uZ2V0VG9rZW4oKSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChyZXF1aXJlQWRtaW4gJiYgIVNlc3Npb24uZ2V0VXNlcigpLmFkbWluKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAocmVxdWlyZVZvbHVudGVlciAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudm9sdW50ZWVyICYmIHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmIChyZXF1aXJlVmVyaWZpZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnZlcmlmaWVkKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICB9XG4gIFxuICAgICAgICBpZiAocmVxdWlyZUFkbWl0dGVkICYmICFTZXNzaW9uLmdldFVzZXIoKS5zdGF0dXMuYWRtaXR0ZWQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgXG5cbiAgICAgIH0pO1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBbXG4gICAgJ1Nlc3Npb24nLFxuICAgIGZ1bmN0aW9uKFNlc3Npb24pe1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpe1xuICAgICAgICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xuICAgICAgICAgICAgaWYgKHRva2VuKXtcbiAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSB0b2tlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuc2VydmljZSgnU2Vzc2lvbicsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyR3aW5kb3cnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICR3aW5kb3cpe1xuXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih0b2tlbiwgdXNlcil7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3QgPSB0b2tlbjtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnVzZXJJZCA9IHVzZXIuX2lkO1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH07XG5cbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbihvbkNvbXBsZXRlKXtcbiAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3Q7XG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG4gICAgICBpZiAob25Db21wbGV0ZSl7XG4gICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5nZXRUb2tlbiA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXIgPSBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIpO1xuICAgIH07XG5cbiAgICB0aGlzLnNldFVzZXIgPSBmdW5jdGlvbih1c2VyKXtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICB9O1xuXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ1V0aWxzJywgW1xuICAgIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1JlZ09wZW46IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHNldHRpbmdzLnRpbWVPcGVuICYmIERhdGUubm93KCkgPCBzZXR0aW5ncy50aW1lQ2xvc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQWZ0ZXI6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gdGltZTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0VGltZTogZnVuY3Rpb24odGltZSl7XG5cbiAgICAgICAgICBpZiAoIXRpbWUpe1xuICAgICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRpbWUpO1xuICAgICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXG4gICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVksIGg6bW0gYScpICtcbiAgICAgICAgICAgIFwiIFwiICsgZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzJdO1xuXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV0pO1xuIiwiKGZ1bmN0aW9uKCQpIHtcbiAgICBqUXVlcnkuZm4uZXh0ZW5kKHtcbiAgICAgICAgaHRtbDVfcXJjb2RlOiBmdW5jdGlvbihxcmNvZGVTdWNjZXNzLCBxcmNvZGVFcnJvciwgdmlkZW9FcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEVsZW0gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGN1cnJlbnRFbGVtLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGN1cnJlbnRFbGVtLndpZHRoKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gMjUwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh3aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gMzAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHZhciB2aWRFbGVtID0gJCgnPHZpZGVvIHdpZHRoPVwiJyArIHdpZHRoICsgJ3B4XCIgaGVpZ2h0PVwiJyArIGhlaWdodCArICdweFwiPjwvdmlkZW8+JykuYXBwZW5kVG8oY3VycmVudEVsZW0pO1xuICAgICAgICAgICAgICAgIHZhciB2aWRFbGVtID0gJCgnPHZpZGVvIHdpZHRoPVwiJyArIHdpZHRoICsgJ3B4XCIgaGVpZ2h0PVwiJyArIGhlaWdodCArICdweFwiIGF1dG9wbGF5IHBsYXlzaW5saW5lPjwvdmlkZW8+JykuYXBwZW5kVG8oY3VycmVudEVsZW0pO1xuICAgICAgICAgICAgICAgIHZhciBjYW52YXNFbGVtID0gJCgnPGNhbnZhcyBpZD1cInFyLWNhbnZhc1wiIHdpZHRoPVwiJyArICh3aWR0aCAtIDIpICsgJ3B4XCIgaGVpZ2h0PVwiJyArIChoZWlnaHQgLSAyKSArICdweFwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiPjwvY2FudmFzPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcblxuICAgICAgICAgICAgICAgIHZhciB2aWRlbyA9IHZpZEVsZW1bMF07XG4gICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGNhbnZhc0VsZW1bMF07XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxNZWRpYVN0cmVhbTtcblxuICAgICAgICAgICAgICAgIHZhciBzY2FuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbE1lZGlhU3RyZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlbywgMCwgMCwgMzA3LCAyNTApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHFyY29kZS5kZWNvZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxcmNvZGVFcnJvcihlLCBsb2NhbE1lZGlhU3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInRpbWVvdXRcIiwgc2V0VGltZW91dChzY2FuLCA1MDApKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInRpbWVvdXRcIiwgc2V0VGltZW91dChzY2FuLCA1MDApKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07Ly9lbmQgc25hcHNob3QgZnVuY3Rpb25cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cubXNVUkw7XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcblxuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzQ2FsbGJhY2sgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdmlkZW8uc3JjID0gKHdpbmRvdy5VUkwgJiYgd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoc3RyZWFtKSkgfHwgc3RyZWFtO1xuICAgICAgICAgICAgICAgICAgICB2aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsTWVkaWFTdHJlYW0gPSBzdHJlYW07XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJzdHJlYW1cIiwgc3RyZWFtKTtcblxuICAgICAgICAgICAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgMTAwMCkpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBnZXRVc2VyTWVkaWEgbWV0aG9kIHdpdGggb3VyIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoe3ZpZGVvOiB7IGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIiB9IH0sIHN1Y2Nlc3NDYWxsYmFjaywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvRXJyb3IoZXJyb3IsIGxvY2FsTWVkaWFTdHJlYW0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTmF0aXZlIHdlYiBjYW1lcmEgc3RyZWFtaW5nIChnZXRVc2VyTWVkaWEpIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLicpO1xuICAgICAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGEgZnJpZW5kbHkgXCJzb3JyeVwiIG1lc3NhZ2UgdG8gdGhlIHVzZXJcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBxcmNvZGUuY2FsbGJhY2sgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHFyY29kZVN1Y2Nlc3MocmVzdWx0LCBsb2NhbE1lZGlhU3RyZWFtKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7IC8vIGVuZCBvZiBodG1sNV9xcmNvZGVcbiAgICAgICAgfSxcbiAgICAgICAgaHRtbDVfcXJjb2RlX3N0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvL3N0b3AgdGhlIHN0cmVhbSBhbmQgY2FuY2VsIHRpbWVvdXRzXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdzdHJlYW0nKS5nZXRWaWRlb1RyYWNrcygpLmZvckVhY2goZnVuY3Rpb24odmlkZW9UcmFjaykge1xuICAgICAgICAgICAgICAgICAgICB2aWRlb1RyYWNrLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkKHRoaXMpLmRhdGEoJ3RpbWVvdXQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkoalF1ZXJ5KTtcblxuIiwiZnVuY3Rpb24gRUNCKGNvdW50LGRhdGFDb2Rld29yZHMpe3RoaXMuY291bnQ9Y291bnQsdGhpcy5kYXRhQ29kZXdvcmRzPWRhdGFDb2Rld29yZHMsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGF0YUNvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YUNvZGV3b3Jkc30pfWZ1bmN0aW9uIEVDQmxvY2tzKGVjQ29kZXdvcmRzUGVyQmxvY2ssZWNCbG9ja3MxLGVjQmxvY2tzMil7dGhpcy5lY0NvZGV3b3Jkc1BlckJsb2NrPWVjQ29kZXdvcmRzUGVyQmxvY2ssZWNCbG9ja3MyP3RoaXMuZWNCbG9ja3M9bmV3IEFycmF5KGVjQmxvY2tzMSxlY0Jsb2NrczIpOnRoaXMuZWNCbG9ja3M9bmV3IEFycmF5KGVjQmxvY2tzMSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRUNDb2Rld29yZHNQZXJCbG9ja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWNDb2Rld29yZHNQZXJCbG9ja30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlRvdGFsRUNDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVjQ29kZXdvcmRzUGVyQmxvY2sqdGhpcy5OdW1CbG9ja3N9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJOdW1CbG9ja3NcIixmdW5jdGlvbigpe2Zvcih2YXIgdG90YWw9MCxpPTA7aTx0aGlzLmVjQmxvY2tzLmxlbmd0aDtpKyspdG90YWwrPXRoaXMuZWNCbG9ja3NbaV0ubGVuZ3RoO3JldHVybiB0b3RhbH0pLHRoaXMuZ2V0RUNCbG9ja3M9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lY0Jsb2Nrc319ZnVuY3Rpb24gVmVyc2lvbih2ZXJzaW9uTnVtYmVyLGFsaWdubWVudFBhdHRlcm5DZW50ZXJzLGVjQmxvY2tzMSxlY0Jsb2NrczIsZWNCbG9ja3MzLGVjQmxvY2tzNCl7dGhpcy52ZXJzaW9uTnVtYmVyPXZlcnNpb25OdW1iZXIsdGhpcy5hbGlnbm1lbnRQYXR0ZXJuQ2VudGVycz1hbGlnbm1lbnRQYXR0ZXJuQ2VudGVycyx0aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEsZWNCbG9ja3MyLGVjQmxvY2tzMyxlY0Jsb2NrczQpO2Zvcih2YXIgdG90YWw9MCxlY0NvZGV3b3Jkcz1lY0Jsb2NrczEuRUNDb2Rld29yZHNQZXJCbG9jayxlY2JBcnJheT1lY0Jsb2NrczEuZ2V0RUNCbG9ja3MoKSxpPTA7aTxlY2JBcnJheS5sZW5ndGg7aSsrKXt2YXIgZWNCbG9jaz1lY2JBcnJheVtpXTt0b3RhbCs9ZWNCbG9jay5Db3VudCooZWNCbG9jay5EYXRhQ29kZXdvcmRzK2VjQ29kZXdvcmRzKX10aGlzLnRvdGFsQ29kZXdvcmRzPXRvdGFsLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlZlcnNpb25OdW1iZXJcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnZlcnNpb25OdW1iZXJ9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJBbGlnbm1lbnRQYXR0ZXJuQ2VudGVyc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3RhbENvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudG90YWxDb2Rld29yZHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEaW1lbnNpb25Gb3JWZXJzaW9uXCIsZnVuY3Rpb24oKXtyZXR1cm4gMTcrNCp0aGlzLnZlcnNpb25OdW1iZXJ9KSx0aGlzLmJ1aWxkRnVuY3Rpb25QYXR0ZXJuPWZ1bmN0aW9uKCl7dmFyIGRpbWVuc2lvbj10aGlzLkRpbWVuc2lvbkZvclZlcnNpb24sYml0TWF0cml4PW5ldyBCaXRNYXRyaXgoZGltZW5zaW9uKTtiaXRNYXRyaXguc2V0UmVnaW9uKDAsMCw5LDkpLGJpdE1hdHJpeC5zZXRSZWdpb24oZGltZW5zaW9uLTgsMCw4LDkpLGJpdE1hdHJpeC5zZXRSZWdpb24oMCxkaW1lbnNpb24tOCw5LDgpO2Zvcih2YXIgbWF4PXRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnMubGVuZ3RoLHg9MDttYXg+eDt4KyspZm9yKHZhciBpPXRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnNbeF0tMix5PTA7bWF4Pnk7eSsrKTA9PXgmJigwPT15fHx5PT1tYXgtMSl8fHg9PW1heC0xJiYwPT15fHxiaXRNYXRyaXguc2V0UmVnaW9uKHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnNbeV0tMixpLDUsNSk7cmV0dXJuIGJpdE1hdHJpeC5zZXRSZWdpb24oNiw5LDEsZGltZW5zaW9uLTE3KSxiaXRNYXRyaXguc2V0UmVnaW9uKDksNixkaW1lbnNpb24tMTcsMSksdGhpcy52ZXJzaW9uTnVtYmVyPjYmJihiaXRNYXRyaXguc2V0UmVnaW9uKGRpbWVuc2lvbi0xMSwwLDMsNiksYml0TWF0cml4LnNldFJlZ2lvbigwLGRpbWVuc2lvbi0xMSw2LDMpKSxiaXRNYXRyaXh9LHRoaXMuZ2V0RUNCbG9ja3NGb3JMZXZlbD1mdW5jdGlvbihlY0xldmVsKXtyZXR1cm4gdGhpcy5lY0Jsb2Nrc1tlY0xldmVsLm9yZGluYWwoKV19fWZ1bmN0aW9uIGJ1aWxkVmVyc2lvbnMoKXtyZXR1cm4gbmV3IEFycmF5KG5ldyBWZXJzaW9uKDEsbmV3IEFycmF5LG5ldyBFQ0Jsb2Nrcyg3LG5ldyBFQ0IoMSwxOSkpLG5ldyBFQ0Jsb2NrcygxMCxuZXcgRUNCKDEsMTYpKSxuZXcgRUNCbG9ja3MoMTMsbmV3IEVDQigxLDEzKSksbmV3IEVDQmxvY2tzKDE3LG5ldyBFQ0IoMSw5KSkpLG5ldyBWZXJzaW9uKDIsbmV3IEFycmF5KDYsMTgpLG5ldyBFQ0Jsb2NrcygxMCxuZXcgRUNCKDEsMzQpKSxuZXcgRUNCbG9ja3MoMTYsbmV3IEVDQigxLDI4KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMSwyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEsMTYpKSksbmV3IFZlcnNpb24oMyxuZXcgQXJyYXkoNiwyMiksbmV3IEVDQmxvY2tzKDE1LG5ldyBFQ0IoMSw1NSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDEsNDQpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDE3KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMiwxMykpKSxuZXcgVmVyc2lvbig0LG5ldyBBcnJheSg2LDI2KSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQigxLDgwKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwzMikpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDIsMjQpKSxuZXcgRUNCbG9ja3MoMTYsbmV3IEVDQig0LDkpKSksbmV3IFZlcnNpb24oNSxuZXcgQXJyYXkoNiwzMCksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMSwxMDgpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigyLDQzKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNSksbmV3IEVDQigyLDE2KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMiwxMSksbmV3IEVDQigyLDEyKSkpLG5ldyBWZXJzaW9uKDYsbmV3IEFycmF5KDYsMzQpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsNjgpKSxuZXcgRUNCbG9ja3MoMTYsbmV3IEVDQig0LDI3KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNCwxOSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsMTUpKSksbmV3IFZlcnNpb24oNyxuZXcgQXJyYXkoNiwyMiwzOCksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMiw3OCkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDQsMzEpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDE0KSxuZXcgRUNCKDQsMTUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDEzKSxuZXcgRUNCKDEsMTQpKSksbmV3IFZlcnNpb24oOCxuZXcgQXJyYXkoNiwyNCw0MiksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw5NykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMzgpLG5ldyBFQ0IoMiwzOSkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDQsMTgpLG5ldyBFQ0IoMiwxOSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsMTQpLG5ldyBFQ0IoMiwxNSkpKSxuZXcgVmVyc2lvbig5LG5ldyBBcnJheSg2LDI2LDQ2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyLDExNikpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDMsMzYpLG5ldyBFQ0IoMiwzNykpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDQsMTYpLG5ldyBFQ0IoNCwxNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDQsMTIpLG5ldyBFQ0IoNCwxMykpKSxuZXcgVmVyc2lvbigxMCxuZXcgQXJyYXkoNiwyOCw1MCksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiw2OCksbmV3IEVDQigyLDY5KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCw0MyksbmV3IEVDQigxLDQ0KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNiwxOSksbmV3IEVDQigyLDIwKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNiwxNSksbmV3IEVDQigyLDE2KSkpLG5ldyBWZXJzaW9uKDExLG5ldyBBcnJheSg2LDMwLDU0KSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQig0LDgxKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMSw1MCksbmV3IEVDQig0LDUxKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCwyMiksbmV3IEVDQig0LDIzKSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMywxMiksbmV3IEVDQig4LDEzKSkpLG5ldyBWZXJzaW9uKDEyLG5ldyBBcnJheSg2LDMyLDU4KSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigyLDkyKSxuZXcgRUNCKDIsOTMpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig2LDM2KSxuZXcgRUNCKDIsMzcpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDIwKSxuZXcgRUNCKDYsMjEpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig3LDE0KSxuZXcgRUNCKDQsMTUpKSksbmV3IFZlcnNpb24oMTMsbmV3IEFycmF5KDYsMzQsNjIpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsMTA3KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoOCwzNyksbmV3IEVDQigxLDM4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoOCwyMCksbmV3IEVDQig0LDIxKSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMTIsMTEpLG5ldyBFQ0IoNCwxMikpKSxuZXcgVmVyc2lvbigxNCxuZXcgQXJyYXkoNiwyNiw0Niw2NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMywxMTUpLG5ldyBFQ0IoMSwxMTYpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig0LDQwKSxuZXcgRUNCKDUsNDEpKSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQigxMSwxNiksbmV3IEVDQig1LDE3KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMTEsMTIpLG5ldyBFQ0IoNSwxMykpKSxuZXcgVmVyc2lvbigxNSxuZXcgQXJyYXkoNiwyNiw0OCw3MCksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoNSw4NyksbmV3IEVDQigxLDg4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNSw0MSksbmV3IEVDQig1LDQyKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwyNCksbmV3IEVDQig3LDI1KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMTEsMTIpLG5ldyBFQ0IoNywxMykpKSxuZXcgVmVyc2lvbigxNixuZXcgQXJyYXkoNiwyNiw1MCw3NCksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNSw5OCksbmV3IEVDQigxLDk5KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNyw0NSksbmV3IEVDQigzLDQ2KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMTUsMTkpLG5ldyBFQ0IoMiwyMCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTUpLG5ldyBFQ0IoMTMsMTYpKSksbmV3IFZlcnNpb24oMTcsbmV3IEFycmF5KDYsMzAsNTQsNzgpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEsMTA3KSxuZXcgRUNCKDUsMTA4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTAsNDYpLG5ldyBFQ0IoMSw0NykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEsMjIpLG5ldyBFQ0IoMTUsMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDE0KSxuZXcgRUNCKDE3LDE1KSkpLG5ldyBWZXJzaW9uKDE4LG5ldyBBcnJheSg2LDMwLDU2LDgyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig1LDEyMCksbmV3IEVDQigxLDEyMSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDksNDMpLG5ldyBFQ0IoNCw0NCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDIyKSxuZXcgRUNCKDEsMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDE0KSxuZXcgRUNCKDE5LDE1KSkpLG5ldyBWZXJzaW9uKDE5LG5ldyBBcnJheSg2LDMwLDU4LDg2KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigzLDExMyksbmV3IEVDQig0LDExNCkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDMsNDQpLG5ldyBFQ0IoMTEsNDUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxNywyMSksbmV3IEVDQig0LDIyKSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoOSwxMyksbmV3IEVDQigxNiwxNCkpKSxuZXcgVmVyc2lvbigyMCxuZXcgQXJyYXkoNiwzNCw2Miw5MCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMywxMDcpLG5ldyBFQ0IoNSwxMDgpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigzLDQxKSxuZXcgRUNCKDEzLDQyKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTUsMjQpLG5ldyBFQ0IoNSwyNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE1LDE1KSxuZXcgRUNCKDEwLDE2KSkpLG5ldyBWZXJzaW9uKDIxLG5ldyBBcnJheSg2LDI4LDUwLDcyLDk0KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDExNiksbmV3IEVDQig0LDExNykpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDE3LDQyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTcsMjIpLG5ldyBFQ0IoNiwyMykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE2KSxuZXcgRUNCKDYsMTcpKSksbmV3IFZlcnNpb24oMjIsbmV3IEFycmF5KDYsMjYsNTAsNzQsOTgpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIsMTExKSxuZXcgRUNCKDcsMTEyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTcsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig3LDI0KSxuZXcgRUNCKDE2LDI1KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMzQsMTMpKSksbmV3IFZlcnNpb24oMjMsbmV3IEFycmF5KDYsMzAsNTQsNzQsMTAyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0LDEyMSksbmV3IEVDQig1LDEyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsNDcpLG5ldyBFQ0IoMTQsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE2LDE1KSxuZXcgRUNCKDE0LDE2KSkpLG5ldyBWZXJzaW9uKDI0LG5ldyBBcnJheSg2LDI4LDU0LDgwLDEwNiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNiwxMTcpLG5ldyBFQ0IoNCwxMTgpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig2LDQ1KSxuZXcgRUNCKDE0LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMjQpLG5ldyBFQ0IoMTYsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzMCwxNiksbmV3IEVDQigyLDE3KSkpLG5ldyBWZXJzaW9uKDI1LG5ldyBBcnJheSg2LDMyLDU4LDg0LDExMCksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoOCwxMDYpLG5ldyBFQ0IoNCwxMDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig4LDQ3KSxuZXcgRUNCKDEzLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywyNCksbmV3IEVDQigyMiwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIyLDE1KSxuZXcgRUNCKDEzLDE2KSkpLG5ldyBWZXJzaW9uKDI2LG5ldyBBcnJheSg2LDMwLDU4LDg2LDExNCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTAsMTE0KSxuZXcgRUNCKDIsMTE1KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTksNDYpLG5ldyBFQ0IoNCw0NykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDI4LDIyKSxuZXcgRUNCKDYsMjMpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzMywxNiksbmV3IEVDQig0LDE3KSkpLG5ldyBWZXJzaW9uKDI3LG5ldyBBcnJheSg2LDM0LDYyLDkwLDExOCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoOCwxMjIpLG5ldyBFQ0IoNCwxMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyMiw0NSksbmV3IEVDQigzLDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoOCwyMyksbmV3IEVDQigyNiwyNCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEyLDE1KSxuZXcgRUNCKDI4LDE2KSkpLG5ldyBWZXJzaW9uKDI4LG5ldyBBcnJheSg2LDI2LDUwLDc0LDk4LDEyMiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMywxMTcpLG5ldyBFQ0IoMTAsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMyw0NSksbmV3IEVDQigyMyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQsMjQpLG5ldyBFQ0IoMzEsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwxNSksbmV3IEVDQigzMSwxNikpKSxuZXcgVmVyc2lvbigyOSxuZXcgQXJyYXkoNiwzMCw1NCw3OCwxMDIsMTI2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig3LDExNiksbmV3IEVDQig3LDExNykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIxLDQ1KSxuZXcgRUNCKDcsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxLDIzKSxuZXcgRUNCKDM3LDI0KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTksMTUpLG5ldyBFQ0IoMjYsMTYpKSksbmV3IFZlcnNpb24oMzAsbmV3IEFycmF5KDYsMjYsNTIsNzgsMTA0LDEzMCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwxMTUpLG5ldyBFQ0IoMTAsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTksNDcpLG5ldyBFQ0IoMTAsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNSwyNCksbmV3IEVDQigyNSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIzLDE1KSxuZXcgRUNCKDI1LDE2KSkpLG5ldyBWZXJzaW9uKDMxLG5ldyBBcnJheSg2LDMwLDU2LDgyLDEwOCwxMzQpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEzLDExNSksbmV3IEVDQigzLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIsNDYpLG5ldyBFQ0IoMjksNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0MiwyNCksbmV3IEVDQigxLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjMsMTUpLG5ldyBFQ0IoMjgsMTYpKSksbmV3IFZlcnNpb24oMzIsbmV3IEFycmF5KDYsMzQsNjAsODYsMTEyLDEzOCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTcsMTE1KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTAsNDYpLG5ldyBFQ0IoMjMsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMCwyNCksbmV3IEVDQigzNSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE1KSxuZXcgRUNCKDM1LDE2KSkpLG5ldyBWZXJzaW9uKDMzLG5ldyBBcnJheSg2LDMwLDU4LDg2LDExNCwxNDIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDExNSksbmV3IEVDQigxLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE0LDQ2KSxuZXcgRUNCKDIxLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjksMjQpLG5ldyBFQ0IoMTksMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwxNSksbmV3IEVDQig0NiwxNikpKSxuZXcgVmVyc2lvbigzNCxuZXcgQXJyYXkoNiwzNCw2Miw5MCwxMTgsMTQ2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMywxMTUpLG5ldyBFQ0IoNiwxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNCw0NiksbmV3IEVDQigyMyw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ0LDI0KSxuZXcgRUNCKDcsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig1OSwxNiksbmV3IEVDQigxLDE3KSkpLG5ldyBWZXJzaW9uKDM1LG5ldyBBcnJheSg2LDMwLDU0LDc4LDEwMiwxMjYsMTUwKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMiwxMjEpLG5ldyBFQ0IoNywxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxMiw0NyksbmV3IEVDQigyNiw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDM5LDI0KSxuZXcgRUNCKDE0LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjIsMTUpLG5ldyBFQ0IoNDEsMTYpKSksbmV3IFZlcnNpb24oMzYsbmV3IEFycmF5KDYsMjQsNTAsNzYsMTAyLDEyOCwxNTQpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDYsMTIxKSxuZXcgRUNCKDE0LDEyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDYsNDcpLG5ldyBFQ0IoMzQsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0NiwyNCksbmV3IEVDQigxMCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIsMTUpLG5ldyBFQ0IoNjQsMTYpKSksbmV3IFZlcnNpb24oMzcsbmV3IEFycmF5KDYsMjgsNTQsODAsMTA2LDEzMiwxNTgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDEyMiksbmV3IEVDQig0LDEyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDI5LDQ2KSxuZXcgRUNCKDE0LDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDksMjQpLG5ldyBFQ0IoMTAsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyNCwxNSksbmV3IEVDQig0NiwxNikpKSxuZXcgVmVyc2lvbigzOCxuZXcgQXJyYXkoNiwzMiw1OCw4NCwxMTAsMTM2LDE2MiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNCwxMjIpLG5ldyBFQ0IoMTgsMTIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTMsNDYpLG5ldyBFQ0IoMzIsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0OCwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQyLDE1KSxuZXcgRUNCKDMyLDE2KSkpLG5ldyBWZXJzaW9uKDM5LG5ldyBBcnJheSg2LDI2LDU0LDgyLDExMCwxMzgsMTY2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMCwxMTcpLG5ldyBFQ0IoNCwxMTgpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0MCw0NyksbmV3IEVDQig3LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDMsMjQpLG5ldyBFQ0IoMjIsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMCwxNSksbmV3IEVDQig2NywxNikpKSxuZXcgVmVyc2lvbig0MCxuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQsMTQyLDE3MCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTksMTE4KSxuZXcgRUNCKDYsMTE5KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTgsNDcpLG5ldyBFQ0IoMzEsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzNCwyNCksbmV3IEVDQigzNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIwLDE1KSxuZXcgRUNCKDYxLDE2KSkpKX1mdW5jdGlvbiBQZXJzcGVjdGl2ZVRyYW5zZm9ybShhMTEsYTIxLGEzMSxhMTIsYTIyLGEzMixhMTMsYTIzLGEzMyl7dGhpcy5hMTE9YTExLHRoaXMuYTEyPWExMix0aGlzLmExMz1hMTMsdGhpcy5hMjE9YTIxLHRoaXMuYTIyPWEyMix0aGlzLmEyMz1hMjMsdGhpcy5hMzE9YTMxLHRoaXMuYTMyPWEzMix0aGlzLmEzMz1hMzMsdGhpcy50cmFuc2Zvcm1Qb2ludHMxPWZ1bmN0aW9uKHBvaW50cyl7Zm9yKHZhciBtYXg9cG9pbnRzLmxlbmd0aCxhMTE9dGhpcy5hMTEsYTEyPXRoaXMuYTEyLGExMz10aGlzLmExMyxhMjE9dGhpcy5hMjEsYTIyPXRoaXMuYTIyLGEyMz10aGlzLmEyMyxhMzE9dGhpcy5hMzEsYTMyPXRoaXMuYTMyLGEzMz10aGlzLmEzMyxpPTA7bWF4Pmk7aSs9Mil7dmFyIHg9cG9pbnRzW2ldLHk9cG9pbnRzW2krMV0sZGVub21pbmF0b3I9YTEzKngrYTIzKnkrYTMzO3BvaW50c1tpXT0oYTExKngrYTIxKnkrYTMxKS9kZW5vbWluYXRvcixwb2ludHNbaSsxXT0oYTEyKngrYTIyKnkrYTMyKS9kZW5vbWluYXRvcn19LHRoaXMudHJhbnNmb3JtUG9pbnRzMj1mdW5jdGlvbih4VmFsdWVzLHlWYWx1ZXMpe2Zvcih2YXIgbj14VmFsdWVzLmxlbmd0aCxpPTA7bj5pO2krKyl7dmFyIHg9eFZhbHVlc1tpXSx5PXlWYWx1ZXNbaV0sZGVub21pbmF0b3I9dGhpcy5hMTMqeCt0aGlzLmEyMyp5K3RoaXMuYTMzO3hWYWx1ZXNbaV09KHRoaXMuYTExKngrdGhpcy5hMjEqeSt0aGlzLmEzMSkvZGVub21pbmF0b3IseVZhbHVlc1tpXT0odGhpcy5hMTIqeCt0aGlzLmEyMip5K3RoaXMuYTMyKS9kZW5vbWluYXRvcn19LHRoaXMuYnVpbGRBZGpvaW50PWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSh0aGlzLmEyMip0aGlzLmEzMy10aGlzLmEyMyp0aGlzLmEzMix0aGlzLmEyMyp0aGlzLmEzMS10aGlzLmEyMSp0aGlzLmEzMyx0aGlzLmEyMSp0aGlzLmEzMi10aGlzLmEyMip0aGlzLmEzMSx0aGlzLmExMyp0aGlzLmEzMi10aGlzLmExMip0aGlzLmEzMyx0aGlzLmExMSp0aGlzLmEzMy10aGlzLmExMyp0aGlzLmEzMSx0aGlzLmExMip0aGlzLmEzMS10aGlzLmExMSp0aGlzLmEzMix0aGlzLmExMip0aGlzLmEyMy10aGlzLmExMyp0aGlzLmEyMix0aGlzLmExMyp0aGlzLmEyMS10aGlzLmExMSp0aGlzLmEyMyx0aGlzLmExMSp0aGlzLmEyMi10aGlzLmExMip0aGlzLmEyMSl9LHRoaXMudGltZXM9ZnVuY3Rpb24ob3RoZXIpe3JldHVybiBuZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0odGhpcy5hMTEqb3RoZXIuYTExK3RoaXMuYTIxKm90aGVyLmExMit0aGlzLmEzMSpvdGhlci5hMTMsdGhpcy5hMTEqb3RoZXIuYTIxK3RoaXMuYTIxKm90aGVyLmEyMit0aGlzLmEzMSpvdGhlci5hMjMsdGhpcy5hMTEqb3RoZXIuYTMxK3RoaXMuYTIxKm90aGVyLmEzMit0aGlzLmEzMSpvdGhlci5hMzMsdGhpcy5hMTIqb3RoZXIuYTExK3RoaXMuYTIyKm90aGVyLmExMit0aGlzLmEzMipvdGhlci5hMTMsdGhpcy5hMTIqb3RoZXIuYTIxK3RoaXMuYTIyKm90aGVyLmEyMit0aGlzLmEzMipvdGhlci5hMjMsdGhpcy5hMTIqb3RoZXIuYTMxK3RoaXMuYTIyKm90aGVyLmEzMit0aGlzLmEzMipvdGhlci5hMzMsdGhpcy5hMTMqb3RoZXIuYTExK3RoaXMuYTIzKm90aGVyLmExMit0aGlzLmEzMypvdGhlci5hMTMsdGhpcy5hMTMqb3RoZXIuYTIxK3RoaXMuYTIzKm90aGVyLmEyMit0aGlzLmEzMypvdGhlci5hMjMsdGhpcy5hMTMqb3RoZXIuYTMxK3RoaXMuYTIzKm90aGVyLmEzMit0aGlzLmEzMypvdGhlci5hMzMpfX1mdW5jdGlvbiBEZXRlY3RvclJlc3VsdChiaXRzLHBvaW50cyl7dGhpcy5iaXRzPWJpdHMsdGhpcy5wb2ludHM9cG9pbnRzfWZ1bmN0aW9uIERldGVjdG9yKGltYWdlKXt0aGlzLmltYWdlPWltYWdlLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjaz1udWxsLHRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuPWZ1bmN0aW9uKGZyb21YLGZyb21ZLHRvWCx0b1kpe3ZhciBzdGVlcD1NYXRoLmFicyh0b1ktZnJvbVkpPk1hdGguYWJzKHRvWC1mcm9tWCk7aWYoc3RlZXApe3ZhciB0ZW1wPWZyb21YO2Zyb21YPWZyb21ZLGZyb21ZPXRlbXAsdGVtcD10b1gsdG9YPXRvWSx0b1k9dGVtcH1mb3IodmFyIGR4PU1hdGguYWJzKHRvWC1mcm9tWCksZHk9TWF0aC5hYnModG9ZLWZyb21ZKSxlcnJvcj0tZHg+PjEseXN0ZXA9dG9ZPmZyb21ZPzE6LTEseHN0ZXA9dG9YPmZyb21YPzE6LTEsc3RhdGU9MCx4PWZyb21YLHk9ZnJvbVk7eCE9dG9YO3grPXhzdGVwKXt2YXIgcmVhbFg9c3RlZXA/eTp4LHJlYWxZPXN0ZWVwP3g6eTtpZigxPT1zdGF0ZT90aGlzLmltYWdlW3JlYWxYK3JlYWxZKnFyY29kZS53aWR0aF0mJnN0YXRlKys6dGhpcy5pbWFnZVtyZWFsWCtyZWFsWSpxcmNvZGUud2lkdGhdfHxzdGF0ZSsrLDM9PXN0YXRlKXt2YXIgZGlmZlg9eC1mcm9tWCxkaWZmWT15LWZyb21ZO3JldHVybiBNYXRoLnNxcnQoZGlmZlgqZGlmZlgrZGlmZlkqZGlmZlkpfWlmKGVycm9yKz1keSxlcnJvcj4wKXtpZih5PT10b1kpYnJlYWs7eSs9eXN0ZXAsZXJyb3ItPWR4fX12YXIgZGlmZlgyPXRvWC1mcm9tWCxkaWZmWTI9dG9ZLWZyb21ZO3JldHVybiBNYXRoLnNxcnQoZGlmZlgyKmRpZmZYMitkaWZmWTIqZGlmZlkyKX0sdGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW5Cb3RoV2F5cz1mdW5jdGlvbihmcm9tWCxmcm9tWSx0b1gsdG9ZKXt2YXIgcmVzdWx0PXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuKGZyb21YLGZyb21ZLHRvWCx0b1kpLHNjYWxlPTEsb3RoZXJUb1g9ZnJvbVgtKHRvWC1mcm9tWCk7MD5vdGhlclRvWD8oc2NhbGU9ZnJvbVgvKGZyb21YLW90aGVyVG9YKSxvdGhlclRvWD0wKTpvdGhlclRvWD49cXJjb2RlLndpZHRoJiYoc2NhbGU9KHFyY29kZS53aWR0aC0xLWZyb21YKS8ob3RoZXJUb1gtZnJvbVgpLG90aGVyVG9YPXFyY29kZS53aWR0aC0xKTt2YXIgb3RoZXJUb1k9TWF0aC5mbG9vcihmcm9tWS0odG9ZLWZyb21ZKSpzY2FsZSk7cmV0dXJuIHNjYWxlPTEsMD5vdGhlclRvWT8oc2NhbGU9ZnJvbVkvKGZyb21ZLW90aGVyVG9ZKSxvdGhlclRvWT0wKTpvdGhlclRvWT49cXJjb2RlLmhlaWdodCYmKHNjYWxlPShxcmNvZGUuaGVpZ2h0LTEtZnJvbVkpLyhvdGhlclRvWS1mcm9tWSksb3RoZXJUb1k9cXJjb2RlLmhlaWdodC0xKSxvdGhlclRvWD1NYXRoLmZsb29yKGZyb21YKyhvdGhlclRvWC1mcm9tWCkqc2NhbGUpLHJlc3VsdCs9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW4oZnJvbVgsZnJvbVksb3RoZXJUb1gsb3RoZXJUb1kpLHJlc3VsdC0xfSx0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemVPbmVXYXk9ZnVuY3Rpb24ocGF0dGVybixvdGhlclBhdHRlcm4pe3ZhciBtb2R1bGVTaXplRXN0MT10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bkJvdGhXYXlzKE1hdGguZmxvb3IocGF0dGVybi5YKSxNYXRoLmZsb29yKHBhdHRlcm4uWSksTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWCksTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWSkpLG1vZHVsZVNpemVFc3QyPXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuQm90aFdheXMoTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWCksTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWSksTWF0aC5mbG9vcihwYXR0ZXJuLlgpLE1hdGguZmxvb3IocGF0dGVybi5ZKSk7cmV0dXJuIGlzTmFOKG1vZHVsZVNpemVFc3QxKT9tb2R1bGVTaXplRXN0Mi83OmlzTmFOKG1vZHVsZVNpemVFc3QyKT9tb2R1bGVTaXplRXN0MS83Oihtb2R1bGVTaXplRXN0MSttb2R1bGVTaXplRXN0MikvMTR9LHRoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZT1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQpe3JldHVybih0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemVPbmVXYXkodG9wTGVmdCx0b3BSaWdodCkrdGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5KHRvcExlZnQsYm90dG9tTGVmdCkpLzJ9LHRoaXMuZGlzdGFuY2U9ZnVuY3Rpb24ocGF0dGVybjEscGF0dGVybjIpe3JldHVybiB4RGlmZj1wYXR0ZXJuMS5YLXBhdHRlcm4yLlgseURpZmY9cGF0dGVybjEuWS1wYXR0ZXJuMi5ZLE1hdGguc3FydCh4RGlmZip4RGlmZit5RGlmZip5RGlmZil9LHRoaXMuY29tcHV0ZURpbWVuc2lvbj1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsbW9kdWxlU2l6ZSl7dmFyIHRsdHJDZW50ZXJzRGltZW5zaW9uPU1hdGgucm91bmQodGhpcy5kaXN0YW5jZSh0b3BMZWZ0LHRvcFJpZ2h0KS9tb2R1bGVTaXplKSx0bGJsQ2VudGVyc0RpbWVuc2lvbj1NYXRoLnJvdW5kKHRoaXMuZGlzdGFuY2UodG9wTGVmdCxib3R0b21MZWZ0KS9tb2R1bGVTaXplKSxkaW1lbnNpb249KHRsdHJDZW50ZXJzRGltZW5zaW9uK3RsYmxDZW50ZXJzRGltZW5zaW9uPj4xKSs3O3N3aXRjaCgzJmRpbWVuc2lvbil7Y2FzZSAwOmRpbWVuc2lvbisrO2JyZWFrO2Nhc2UgMjpkaW1lbnNpb24tLTticmVhaztjYXNlIDM6dGhyb3dcIkVycm9yXCJ9cmV0dXJuIGRpbWVuc2lvbn0sdGhpcy5maW5kQWxpZ25tZW50SW5SZWdpb249ZnVuY3Rpb24ob3ZlcmFsbEVzdE1vZHVsZVNpemUsZXN0QWxpZ25tZW50WCxlc3RBbGlnbm1lbnRZLGFsbG93YW5jZUZhY3Rvcil7dmFyIGFsbG93YW5jZT1NYXRoLmZsb29yKGFsbG93YW5jZUZhY3RvcipvdmVyYWxsRXN0TW9kdWxlU2l6ZSksYWxpZ25tZW50QXJlYUxlZnRYPU1hdGgubWF4KDAsZXN0QWxpZ25tZW50WC1hbGxvd2FuY2UpLGFsaWdubWVudEFyZWFSaWdodFg9TWF0aC5taW4ocXJjb2RlLndpZHRoLTEsZXN0QWxpZ25tZW50WCthbGxvd2FuY2UpO2lmKDMqb3ZlcmFsbEVzdE1vZHVsZVNpemU+YWxpZ25tZW50QXJlYVJpZ2h0WC1hbGlnbm1lbnRBcmVhTGVmdFgpdGhyb3dcIkVycm9yXCI7dmFyIGFsaWdubWVudEFyZWFUb3BZPU1hdGgubWF4KDAsZXN0QWxpZ25tZW50WS1hbGxvd2FuY2UpLGFsaWdubWVudEFyZWFCb3R0b21ZPU1hdGgubWluKHFyY29kZS5oZWlnaHQtMSxlc3RBbGlnbm1lbnRZK2FsbG93YW5jZSksYWxpZ25tZW50RmluZGVyPW5ldyBBbGlnbm1lbnRQYXR0ZXJuRmluZGVyKHRoaXMuaW1hZ2UsYWxpZ25tZW50QXJlYUxlZnRYLGFsaWdubWVudEFyZWFUb3BZLGFsaWdubWVudEFyZWFSaWdodFgtYWxpZ25tZW50QXJlYUxlZnRYLGFsaWdubWVudEFyZWFCb3R0b21ZLWFsaWdubWVudEFyZWFUb3BZLG92ZXJhbGxFc3RNb2R1bGVTaXplLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjayk7cmV0dXJuIGFsaWdubWVudEZpbmRlci5maW5kKCl9LHRoaXMuY3JlYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxhbGlnbm1lbnRQYXR0ZXJuLGRpbWVuc2lvbil7dmFyIGJvdHRvbVJpZ2h0WCxib3R0b21SaWdodFksc291cmNlQm90dG9tUmlnaHRYLHNvdXJjZUJvdHRvbVJpZ2h0WSxkaW1NaW51c1RocmVlPWRpbWVuc2lvbi0zLjU7bnVsbCE9YWxpZ25tZW50UGF0dGVybj8oYm90dG9tUmlnaHRYPWFsaWdubWVudFBhdHRlcm4uWCxib3R0b21SaWdodFk9YWxpZ25tZW50UGF0dGVybi5ZLHNvdXJjZUJvdHRvbVJpZ2h0WD1zb3VyY2VCb3R0b21SaWdodFk9ZGltTWludXNUaHJlZS0zKTooYm90dG9tUmlnaHRYPXRvcFJpZ2h0LlgtdG9wTGVmdC5YK2JvdHRvbUxlZnQuWCxib3R0b21SaWdodFk9dG9wUmlnaHQuWS10b3BMZWZ0LlkrYm90dG9tTGVmdC5ZLHNvdXJjZUJvdHRvbVJpZ2h0WD1zb3VyY2VCb3R0b21SaWdodFk9ZGltTWludXNUaHJlZSk7dmFyIHRyYW5zZm9ybT1QZXJzcGVjdGl2ZVRyYW5zZm9ybS5xdWFkcmlsYXRlcmFsVG9RdWFkcmlsYXRlcmFsKDMuNSwzLjUsZGltTWludXNUaHJlZSwzLjUsc291cmNlQm90dG9tUmlnaHRYLHNvdXJjZUJvdHRvbVJpZ2h0WSwzLjUsZGltTWludXNUaHJlZSx0b3BMZWZ0LlgsdG9wTGVmdC5ZLHRvcFJpZ2h0LlgsdG9wUmlnaHQuWSxib3R0b21SaWdodFgsYm90dG9tUmlnaHRZLGJvdHRvbUxlZnQuWCxib3R0b21MZWZ0LlkpO3JldHVybiB0cmFuc2Zvcm19LHRoaXMuc2FtcGxlR3JpZD1mdW5jdGlvbihpbWFnZSx0cmFuc2Zvcm0sZGltZW5zaW9uKXt2YXIgc2FtcGxlcj1HcmlkU2FtcGxlcjtyZXR1cm4gc2FtcGxlci5zYW1wbGVHcmlkMyhpbWFnZSxkaW1lbnNpb24sdHJhbnNmb3JtKX0sdGhpcy5wcm9jZXNzRmluZGVyUGF0dGVybkluZm89ZnVuY3Rpb24oaW5mbyl7dmFyIHRvcExlZnQ9aW5mby5Ub3BMZWZ0LHRvcFJpZ2h0PWluZm8uVG9wUmlnaHQsYm90dG9tTGVmdD1pbmZvLkJvdHRvbUxlZnQsbW9kdWxlU2l6ZT10aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemUodG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0KTtpZigxPm1vZHVsZVNpemUpdGhyb3dcIkVycm9yXCI7dmFyIGRpbWVuc2lvbj10aGlzLmNvbXB1dGVEaW1lbnNpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LG1vZHVsZVNpemUpLHByb3Zpc2lvbmFsVmVyc2lvbj1WZXJzaW9uLmdldFByb3Zpc2lvbmFsVmVyc2lvbkZvckRpbWVuc2lvbihkaW1lbnNpb24pLG1vZHVsZXNCZXR3ZWVuRlBDZW50ZXJzPXByb3Zpc2lvbmFsVmVyc2lvbi5EaW1lbnNpb25Gb3JWZXJzaW9uLTcsYWxpZ25tZW50UGF0dGVybj1udWxsO2lmKHByb3Zpc2lvbmFsVmVyc2lvbi5BbGlnbm1lbnRQYXR0ZXJuQ2VudGVycy5sZW5ndGg+MClmb3IodmFyIGJvdHRvbVJpZ2h0WD10b3BSaWdodC5YLXRvcExlZnQuWCtib3R0b21MZWZ0LlgsYm90dG9tUmlnaHRZPXRvcFJpZ2h0LlktdG9wTGVmdC5ZK2JvdHRvbUxlZnQuWSxjb3JyZWN0aW9uVG9Ub3BMZWZ0PTEtMy9tb2R1bGVzQmV0d2VlbkZQQ2VudGVycyxlc3RBbGlnbm1lbnRYPU1hdGguZmxvb3IodG9wTGVmdC5YK2NvcnJlY3Rpb25Ub1RvcExlZnQqKGJvdHRvbVJpZ2h0WC10b3BMZWZ0LlgpKSxlc3RBbGlnbm1lbnRZPU1hdGguZmxvb3IodG9wTGVmdC5ZK2NvcnJlY3Rpb25Ub1RvcExlZnQqKGJvdHRvbVJpZ2h0WS10b3BMZWZ0LlkpKSxpPTQ7MTY+PWk7aTw8PTEpe2FsaWdubWVudFBhdHRlcm49dGhpcy5maW5kQWxpZ25tZW50SW5SZWdpb24obW9kdWxlU2l6ZSxlc3RBbGlnbm1lbnRYLGVzdEFsaWdubWVudFksaSk7YnJlYWt9dmFyIHBvaW50cyx0cmFuc2Zvcm09dGhpcy5jcmVhdGVUcmFuc2Zvcm0odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LGFsaWdubWVudFBhdHRlcm4sZGltZW5zaW9uKSxiaXRzPXRoaXMuc2FtcGxlR3JpZCh0aGlzLmltYWdlLHRyYW5zZm9ybSxkaW1lbnNpb24pO3JldHVybiBwb2ludHM9bnVsbD09YWxpZ25tZW50UGF0dGVybj9uZXcgQXJyYXkoYm90dG9tTGVmdCx0b3BMZWZ0LHRvcFJpZ2h0KTpuZXcgQXJyYXkoYm90dG9tTGVmdCx0b3BMZWZ0LHRvcFJpZ2h0LGFsaWdubWVudFBhdHRlcm4pLG5ldyBEZXRlY3RvclJlc3VsdChiaXRzLHBvaW50cyl9LHRoaXMuZGV0ZWN0PWZ1bmN0aW9uKCl7dmFyIGluZm89KG5ldyBGaW5kZXJQYXR0ZXJuRmluZGVyKS5maW5kRmluZGVyUGF0dGVybih0aGlzLmltYWdlKTtyZXR1cm4gdGhpcy5wcm9jZXNzRmluZGVyUGF0dGVybkluZm8oaW5mbyl9fWZ1bmN0aW9uIEZvcm1hdEluZm9ybWF0aW9uKGZvcm1hdEluZm8pe3RoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWw9RXJyb3JDb3JyZWN0aW9uTGV2ZWwuZm9yQml0cyhmb3JtYXRJbmZvPj4zJjMpLHRoaXMuZGF0YU1hc2s9NyZmb3JtYXRJbmZvLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVycm9yQ29ycmVjdGlvbkxldmVsXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFNYXNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kYXRhTWFza30pLHRoaXMuR2V0SGFzaENvZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbC5vcmRpbmFsKCk8PDN8ZGF0YU1hc2t9LHRoaXMuRXF1YWxzPWZ1bmN0aW9uKG8pe3ZhciBvdGhlcj1vO3JldHVybiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsPT1vdGhlci5lcnJvckNvcnJlY3Rpb25MZXZlbCYmdGhpcy5kYXRhTWFzaz09b3RoZXIuZGF0YU1hc2t9fWZ1bmN0aW9uIEVycm9yQ29ycmVjdGlvbkxldmVsKG9yZGluYWwsYml0cyxuYW1lKXt0aGlzLm9yZGluYWxfUmVuYW1lZF9GaWVsZD1vcmRpbmFsLHRoaXMuYml0cz1iaXRzLHRoaXMubmFtZT1uYW1lLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkJpdHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmJpdHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJOYW1lXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYW1lfSksdGhpcy5vcmRpbmFsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub3JkaW5hbF9SZW5hbWVkX0ZpZWxkfX1mdW5jdGlvbiBCaXRNYXRyaXgod2lkdGgsaGVpZ2h0KXtpZihoZWlnaHR8fChoZWlnaHQ9d2lkdGgpLDE+d2lkdGh8fDE+aGVpZ2h0KXRocm93XCJCb3RoIGRpbWVuc2lvbnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMFwiO3RoaXMud2lkdGg9d2lkdGgsdGhpcy5oZWlnaHQ9aGVpZ2h0O3ZhciByb3dTaXplPXdpZHRoPj41OzAhPSgzMSZ3aWR0aCkmJnJvd1NpemUrKyx0aGlzLnJvd1NpemU9cm93U2l6ZSx0aGlzLmJpdHM9bmV3IEFycmF5KHJvd1NpemUqaGVpZ2h0KTtmb3IodmFyIGk9MDtpPHRoaXMuYml0cy5sZW5ndGg7aSsrKXRoaXMuYml0c1tpXT0wO3RoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIldpZHRoXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy53aWR0aH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkhlaWdodFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGVpZ2h0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGltZW5zaW9uXCIsZnVuY3Rpb24oKXtpZih0aGlzLndpZHRoIT10aGlzLmhlaWdodCl0aHJvd1wiQ2FuJ3QgY2FsbCBnZXREaW1lbnNpb24oKSBvbiBhIG5vbi1zcXVhcmUgbWF0cml4XCI7cmV0dXJuIHRoaXMud2lkdGh9KSx0aGlzLmdldF9SZW5hbWVkPWZ1bmN0aW9uKHgseSl7dmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSsoeD4+NSk7cmV0dXJuIDAhPSgxJlVSU2hpZnQodGhpcy5iaXRzW29mZnNldF0sMzEmeCkpfSx0aGlzLnNldF9SZW5hbWVkPWZ1bmN0aW9uKHgseSl7dmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSsoeD4+NSk7dGhpcy5iaXRzW29mZnNldF18PTE8PCgzMSZ4KX0sdGhpcy5mbGlwPWZ1bmN0aW9uKHgseSl7dmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSsoeD4+NSk7dGhpcy5iaXRzW29mZnNldF1ePTE8PCgzMSZ4KX0sdGhpcy5jbGVhcj1mdW5jdGlvbigpe2Zvcih2YXIgbWF4PXRoaXMuYml0cy5sZW5ndGgsaT0wO21heD5pO2krKyl0aGlzLmJpdHNbaV09MH0sdGhpcy5zZXRSZWdpb249ZnVuY3Rpb24obGVmdCx0b3Asd2lkdGgsaGVpZ2h0KXtpZigwPnRvcHx8MD5sZWZ0KXRocm93XCJMZWZ0IGFuZCB0b3AgbXVzdCBiZSBub25uZWdhdGl2ZVwiO2lmKDE+aGVpZ2h0fHwxPndpZHRoKXRocm93XCJIZWlnaHQgYW5kIHdpZHRoIG11c3QgYmUgYXQgbGVhc3QgMVwiO3ZhciByaWdodD1sZWZ0K3dpZHRoLGJvdHRvbT10b3AraGVpZ2h0O2lmKGJvdHRvbT50aGlzLmhlaWdodHx8cmlnaHQ+dGhpcy53aWR0aCl0aHJvd1wiVGhlIHJlZ2lvbiBtdXN0IGZpdCBpbnNpZGUgdGhlIG1hdHJpeFwiO2Zvcih2YXIgeT10b3A7Ym90dG9tPnk7eSsrKWZvcih2YXIgb2Zmc2V0PXkqdGhpcy5yb3dTaXplLHg9bGVmdDtyaWdodD54O3grKyl0aGlzLmJpdHNbb2Zmc2V0Kyh4Pj41KV18PTE8PCgzMSZ4KX19ZnVuY3Rpb24gRGF0YUJsb2NrKG51bURhdGFDb2Rld29yZHMsY29kZXdvcmRzKXt0aGlzLm51bURhdGFDb2Rld29yZHM9bnVtRGF0YUNvZGV3b3Jkcyx0aGlzLmNvZGV3b3Jkcz1jb2Rld29yZHMsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTnVtRGF0YUNvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubnVtRGF0YUNvZGV3b3Jkc30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29kZXdvcmRzfSl9ZnVuY3Rpb24gQml0TWF0cml4UGFyc2VyKGJpdE1hdHJpeCl7dmFyIGRpbWVuc2lvbj1iaXRNYXRyaXguRGltZW5zaW9uO2lmKDIxPmRpbWVuc2lvbnx8MSE9KDMmZGltZW5zaW9uKSl0aHJvd1wiRXJyb3IgQml0TWF0cml4UGFyc2VyXCI7dGhpcy5iaXRNYXRyaXg9Yml0TWF0cml4LHRoaXMucGFyc2VkVmVyc2lvbj1udWxsLHRoaXMucGFyc2VkRm9ybWF0SW5mbz1udWxsLHRoaXMuY29weUJpdD1mdW5jdGlvbihpLGosdmVyc2lvbkJpdHMpe3JldHVybiB0aGlzLmJpdE1hdHJpeC5nZXRfUmVuYW1lZChpLGopP3ZlcnNpb25CaXRzPDwxfDE6dmVyc2lvbkJpdHM8PDF9LHRoaXMucmVhZEZvcm1hdEluZm9ybWF0aW9uPWZ1bmN0aW9uKCl7aWYobnVsbCE9dGhpcy5wYXJzZWRGb3JtYXRJbmZvKXJldHVybiB0aGlzLnBhcnNlZEZvcm1hdEluZm87Zm9yKHZhciBmb3JtYXRJbmZvQml0cz0wLGk9MDs2Pmk7aSsrKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdChpLDgsZm9ybWF0SW5mb0JpdHMpO2Zvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg3LDgsZm9ybWF0SW5mb0JpdHMpLGZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LDgsZm9ybWF0SW5mb0JpdHMpLGZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LDcsZm9ybWF0SW5mb0JpdHMpO2Zvcih2YXIgaj01O2o+PTA7ai0tKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LGosZm9ybWF0SW5mb0JpdHMpO2lmKHRoaXMucGFyc2VkRm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvQml0cyksbnVsbCE9dGhpcy5wYXJzZWRGb3JtYXRJbmZvKXJldHVybiB0aGlzLnBhcnNlZEZvcm1hdEluZm87dmFyIGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb247Zm9ybWF0SW5mb0JpdHM9MDtmb3IodmFyIGlNaW49ZGltZW5zaW9uLTgsaT1kaW1lbnNpb24tMTtpPj1pTWluO2ktLSlmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoaSw4LGZvcm1hdEluZm9CaXRzKTtmb3IodmFyIGo9ZGltZW5zaW9uLTc7ZGltZW5zaW9uPmo7aisrKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LGosZm9ybWF0SW5mb0JpdHMpO2lmKHRoaXMucGFyc2VkRm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvQml0cyksbnVsbCE9dGhpcy5wYXJzZWRGb3JtYXRJbmZvKXJldHVybiB0aGlzLnBhcnNlZEZvcm1hdEluZm87dGhyb3dcIkVycm9yIHJlYWRGb3JtYXRJbmZvcm1hdGlvblwifSx0aGlzLnJlYWRWZXJzaW9uPWZ1bmN0aW9uKCl7aWYobnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dmFyIGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb24scHJvdmlzaW9uYWxWZXJzaW9uPWRpbWVuc2lvbi0xNz4+MjtpZig2Pj1wcm92aXNpb25hbFZlcnNpb24pcmV0dXJuIFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcihwcm92aXNpb25hbFZlcnNpb24pO2Zvcih2YXIgdmVyc2lvbkJpdHM9MCxpak1pbj1kaW1lbnNpb24tMTEsaj01O2o+PTA7ai0tKWZvcih2YXIgaT1kaW1lbnNpb24tOTtpPj1pak1pbjtpLS0pdmVyc2lvbkJpdHM9dGhpcy5jb3B5Qml0KGksaix2ZXJzaW9uQml0cyk7aWYodGhpcy5wYXJzZWRWZXJzaW9uPVZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uKHZlcnNpb25CaXRzKSxudWxsIT10aGlzLnBhcnNlZFZlcnNpb24mJnRoaXMucGFyc2VkVmVyc2lvbi5EaW1lbnNpb25Gb3JWZXJzaW9uPT1kaW1lbnNpb24pcmV0dXJuIHRoaXMucGFyc2VkVmVyc2lvbjt2ZXJzaW9uQml0cz0wO2Zvcih2YXIgaT01O2k+PTA7aS0tKWZvcih2YXIgaj1kaW1lbnNpb24tOTtqPj1pak1pbjtqLS0pdmVyc2lvbkJpdHM9dGhpcy5jb3B5Qml0KGksaix2ZXJzaW9uQml0cyk7aWYodGhpcy5wYXJzZWRWZXJzaW9uPVZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uKHZlcnNpb25CaXRzKSxudWxsIT10aGlzLnBhcnNlZFZlcnNpb24mJnRoaXMucGFyc2VkVmVyc2lvbi5EaW1lbnNpb25Gb3JWZXJzaW9uPT1kaW1lbnNpb24pcmV0dXJuIHRoaXMucGFyc2VkVmVyc2lvbjt0aHJvd1wiRXJyb3IgcmVhZFZlcnNpb25cIn0sdGhpcy5yZWFkQ29kZXdvcmRzPWZ1bmN0aW9uKCl7dmFyIGZvcm1hdEluZm89dGhpcy5yZWFkRm9ybWF0SW5mb3JtYXRpb24oKSx2ZXJzaW9uPXRoaXMucmVhZFZlcnNpb24oKSxkYXRhTWFzaz1EYXRhTWFzay5mb3JSZWZlcmVuY2UoZm9ybWF0SW5mby5EYXRhTWFzayksZGltZW5zaW9uPXRoaXMuYml0TWF0cml4LkRpbWVuc2lvbjtkYXRhTWFzay51bm1hc2tCaXRNYXRyaXgodGhpcy5iaXRNYXRyaXgsZGltZW5zaW9uKTtmb3IodmFyIGZ1bmN0aW9uUGF0dGVybj12ZXJzaW9uLmJ1aWxkRnVuY3Rpb25QYXR0ZXJuKCkscmVhZGluZ1VwPSEwLHJlc3VsdD1uZXcgQXJyYXkodmVyc2lvbi5Ub3RhbENvZGV3b3JkcykscmVzdWx0T2Zmc2V0PTAsY3VycmVudEJ5dGU9MCxiaXRzUmVhZD0wLGo9ZGltZW5zaW9uLTE7aj4wO2otPTIpezY9PWomJmotLTtmb3IodmFyIGNvdW50PTA7ZGltZW5zaW9uPmNvdW50O2NvdW50KyspZm9yKHZhciBpPXJlYWRpbmdVcD9kaW1lbnNpb24tMS1jb3VudDpjb3VudCxjb2w9MDsyPmNvbDtjb2wrKylmdW5jdGlvblBhdHRlcm4uZ2V0X1JlbmFtZWQoai1jb2wsaSl8fChiaXRzUmVhZCsrLGN1cnJlbnRCeXRlPDw9MSx0aGlzLmJpdE1hdHJpeC5nZXRfUmVuYW1lZChqLWNvbCxpKSYmKGN1cnJlbnRCeXRlfD0xKSw4PT1iaXRzUmVhZCYmKHJlc3VsdFtyZXN1bHRPZmZzZXQrK109Y3VycmVudEJ5dGUsYml0c1JlYWQ9MCxjdXJyZW50Qnl0ZT0wKSk7cmVhZGluZ1VwXj0hMH1pZihyZXN1bHRPZmZzZXQhPXZlcnNpb24uVG90YWxDb2Rld29yZHMpdGhyb3dcIkVycm9yIHJlYWRDb2Rld29yZHNcIjtyZXR1cm4gcmVzdWx0fX1mdW5jdGlvbiBEYXRhTWFzazAwMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gMD09KGkraiYxKX19ZnVuY3Rpb24gRGF0YU1hc2swMDEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PSgxJmkpfX1mdW5jdGlvbiBEYXRhTWFzazAxMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gaiUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazAxMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4oaStqKSUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazEwMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gMD09KFVSU2hpZnQoaSwxKStqLzMmMSl9fWZ1bmN0aW9uIERhdGFNYXNrMTAxKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3ZhciB0ZW1wPWkqajtyZXR1cm4oMSZ0ZW1wKSt0ZW1wJTM9PTB9fWZ1bmN0aW9uIERhdGFNYXNrMTEwKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3ZhciB0ZW1wPWkqajtyZXR1cm4gMD09KCgxJnRlbXApK3RlbXAlMyYxKX19ZnVuY3Rpb24gRGF0YU1hc2sxMTEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PSgoaStqJjEpK2kqaiUzJjEpfX1mdW5jdGlvbiBSZWVkU29sb21vbkRlY29kZXIoZmllbGQpe3RoaXMuZmllbGQ9ZmllbGQsdGhpcy5kZWNvZGU9ZnVuY3Rpb24ocmVjZWl2ZWQsdHdvUyl7Zm9yKHZhciBwb2x5PW5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxyZWNlaXZlZCksc3luZHJvbWVDb2VmZmljaWVudHM9bmV3IEFycmF5KHR3b1MpLGk9MDtpPHN5bmRyb21lQ29lZmZpY2llbnRzLmxlbmd0aDtpKyspc3luZHJvbWVDb2VmZmljaWVudHNbaV09MDtmb3IodmFyIGRhdGFNYXRyaXg9ITEsbm9FcnJvcj0hMCxpPTA7dHdvUz5pO2krKyl7dmFyIGV2YWw9cG9seS5ldmFsdWF0ZUF0KHRoaXMuZmllbGQuZXhwKGRhdGFNYXRyaXg/aSsxOmkpKTtzeW5kcm9tZUNvZWZmaWNpZW50c1tzeW5kcm9tZUNvZWZmaWNpZW50cy5sZW5ndGgtMS1pXT1ldmFsLDAhPWV2YWwmJihub0Vycm9yPSExKX1pZighbm9FcnJvcilmb3IodmFyIHN5bmRyb21lPW5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxzeW5kcm9tZUNvZWZmaWNpZW50cyksc2lnbWFPbWVnYT10aGlzLnJ1bkV1Y2xpZGVhbkFsZ29yaXRobSh0aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwodHdvUywxKSxzeW5kcm9tZSx0d29TKSxzaWdtYT1zaWdtYU9tZWdhWzBdLG9tZWdhPXNpZ21hT21lZ2FbMV0sZXJyb3JMb2NhdGlvbnM9dGhpcy5maW5kRXJyb3JMb2NhdGlvbnMoc2lnbWEpLGVycm9yTWFnbml0dWRlcz10aGlzLmZpbmRFcnJvck1hZ25pdHVkZXMob21lZ2EsZXJyb3JMb2NhdGlvbnMsZGF0YU1hdHJpeCksaT0wO2k8ZXJyb3JMb2NhdGlvbnMubGVuZ3RoO2krKyl7dmFyIHBvc2l0aW9uPXJlY2VpdmVkLmxlbmd0aC0xLXRoaXMuZmllbGQubG9nKGVycm9yTG9jYXRpb25zW2ldKTtpZigwPnBvc2l0aW9uKXRocm93XCJSZWVkU29sb21vbkV4Y2VwdGlvbiBCYWQgZXJyb3IgbG9jYXRpb25cIjtyZWNlaXZlZFtwb3NpdGlvbl09R0YyNTYuYWRkT3JTdWJ0cmFjdChyZWNlaXZlZFtwb3NpdGlvbl0sZXJyb3JNYWduaXR1ZGVzW2ldKX19LHRoaXMucnVuRXVjbGlkZWFuQWxnb3JpdGhtPWZ1bmN0aW9uKGEsYixSKXtpZihhLkRlZ3JlZTxiLkRlZ3JlZSl7dmFyIHRlbXA9YTthPWIsYj10ZW1wfWZvcih2YXIgckxhc3Q9YSxyPWIsc0xhc3Q9dGhpcy5maWVsZC5PbmUscz10aGlzLmZpZWxkLlplcm8sdExhc3Q9dGhpcy5maWVsZC5aZXJvLHQ9dGhpcy5maWVsZC5PbmU7ci5EZWdyZWU+PU1hdGguZmxvb3IoUi8yKTspe3ZhciByTGFzdExhc3Q9ckxhc3Qsc0xhc3RMYXN0PXNMYXN0LHRMYXN0TGFzdD10TGFzdDtpZihyTGFzdD1yLHNMYXN0PXMsdExhc3Q9dCxyTGFzdC5aZXJvKXRocm93XCJyX3tpLTF9IHdhcyB6ZXJvXCI7cj1yTGFzdExhc3Q7Zm9yKHZhciBxPXRoaXMuZmllbGQuWmVybyxkZW5vbWluYXRvckxlYWRpbmdUZXJtPXJMYXN0LmdldENvZWZmaWNpZW50KHJMYXN0LkRlZ3JlZSksZGx0SW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2UoZGVub21pbmF0b3JMZWFkaW5nVGVybSk7ci5EZWdyZWU+PXJMYXN0LkRlZ3JlZSYmIXIuWmVybzspe3ZhciBkZWdyZWVEaWZmPXIuRGVncmVlLXJMYXN0LkRlZ3JlZSxzY2FsZT10aGlzLmZpZWxkLm11bHRpcGx5KHIuZ2V0Q29lZmZpY2llbnQoci5EZWdyZWUpLGRsdEludmVyc2UpO3E9cS5hZGRPclN1YnRyYWN0KHRoaXMuZmllbGQuYnVpbGRNb25vbWlhbChkZWdyZWVEaWZmLHNjYWxlKSkscj1yLmFkZE9yU3VidHJhY3Qockxhc3QubXVsdGlwbHlCeU1vbm9taWFsKGRlZ3JlZURpZmYsc2NhbGUpKX1zPXEubXVsdGlwbHkxKHNMYXN0KS5hZGRPclN1YnRyYWN0KHNMYXN0TGFzdCksdD1xLm11bHRpcGx5MSh0TGFzdCkuYWRkT3JTdWJ0cmFjdCh0TGFzdExhc3QpfXZhciBzaWdtYVRpbGRlQXRaZXJvPXQuZ2V0Q29lZmZpY2llbnQoMCk7aWYoMD09c2lnbWFUaWxkZUF0WmVybyl0aHJvd1wiUmVlZFNvbG9tb25FeGNlcHRpb24gc2lnbWFUaWxkZSgwKSB3YXMgemVyb1wiO3ZhciBpbnZlcnNlPXRoaXMuZmllbGQuaW52ZXJzZShzaWdtYVRpbGRlQXRaZXJvKSxzaWdtYT10Lm11bHRpcGx5MihpbnZlcnNlKSxvbWVnYT1yLm11bHRpcGx5MihpbnZlcnNlKTtyZXR1cm4gbmV3IEFycmF5KHNpZ21hLG9tZWdhKX0sdGhpcy5maW5kRXJyb3JMb2NhdGlvbnM9ZnVuY3Rpb24oZXJyb3JMb2NhdG9yKXt2YXIgbnVtRXJyb3JzPWVycm9yTG9jYXRvci5EZWdyZWU7aWYoMT09bnVtRXJyb3JzKXJldHVybiBuZXcgQXJyYXkoZXJyb3JMb2NhdG9yLmdldENvZWZmaWNpZW50KDEpKTtmb3IodmFyIHJlc3VsdD1uZXcgQXJyYXkobnVtRXJyb3JzKSxlPTAsaT0xOzI1Nj5pJiZudW1FcnJvcnM+ZTtpKyspMD09ZXJyb3JMb2NhdG9yLmV2YWx1YXRlQXQoaSkmJihyZXN1bHRbZV09dGhpcy5maWVsZC5pbnZlcnNlKGkpLGUrKyk7aWYoZSE9bnVtRXJyb3JzKXRocm93XCJFcnJvciBsb2NhdG9yIGRlZ3JlZSBkb2VzIG5vdCBtYXRjaCBudW1iZXIgb2Ygcm9vdHNcIjtyZXR1cm4gcmVzdWx0fSx0aGlzLmZpbmRFcnJvck1hZ25pdHVkZXM9ZnVuY3Rpb24oZXJyb3JFdmFsdWF0b3IsZXJyb3JMb2NhdGlvbnMsZGF0YU1hdHJpeCl7Zm9yKHZhciBzPWVycm9yTG9jYXRpb25zLmxlbmd0aCxyZXN1bHQ9bmV3IEFycmF5KHMpLGk9MDtzPmk7aSsrKXtmb3IodmFyIHhpSW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2UoZXJyb3JMb2NhdGlvbnNbaV0pLGRlbm9taW5hdG9yPTEsaj0wO3M+ajtqKyspaSE9aiYmKGRlbm9taW5hdG9yPXRoaXMuZmllbGQubXVsdGlwbHkoZGVub21pbmF0b3IsR0YyNTYuYWRkT3JTdWJ0cmFjdCgxLHRoaXMuZmllbGQubXVsdGlwbHkoZXJyb3JMb2NhdGlvbnNbal0seGlJbnZlcnNlKSkpKTtyZXN1bHRbaV09dGhpcy5maWVsZC5tdWx0aXBseShlcnJvckV2YWx1YXRvci5ldmFsdWF0ZUF0KHhpSW52ZXJzZSksdGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yKSksZGF0YU1hdHJpeCYmKHJlc3VsdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHJlc3VsdFtpXSx4aUludmVyc2UpKX1yZXR1cm4gcmVzdWx0fX1mdW5jdGlvbiBHRjI1NlBvbHkoZmllbGQsY29lZmZpY2llbnRzKXtpZihudWxsPT1jb2VmZmljaWVudHN8fDA9PWNvZWZmaWNpZW50cy5sZW5ndGgpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO3RoaXMuZmllbGQ9ZmllbGQ7dmFyIGNvZWZmaWNpZW50c0xlbmd0aD1jb2VmZmljaWVudHMubGVuZ3RoO2lmKGNvZWZmaWNpZW50c0xlbmd0aD4xJiYwPT1jb2VmZmljaWVudHNbMF0pe2Zvcih2YXIgZmlyc3ROb25aZXJvPTE7Y29lZmZpY2llbnRzTGVuZ3RoPmZpcnN0Tm9uWmVybyYmMD09Y29lZmZpY2llbnRzW2ZpcnN0Tm9uWmVyb107KWZpcnN0Tm9uWmVybysrO2lmKGZpcnN0Tm9uWmVybz09Y29lZmZpY2llbnRzTGVuZ3RoKXRoaXMuY29lZmZpY2llbnRzPWZpZWxkLlplcm8uY29lZmZpY2llbnRzO2Vsc2V7dGhpcy5jb2VmZmljaWVudHM9bmV3IEFycmF5KGNvZWZmaWNpZW50c0xlbmd0aC1maXJzdE5vblplcm8pO2Zvcih2YXIgaT0wO2k8dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoO2krKyl0aGlzLmNvZWZmaWNpZW50c1tpXT0wO2Zvcih2YXIgY2k9MDtjaTx0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGg7Y2krKyl0aGlzLmNvZWZmaWNpZW50c1tjaV09Y29lZmZpY2llbnRzW2ZpcnN0Tm9uWmVybytjaV19fWVsc2UgdGhpcy5jb2VmZmljaWVudHM9Y29lZmZpY2llbnRzO3RoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlplcm9cIixmdW5jdGlvbigpe3JldHVybiAwPT10aGlzLmNvZWZmaWNpZW50c1swXX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRlZ3JlZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzLmxlbmd0aC0xfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ29lZmZpY2llbnRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2VmZmljaWVudHN9KSx0aGlzLmdldENvZWZmaWNpZW50PWZ1bmN0aW9uKGRlZ3JlZSl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzW3RoaXMuY29lZmZpY2llbnRzLmxlbmd0aC0xLWRlZ3JlZV19LHRoaXMuZXZhbHVhdGVBdD1mdW5jdGlvbihhKXtpZigwPT1hKXJldHVybiB0aGlzLmdldENvZWZmaWNpZW50KDApO3ZhciBzaXplPXRoaXMuY29lZmZpY2llbnRzLmxlbmd0aDtpZigxPT1hKXtmb3IodmFyIHJlc3VsdD0wLGk9MDtzaXplPmk7aSsrKXJlc3VsdD1HRjI1Ni5hZGRPclN1YnRyYWN0KHJlc3VsdCx0aGlzLmNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIHJlc3VsdH1mb3IodmFyIHJlc3VsdDI9dGhpcy5jb2VmZmljaWVudHNbMF0saT0xO3NpemU+aTtpKyspcmVzdWx0Mj1HRjI1Ni5hZGRPclN1YnRyYWN0KHRoaXMuZmllbGQubXVsdGlwbHkoYSxyZXN1bHQyKSx0aGlzLmNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIHJlc3VsdDJ9LHRoaXMuYWRkT3JTdWJ0cmFjdD1mdW5jdGlvbihvdGhlcil7aWYodGhpcy5maWVsZCE9b3RoZXIuZmllbGQpdGhyb3dcIkdGMjU2UG9seXMgZG8gbm90IGhhdmUgc2FtZSBHRjI1NiBmaWVsZFwiO2lmKHRoaXMuWmVybylyZXR1cm4gb3RoZXI7aWYob3RoZXIuWmVybylyZXR1cm4gdGhpczt2YXIgc21hbGxlckNvZWZmaWNpZW50cz10aGlzLmNvZWZmaWNpZW50cyxsYXJnZXJDb2VmZmljaWVudHM9b3RoZXIuY29lZmZpY2llbnRzO2lmKHNtYWxsZXJDb2VmZmljaWVudHMubGVuZ3RoPmxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGgpe3ZhciB0ZW1wPXNtYWxsZXJDb2VmZmljaWVudHM7c21hbGxlckNvZWZmaWNpZW50cz1sYXJnZXJDb2VmZmljaWVudHMsbGFyZ2VyQ29lZmZpY2llbnRzPXRlbXB9Zm9yKHZhciBzdW1EaWZmPW5ldyBBcnJheShsYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoKSxsZW5ndGhEaWZmPWxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGgtc21hbGxlckNvZWZmaWNpZW50cy5sZW5ndGgsY2k9MDtsZW5ndGhEaWZmPmNpO2NpKyspc3VtRGlmZltjaV09bGFyZ2VyQ29lZmZpY2llbnRzW2NpXTtmb3IodmFyIGk9bGVuZ3RoRGlmZjtpPGxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKXN1bURpZmZbaV09R0YyNTYuYWRkT3JTdWJ0cmFjdChzbWFsbGVyQ29lZmZpY2llbnRzW2ktbGVuZ3RoRGlmZl0sbGFyZ2VyQ29lZmZpY2llbnRzW2ldKTtyZXR1cm4gbmV3IEdGMjU2UG9seShmaWVsZCxzdW1EaWZmKX0sdGhpcy5tdWx0aXBseTE9ZnVuY3Rpb24ob3RoZXIpe2lmKHRoaXMuZmllbGQhPW90aGVyLmZpZWxkKXRocm93XCJHRjI1NlBvbHlzIGRvIG5vdCBoYXZlIHNhbWUgR0YyNTYgZmllbGRcIjtpZih0aGlzLlplcm98fG90aGVyLlplcm8pcmV0dXJuIHRoaXMuZmllbGQuWmVybztmb3IodmFyIGFDb2VmZmljaWVudHM9dGhpcy5jb2VmZmljaWVudHMsYUxlbmd0aD1hQ29lZmZpY2llbnRzLmxlbmd0aCxiQ29lZmZpY2llbnRzPW90aGVyLmNvZWZmaWNpZW50cyxiTGVuZ3RoPWJDb2VmZmljaWVudHMubGVuZ3RoLHByb2R1Y3Q9bmV3IEFycmF5KGFMZW5ndGgrYkxlbmd0aC0xKSxpPTA7YUxlbmd0aD5pO2krKylmb3IodmFyIGFDb2VmZj1hQ29lZmZpY2llbnRzW2ldLGo9MDtiTGVuZ3RoPmo7aisrKXByb2R1Y3RbaStqXT1HRjI1Ni5hZGRPclN1YnRyYWN0KHByb2R1Y3RbaStqXSx0aGlzLmZpZWxkLm11bHRpcGx5KGFDb2VmZixiQ29lZmZpY2llbnRzW2pdKSk7cmV0dXJuIG5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxwcm9kdWN0KX0sdGhpcy5tdWx0aXBseTI9ZnVuY3Rpb24oc2NhbGFyKXtpZigwPT1zY2FsYXIpcmV0dXJuIHRoaXMuZmllbGQuWmVybztpZigxPT1zY2FsYXIpcmV0dXJuIHRoaXM7Zm9yKHZhciBzaXplPXRoaXMuY29lZmZpY2llbnRzLmxlbmd0aCxwcm9kdWN0PW5ldyBBcnJheShzaXplKSxpPTA7c2l6ZT5pO2krKylwcm9kdWN0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkodGhpcy5jb2VmZmljaWVudHNbaV0sc2NhbGFyKTtyZXR1cm4gbmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHByb2R1Y3QpfSx0aGlzLm11bHRpcGx5QnlNb25vbWlhbD1mdW5jdGlvbihkZWdyZWUsY29lZmZpY2llbnQpe2lmKDA+ZGVncmVlKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtpZigwPT1jb2VmZmljaWVudClyZXR1cm4gdGhpcy5maWVsZC5aZXJvO2Zvcih2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgscHJvZHVjdD1uZXcgQXJyYXkoc2l6ZStkZWdyZWUpLGk9MDtpPHByb2R1Y3QubGVuZ3RoO2krKylwcm9kdWN0W2ldPTA7Zm9yKHZhciBpPTA7c2l6ZT5pO2krKylwcm9kdWN0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkodGhpcy5jb2VmZmljaWVudHNbaV0sY29lZmZpY2llbnQpO3JldHVybiBuZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscHJvZHVjdCl9LHRoaXMuZGl2aWRlPWZ1bmN0aW9uKG90aGVyKXtpZih0aGlzLmZpZWxkIT1vdGhlci5maWVsZCl0aHJvd1wiR0YyNTZQb2x5cyBkbyBub3QgaGF2ZSBzYW1lIEdGMjU2IGZpZWxkXCI7aWYob3RoZXIuWmVybyl0aHJvd1wiRGl2aWRlIGJ5IDBcIjtmb3IodmFyIHF1b3RpZW50PXRoaXMuZmllbGQuWmVybyxyZW1haW5kZXI9dGhpcyxkZW5vbWluYXRvckxlYWRpbmdUZXJtPW90aGVyLmdldENvZWZmaWNpZW50KG90aGVyLkRlZ3JlZSksaW52ZXJzZURlbm9taW5hdG9yTGVhZGluZ1Rlcm09dGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yTGVhZGluZ1Rlcm0pO3JlbWFpbmRlci5EZWdyZWU+PW90aGVyLkRlZ3JlZSYmIXJlbWFpbmRlci5aZXJvOyl7XG4gICAgdmFyIGRlZ3JlZURpZmZlcmVuY2U9cmVtYWluZGVyLkRlZ3JlZS1vdGhlci5EZWdyZWUsc2NhbGU9dGhpcy5maWVsZC5tdWx0aXBseShyZW1haW5kZXIuZ2V0Q29lZmZpY2llbnQocmVtYWluZGVyLkRlZ3JlZSksaW52ZXJzZURlbm9taW5hdG9yTGVhZGluZ1Rlcm0pLHRlcm09b3RoZXIubXVsdGlwbHlCeU1vbm9taWFsKGRlZ3JlZURpZmZlcmVuY2Usc2NhbGUpLGl0ZXJhdGlvblF1b3RpZW50PXRoaXMuZmllbGQuYnVpbGRNb25vbWlhbChkZWdyZWVEaWZmZXJlbmNlLHNjYWxlKTtxdW90aWVudD1xdW90aWVudC5hZGRPclN1YnRyYWN0KGl0ZXJhdGlvblF1b3RpZW50KSxyZW1haW5kZXI9cmVtYWluZGVyLmFkZE9yU3VidHJhY3QodGVybSl9cmV0dXJuIG5ldyBBcnJheShxdW90aWVudCxyZW1haW5kZXIpfX1mdW5jdGlvbiBHRjI1NihwcmltaXRpdmUpe3RoaXMuZXhwVGFibGU9bmV3IEFycmF5KDI1NiksdGhpcy5sb2dUYWJsZT1uZXcgQXJyYXkoMjU2KTtmb3IodmFyIHg9MSxpPTA7MjU2Pmk7aSsrKXRoaXMuZXhwVGFibGVbaV09eCx4PDw9MSx4Pj0yNTYmJih4Xj1wcmltaXRpdmUpO2Zvcih2YXIgaT0wOzI1NT5pO2krKyl0aGlzLmxvZ1RhYmxlW3RoaXMuZXhwVGFibGVbaV1dPWk7dmFyIGF0MD1uZXcgQXJyYXkoMSk7YXQwWzBdPTAsdGhpcy56ZXJvPW5ldyBHRjI1NlBvbHkodGhpcyxuZXcgQXJyYXkoYXQwKSk7dmFyIGF0MT1uZXcgQXJyYXkoMSk7YXQxWzBdPTEsdGhpcy5vbmU9bmV3IEdGMjU2UG9seSh0aGlzLG5ldyBBcnJheShhdDEpKSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJaZXJvXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy56ZXJvfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiT25lXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vbmV9KSx0aGlzLmJ1aWxkTW9ub21pYWw9ZnVuY3Rpb24oZGVncmVlLGNvZWZmaWNpZW50KXtpZigwPmRlZ3JlZSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7aWYoMD09Y29lZmZpY2llbnQpcmV0dXJuIHplcm87Zm9yKHZhciBjb2VmZmljaWVudHM9bmV3IEFycmF5KGRlZ3JlZSsxKSxpPTA7aTxjb2VmZmljaWVudHMubGVuZ3RoO2krKyljb2VmZmljaWVudHNbaV09MDtyZXR1cm4gY29lZmZpY2llbnRzWzBdPWNvZWZmaWNpZW50LG5ldyBHRjI1NlBvbHkodGhpcyxjb2VmZmljaWVudHMpfSx0aGlzLmV4cD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5leHBUYWJsZVthXX0sdGhpcy5sb2c9ZnVuY3Rpb24oYSl7aWYoMD09YSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIHRoaXMubG9nVGFibGVbYV19LHRoaXMuaW52ZXJzZT1mdW5jdGlvbihhKXtpZigwPT1hKXRocm93XCJTeXN0ZW0uQXJpdGhtZXRpY0V4Y2VwdGlvblwiO3JldHVybiB0aGlzLmV4cFRhYmxlWzI1NS10aGlzLmxvZ1RhYmxlW2FdXX0sdGhpcy5tdWx0aXBseT1mdW5jdGlvbihhLGIpe3JldHVybiAwPT1hfHwwPT1iPzA6MT09YT9iOjE9PWI/YTp0aGlzLmV4cFRhYmxlWyh0aGlzLmxvZ1RhYmxlW2FdK3RoaXMubG9nVGFibGVbYl0pJTI1NV19fWZ1bmN0aW9uIFVSU2hpZnQobnVtYmVyLGJpdHMpe3JldHVybiBudW1iZXI+PTA/bnVtYmVyPj5iaXRzOihudW1iZXI+PmJpdHMpKygyPDx+Yml0cyl9ZnVuY3Rpb24gRmluZGVyUGF0dGVybihwb3NYLHBvc1ksZXN0aW1hdGVkTW9kdWxlU2l6ZSl7dGhpcy54PXBvc1gsdGhpcy55PXBvc1ksdGhpcy5jb3VudD0xLHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZT1lc3RpbWF0ZWRNb2R1bGVTaXplLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVzdGltYXRlZE1vZHVsZVNpemVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVzdGltYXRlZE1vZHVsZVNpemV9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY291bnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJYXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueX0pLHRoaXMuaW5jcmVtZW50Q291bnQ9ZnVuY3Rpb24oKXt0aGlzLmNvdW50Kyt9LHRoaXMuYWJvdXRFcXVhbHM9ZnVuY3Rpb24obW9kdWxlU2l6ZSxpLGope2lmKE1hdGguYWJzKGktdGhpcy55KTw9bW9kdWxlU2l6ZSYmTWF0aC5hYnMoai10aGlzLngpPD1tb2R1bGVTaXplKXt2YXIgbW9kdWxlU2l6ZURpZmY9TWF0aC5hYnMobW9kdWxlU2l6ZS10aGlzLmVzdGltYXRlZE1vZHVsZVNpemUpO3JldHVybiAxPj1tb2R1bGVTaXplRGlmZnx8bW9kdWxlU2l6ZURpZmYvdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPD0xfXJldHVybiExfX1mdW5jdGlvbiBGaW5kZXJQYXR0ZXJuSW5mbyhwYXR0ZXJuQ2VudGVycyl7dGhpcy5ib3R0b21MZWZ0PXBhdHRlcm5DZW50ZXJzWzBdLHRoaXMudG9wTGVmdD1wYXR0ZXJuQ2VudGVyc1sxXSx0aGlzLnRvcFJpZ2h0PXBhdHRlcm5DZW50ZXJzWzJdLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkJvdHRvbUxlZnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmJvdHRvbUxlZnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3BMZWZ0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50b3BMZWZ0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG9wUmlnaHRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvcFJpZ2h0fSl9ZnVuY3Rpb24gRmluZGVyUGF0dGVybkZpbmRlcigpe3RoaXMuaW1hZ2U9bnVsbCx0aGlzLnBvc3NpYmxlQ2VudGVycz1bXSx0aGlzLmhhc1NraXBwZWQ9ITEsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDAsMCwwKSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9bnVsbCx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDcm9zc0NoZWNrU3RhdGVDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbMF09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzFdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFsyXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbM109MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzRdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudH0pLHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3M9ZnVuY3Rpb24oc3RhdGVDb3VudCl7Zm9yKHZhciB0b3RhbE1vZHVsZVNpemU9MCxpPTA7NT5pO2krKyl7dmFyIGNvdW50PXN0YXRlQ291bnRbaV07aWYoMD09Y291bnQpcmV0dXJuITE7dG90YWxNb2R1bGVTaXplKz1jb3VudH1pZig3PnRvdGFsTW9kdWxlU2l6ZSlyZXR1cm4hMTt2YXIgbW9kdWxlU2l6ZT1NYXRoLmZsb29yKCh0b3RhbE1vZHVsZVNpemU8PElOVEVHRVJfTUFUSF9TSElGVCkvNyksbWF4VmFyaWFuY2U9TWF0aC5mbG9vcihtb2R1bGVTaXplLzIpO3JldHVybiBNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzBdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFsxXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKDMqbW9kdWxlU2l6ZS0oc3RhdGVDb3VudFsyXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8MyptYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFszXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbNF08PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlfSx0aGlzLmNlbnRlckZyb21FbmQ9ZnVuY3Rpb24oc3RhdGVDb3VudCxlbmQpe3JldHVybiBlbmQtc3RhdGVDb3VudFs0XS1zdGF0ZUNvdW50WzNdLXN0YXRlQ291bnRbMl0vMn0sdGhpcy5jcm9zc0NoZWNrVmVydGljYWw9ZnVuY3Rpb24oc3RhcnRJLGNlbnRlckosbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe2Zvcih2YXIgaW1hZ2U9dGhpcy5pbWFnZSxtYXhJPXFyY29kZS5oZWlnaHQsc3RhdGVDb3VudD10aGlzLkNyb3NzQ2hlY2tTdGF0ZUNvdW50LGk9c3RhcnRJO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssaS0tO2lmKDA+aSlyZXR1cm4gTmFOO2Zvcig7aT49MCYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGktLTtpZigwPml8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGktLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGk9c3RhcnRJKzE7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGkrKztpZihpPT1tYXhJKXJldHVybiBOYU47Zm9yKDttYXhJPmkmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFszXTxtYXhDb3VudDspc3RhdGVDb3VudFszXSsrLGkrKztpZihpPT1tYXhJfHxzdGF0ZUNvdW50WzNdPj1tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFs0XTxtYXhDb3VudDspc3RhdGVDb3VudFs0XSsrLGkrKztpZihzdGF0ZUNvdW50WzRdPj1tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PTIqb3JpZ2luYWxTdGF0ZUNvdW50VG90YWw/TmFOOnRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCk/dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaSk6TmFOfSx0aGlzLmNyb3NzQ2hlY2tIb3Jpem9udGFsPWZ1bmN0aW9uKHN0YXJ0SixjZW50ZXJJLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXtmb3IodmFyIGltYWdlPXRoaXMuaW1hZ2UsbWF4Sj1xcmNvZGUud2lkdGgsc3RhdGVDb3VudD10aGlzLkNyb3NzQ2hlY2tTdGF0ZUNvdW50LGo9c3RhcnRKO2o+PTAmJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssai0tO2lmKDA+ailyZXR1cm4gTmFOO2Zvcig7aj49MCYmIWltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGotLTtpZigwPmp8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2o+PTAmJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGotLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGo9c3RhcnRKKzE7bWF4Sj5qJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGorKztpZihqPT1tYXhKKXJldHVybiBOYU47Zm9yKDttYXhKPmomJiFpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFszXTxtYXhDb3VudDspc3RhdGVDb3VudFszXSsrLGorKztpZihqPT1tYXhKfHxzdGF0ZUNvdW50WzNdPj1tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4Sj5qJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFs0XTxtYXhDb3VudDspc3RhdGVDb3VudFs0XSsrLGorKztpZihzdGF0ZUNvdW50WzRdPj1tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsP05hTjp0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpP3RoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGopOk5hTn0sdGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcj1mdW5jdGlvbihzdGF0ZUNvdW50LGksail7dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXStzdGF0ZUNvdW50WzNdK3N0YXRlQ291bnRbNF0sY2VudGVySj10aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKSxjZW50ZXJJPXRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsKGksTWF0aC5mbG9vcihjZW50ZXJKKSxzdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRUb3RhbCk7aWYoIWlzTmFOKGNlbnRlckkpJiYoY2VudGVySj10aGlzLmNyb3NzQ2hlY2tIb3Jpem9udGFsKE1hdGguZmxvb3IoY2VudGVySiksTWF0aC5mbG9vcihjZW50ZXJJKSxzdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRUb3RhbCksIWlzTmFOKGNlbnRlckopKSl7Zm9yKHZhciBlc3RpbWF0ZWRNb2R1bGVTaXplPXN0YXRlQ291bnRUb3RhbC83LGZvdW5kPSExLG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgsaW5kZXg9MDttYXg+aW5kZXg7aW5kZXgrKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpbmRleF07aWYoY2VudGVyLmFib3V0RXF1YWxzKGVzdGltYXRlZE1vZHVsZVNpemUsY2VudGVySSxjZW50ZXJKKSl7Y2VudGVyLmluY3JlbWVudENvdW50KCksZm91bmQ9ITA7YnJlYWt9fWlmKCFmb3VuZCl7dmFyIHBvaW50PW5ldyBGaW5kZXJQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKTt0aGlzLnBvc3NpYmxlQ2VudGVycy5wdXNoKHBvaW50KSxudWxsIT10aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2smJnRoaXMucmVzdWx0UG9pbnRDYWxsYmFjay5mb3VuZFBvc3NpYmxlUmVzdWx0UG9pbnQocG9pbnQpfXJldHVybiEwfXJldHVybiExfSx0aGlzLnNlbGVjdEJlc3RQYXR0ZXJucz1mdW5jdGlvbigpe3ZhciBzdGFydFNpemU9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoO2lmKDM+c3RhcnRTaXplKXRocm93XCJDb3VsZG4ndCBmaW5kIGVub3VnaCBmaW5kZXIgcGF0dGVybnNcIjtpZihzdGFydFNpemU+Myl7Zm9yKHZhciB0b3RhbE1vZHVsZVNpemU9MCxpPTA7c3RhcnRTaXplPmk7aSsrKXRvdGFsTW9kdWxlU2l6ZSs9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV0uRXN0aW1hdGVkTW9kdWxlU2l6ZTtmb3IodmFyIGF2ZXJhZ2U9dG90YWxNb2R1bGVTaXplL3N0YXJ0U2l6ZSxpPTA7aTx0aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgmJnRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aD4zO2krKyl7dmFyIHBhdHRlcm49dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV07TWF0aC5hYnMocGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplLWF2ZXJhZ2UpPi4yKmF2ZXJhZ2UmJih0aGlzLnBvc3NpYmxlQ2VudGVycy5yZW1vdmUoaSksaS0tKX19cmV0dXJuIHRoaXMucG9zc2libGVDZW50ZXJzLkNvdW50PjMsbmV3IEFycmF5KHRoaXMucG9zc2libGVDZW50ZXJzWzBdLHRoaXMucG9zc2libGVDZW50ZXJzWzFdLHRoaXMucG9zc2libGVDZW50ZXJzWzJdKX0sdGhpcy5maW5kUm93U2tpcD1mdW5jdGlvbigpe3ZhciBtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoO2lmKDE+PW1heClyZXR1cm4gMDtmb3IodmFyIGZpcnN0Q29uZmlybWVkQ2VudGVyPW51bGwsaT0wO21heD5pO2krKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXTtpZihjZW50ZXIuQ291bnQ+PUNFTlRFUl9RVU9SVU0pe2lmKG51bGwhPWZpcnN0Q29uZmlybWVkQ2VudGVyKXJldHVybiB0aGlzLmhhc1NraXBwZWQ9ITAsTWF0aC5mbG9vcigoTWF0aC5hYnMoZmlyc3RDb25maXJtZWRDZW50ZXIuWC1jZW50ZXIuWCktTWF0aC5hYnMoZmlyc3RDb25maXJtZWRDZW50ZXIuWS1jZW50ZXIuWSkpLzIpO2ZpcnN0Q29uZmlybWVkQ2VudGVyPWNlbnRlcn19cmV0dXJuIDB9LHRoaXMuaGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycz1mdW5jdGlvbigpe2Zvcih2YXIgY29uZmlybWVkQ291bnQ9MCx0b3RhbE1vZHVsZVNpemU9MCxtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoLGk9MDttYXg+aTtpKyspe3ZhciBwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldO3BhdHRlcm4uQ291bnQ+PUNFTlRFUl9RVU9SVU0mJihjb25maXJtZWRDb3VudCsrLHRvdGFsTW9kdWxlU2l6ZSs9cGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplKX1pZigzPmNvbmZpcm1lZENvdW50KXJldHVybiExO2Zvcih2YXIgYXZlcmFnZT10b3RhbE1vZHVsZVNpemUvbWF4LHRvdGFsRGV2aWF0aW9uPTAsaT0wO21heD5pO2krKylwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldLHRvdGFsRGV2aWF0aW9uKz1NYXRoLmFicyhwYXR0ZXJuLkVzdGltYXRlZE1vZHVsZVNpemUtYXZlcmFnZSk7cmV0dXJuLjA1KnRvdGFsTW9kdWxlU2l6ZT49dG90YWxEZXZpYXRpb259LHRoaXMuZmluZEZpbmRlclBhdHRlcm49ZnVuY3Rpb24oaW1hZ2Upe3ZhciB0cnlIYXJkZXI9ITE7dGhpcy5pbWFnZT1pbWFnZTt2YXIgbWF4ST1xcmNvZGUuaGVpZ2h0LG1heEo9cXJjb2RlLndpZHRoLGlTa2lwPU1hdGguZmxvb3IoMyptYXhJLyg0Kk1BWF9NT0RVTEVTKSk7KE1JTl9TS0lQPmlTa2lwfHx0cnlIYXJkZXIpJiYoaVNraXA9TUlOX1NLSVApO2Zvcih2YXIgZG9uZT0hMSxzdGF0ZUNvdW50PW5ldyBBcnJheSg1KSxpPWlTa2lwLTE7bWF4ST5pJiYhZG9uZTtpKz1pU2tpcCl7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTAsc3RhdGVDb3VudFszXT0wLHN0YXRlQ291bnRbNF09MDtmb3IodmFyIGN1cnJlbnRTdGF0ZT0wLGo9MDttYXhKPmo7aisrKWlmKGltYWdlW2oraSpxcmNvZGUud2lkdGhdKTE9PSgxJmN1cnJlbnRTdGF0ZSkmJmN1cnJlbnRTdGF0ZSsrLHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2Vsc2UgaWYoMD09KDEmY3VycmVudFN0YXRlKSlpZig0PT1jdXJyZW50U3RhdGUpaWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxqKTtpZihjb25maXJtZWQpaWYoaVNraXA9Mix0aGlzLmhhc1NraXBwZWQpZG9uZT10aGlzLmhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnMoKTtlbHNle3ZhciByb3dTa2lwPXRoaXMuZmluZFJvd1NraXAoKTtyb3dTa2lwPnN0YXRlQ291bnRbMl0mJihpKz1yb3dTa2lwLXN0YXRlQ291bnRbMl0taVNraXAsaj1tYXhKLTEpfWVsc2V7ZG8gaisrO3doaWxlKG1heEo+aiYmIWltYWdlW2oraSpxcmNvZGUud2lkdGhdKTtqLS19Y3VycmVudFN0YXRlPTAsc3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTAsc3RhdGVDb3VudFszXT0wLHN0YXRlQ291bnRbNF09MH1lbHNlIHN0YXRlQ291bnRbMF09c3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50WzFdPXN0YXRlQ291bnRbM10sc3RhdGVDb3VudFsyXT1zdGF0ZUNvdW50WzRdLHN0YXRlQ291bnRbM109MSxzdGF0ZUNvdW50WzRdPTAsY3VycmVudFN0YXRlPTM7ZWxzZSBzdGF0ZUNvdW50WysrY3VycmVudFN0YXRlXSsrO2Vsc2Ugc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxtYXhKKTtjb25maXJtZWQmJihpU2tpcD1zdGF0ZUNvdW50WzBdLHRoaXMuaGFzU2tpcHBlZCYmKGRvbmU9aGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycygpKSl9fXZhciBwYXR0ZXJuSW5mbz10aGlzLnNlbGVjdEJlc3RQYXR0ZXJucygpO3JldHVybiBxcmNvZGUub3JkZXJCZXN0UGF0dGVybnMocGF0dGVybkluZm8pLG5ldyBGaW5kZXJQYXR0ZXJuSW5mbyhwYXR0ZXJuSW5mbyl9fWZ1bmN0aW9uIEFsaWdubWVudFBhdHRlcm4ocG9zWCxwb3NZLGVzdGltYXRlZE1vZHVsZVNpemUpe3RoaXMueD1wb3NYLHRoaXMueT1wb3NZLHRoaXMuY291bnQ9MSx0aGlzLmVzdGltYXRlZE1vZHVsZVNpemU9ZXN0aW1hdGVkTW9kdWxlU2l6ZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFc3RpbWF0ZWRNb2R1bGVTaXplXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWFwiLGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguZmxvb3IodGhpcy54KX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIllcIixmdW5jdGlvbigpe3JldHVybiBNYXRoLmZsb29yKHRoaXMueSl9KSx0aGlzLmluY3JlbWVudENvdW50PWZ1bmN0aW9uKCl7dGhpcy5jb3VudCsrfSx0aGlzLmFib3V0RXF1YWxzPWZ1bmN0aW9uKG1vZHVsZVNpemUsaSxqKXtpZihNYXRoLmFicyhpLXRoaXMueSk8PW1vZHVsZVNpemUmJk1hdGguYWJzKGotdGhpcy54KTw9bW9kdWxlU2l6ZSl7dmFyIG1vZHVsZVNpemVEaWZmPU1hdGguYWJzKG1vZHVsZVNpemUtdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplKTtyZXR1cm4gMT49bW9kdWxlU2l6ZURpZmZ8fG1vZHVsZVNpemVEaWZmL3RoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZTw9MX1yZXR1cm4hMX19ZnVuY3Rpb24gQWxpZ25tZW50UGF0dGVybkZpbmRlcihpbWFnZSxzdGFydFgsc3RhcnRZLHdpZHRoLGhlaWdodCxtb2R1bGVTaXplLHJlc3VsdFBvaW50Q2FsbGJhY2spe3RoaXMuaW1hZ2U9aW1hZ2UsdGhpcy5wb3NzaWJsZUNlbnRlcnM9bmV3IEFycmF5LHRoaXMuc3RhcnRYPXN0YXJ0WCx0aGlzLnN0YXJ0WT1zdGFydFksdGhpcy53aWR0aD13aWR0aCx0aGlzLmhlaWdodD1oZWlnaHQsdGhpcy5tb2R1bGVTaXplPW1vZHVsZVNpemUsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDApLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjaz1yZXN1bHRQb2ludENhbGxiYWNrLHRoaXMuY2VudGVyRnJvbUVuZD1mdW5jdGlvbihzdGF0ZUNvdW50LGVuZCl7cmV0dXJuIGVuZC1zdGF0ZUNvdW50WzJdLXN0YXRlQ291bnRbMV0vMn0sdGhpcy5mb3VuZFBhdHRlcm5Dcm9zcz1mdW5jdGlvbihzdGF0ZUNvdW50KXtmb3IodmFyIG1vZHVsZVNpemU9dGhpcy5tb2R1bGVTaXplLG1heFZhcmlhbmNlPW1vZHVsZVNpemUvMixpPTA7Mz5pO2krKylpZihNYXRoLmFicyhtb2R1bGVTaXplLXN0YXRlQ291bnRbaV0pPj1tYXhWYXJpYW5jZSlyZXR1cm4hMTtyZXR1cm4hMH0sdGhpcy5jcm9zc0NoZWNrVmVydGljYWw9ZnVuY3Rpb24oc3RhcnRJLGNlbnRlckosbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe3ZhciBpbWFnZT10aGlzLmltYWdlLG1heEk9cXJjb2RlLmhlaWdodCxzdGF0ZUNvdW50PXRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTA7Zm9yKHZhciBpPXN0YXJ0STtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpLS07aWYoMD5pfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtpPj0wJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMF08PW1heENvdW50OylzdGF0ZUNvdW50WzBdKyssaS0tO2lmKHN0YXRlQ291bnRbMF0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoaT1zdGFydEkrMTttYXhJPmkmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGkrKztpZihpPT1tYXhJfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDttYXhJPmkmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsyXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMl0rKyxpKys7aWYoc3RhdGVDb3VudFsyXT5tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl07cmV0dXJuIDUqTWF0aC5hYnMoc3RhdGVDb3VudFRvdGFsLW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKT49MipvcmlnaW5hbFN0YXRlQ291bnRUb3RhbD9OYU46dGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KT90aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxpKTpOYU59LHRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXI9ZnVuY3Rpb24oc3RhdGVDb3VudCxpLGope3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0sY2VudGVySj10aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKSxjZW50ZXJJPXRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsKGksTWF0aC5mbG9vcihjZW50ZXJKKSwyKnN0YXRlQ291bnRbMV0sc3RhdGVDb3VudFRvdGFsKTtpZighaXNOYU4oY2VudGVySSkpe2Zvcih2YXIgZXN0aW1hdGVkTW9kdWxlU2l6ZT0oc3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0pLzMsbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCxpbmRleD0wO21heD5pbmRleDtpbmRleCsrKXt2YXIgY2VudGVyPXRoaXMucG9zc2libGVDZW50ZXJzW2luZGV4XTtpZihjZW50ZXIuYWJvdXRFcXVhbHMoZXN0aW1hdGVkTW9kdWxlU2l6ZSxjZW50ZXJJLGNlbnRlckopKXJldHVybiBuZXcgQWxpZ25tZW50UGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSl9dmFyIHBvaW50PW5ldyBBbGlnbm1lbnRQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKTt0aGlzLnBvc3NpYmxlQ2VudGVycy5wdXNoKHBvaW50KSxudWxsIT10aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2smJnRoaXMucmVzdWx0UG9pbnRDYWxsYmFjay5mb3VuZFBvc3NpYmxlUmVzdWx0UG9pbnQocG9pbnQpfXJldHVybiBudWxsfSx0aGlzLmZpbmQ9ZnVuY3Rpb24oKXtmb3IodmFyIHN0YXJ0WD10aGlzLnN0YXJ0WCxoZWlnaHQ9dGhpcy5oZWlnaHQsbWF4Sj1zdGFydFgrd2lkdGgsbWlkZGxlST1zdGFydFkrKGhlaWdodD4+MSksc3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDApLGlHZW49MDtoZWlnaHQ+aUdlbjtpR2VuKyspe3ZhciBpPW1pZGRsZUkrKDA9PSgxJmlHZW4pP2lHZW4rMT4+MTotKGlHZW4rMT4+MSkpO3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wO2Zvcih2YXIgaj1zdGFydFg7bWF4Sj5qJiYhaW1hZ2VbaitxcmNvZGUud2lkdGgqaV07KWorKztmb3IodmFyIGN1cnJlbnRTdGF0ZT0wO21heEo+ajspe2lmKGltYWdlW2oraSpxcmNvZGUud2lkdGhdKWlmKDE9PWN1cnJlbnRTdGF0ZSlzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztlbHNlIGlmKDI9PWN1cnJlbnRTdGF0ZSl7aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxqKTtpZihudWxsIT1jb25maXJtZWQpcmV0dXJuIGNvbmZpcm1lZH1zdGF0ZUNvdW50WzBdPXN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFsxXT0xLHN0YXRlQ291bnRbMl09MCxjdXJyZW50U3RhdGU9MX1lbHNlIHN0YXRlQ291bnRbKytjdXJyZW50U3RhdGVdKys7ZWxzZSAxPT1jdXJyZW50U3RhdGUmJmN1cnJlbnRTdGF0ZSsrLHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2orK31pZih0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpKXt2YXIgY29uZmlybWVkPXRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXIoc3RhdGVDb3VudCxpLG1heEopO2lmKG51bGwhPWNvbmZpcm1lZClyZXR1cm4gY29uZmlybWVkfX1pZigwIT10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgpcmV0dXJuIHRoaXMucG9zc2libGVDZW50ZXJzWzBdO3Rocm93XCJDb3VsZG4ndCBmaW5kIGVub3VnaCBhbGlnbm1lbnQgcGF0dGVybnNcIn19ZnVuY3Rpb24gUVJDb2RlRGF0YUJsb2NrUmVhZGVyKGJsb2Nrcyx2ZXJzaW9uLG51bUVycm9yQ29ycmVjdGlvbkNvZGUpe3RoaXMuYmxvY2tQb2ludGVyPTAsdGhpcy5iaXRQb2ludGVyPTcsdGhpcy5kYXRhTGVuZ3RoPTAsdGhpcy5ibG9ja3M9YmxvY2tzLHRoaXMubnVtRXJyb3JDb3JyZWN0aW9uQ29kZT1udW1FcnJvckNvcnJlY3Rpb25Db2RlLDk+PXZlcnNpb24/dGhpcy5kYXRhTGVuZ3RoTW9kZT0wOnZlcnNpb24+PTEwJiYyNj49dmVyc2lvbj90aGlzLmRhdGFMZW5ndGhNb2RlPTE6dmVyc2lvbj49MjcmJjQwPj12ZXJzaW9uJiYodGhpcy5kYXRhTGVuZ3RoTW9kZT0yKSx0aGlzLmdldE5leHRCaXRzPWZ1bmN0aW9uKG51bUJpdHMpe3ZhciBiaXRzPTA7aWYobnVtQml0czx0aGlzLmJpdFBvaW50ZXIrMSl7Zm9yKHZhciBtYXNrPTAsaT0wO251bUJpdHM+aTtpKyspbWFzays9MTw8aTtyZXR1cm4gbWFzazw8PXRoaXMuYml0UG9pbnRlci1udW1CaXRzKzEsYml0cz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2spPj50aGlzLmJpdFBvaW50ZXItbnVtQml0cysxLHRoaXMuYml0UG9pbnRlci09bnVtQml0cyxiaXRzfWlmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzErOCl7Zm9yKHZhciBtYXNrMT0wLGk9MDtpPHRoaXMuYml0UG9pbnRlcisxO2krKyltYXNrMSs9MTw8aTtyZXR1cm4gYml0cz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2sxKTw8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzEpLHRoaXMuYmxvY2tQb2ludGVyKyssYml0cys9dGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdPj44LShudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSkpLHRoaXMuYml0UG9pbnRlcj10aGlzLmJpdFBvaW50ZXItbnVtQml0cyU4LHRoaXMuYml0UG9pbnRlcjwwJiYodGhpcy5iaXRQb2ludGVyPTgrdGhpcy5iaXRQb2ludGVyKSxiaXRzfWlmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzErMTYpe2Zvcih2YXIgbWFzazE9MCxtYXNrMz0wLGk9MDtpPHRoaXMuYml0UG9pbnRlcisxO2krKyltYXNrMSs9MTw8aTt2YXIgYml0c0ZpcnN0QmxvY2s9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMSk8PG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKTt0aGlzLmJsb2NrUG9pbnRlcisrO3ZhciBiaXRzU2Vjb25kQmxvY2s9dGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdPDxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSs4KTt0aGlzLmJsb2NrUG9pbnRlcisrO2Zvcih2YXIgaT0wO2k8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCk7aSsrKW1hc2szKz0xPDxpO21hc2szPDw9OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCkpO3ZhciBiaXRzVGhpcmRCbG9jaz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2szKT4+OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCkpO3JldHVybiBiaXRzPWJpdHNGaXJzdEJsb2NrK2JpdHNTZWNvbmRCbG9jaytiaXRzVGhpcmRCbG9jayx0aGlzLmJpdFBvaW50ZXI9dGhpcy5iaXRQb2ludGVyLShudW1CaXRzLTgpJTgsdGhpcy5iaXRQb2ludGVyPDAmJih0aGlzLmJpdFBvaW50ZXI9OCt0aGlzLmJpdFBvaW50ZXIpLGJpdHN9cmV0dXJuIDB9LHRoaXMuTmV4dE1vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibG9ja1BvaW50ZXI+dGhpcy5ibG9ja3MubGVuZ3RoLXRoaXMubnVtRXJyb3JDb3JyZWN0aW9uQ29kZS0yPzA6dGhpcy5nZXROZXh0Qml0cyg0KX0sdGhpcy5nZXREYXRhTGVuZ3RoPWZ1bmN0aW9uKG1vZGVJbmRpY2F0b3Ipe2Zvcih2YXIgaW5kZXg9MDs7KXtpZihtb2RlSW5kaWNhdG9yPj5pbmRleD09MSlicmVhaztpbmRleCsrfXJldHVybiB0aGlzLmdldE5leHRCaXRzKHFyY29kZS5zaXplT2ZEYXRhTGVuZ3RoSW5mb1t0aGlzLmRhdGFMZW5ndGhNb2RlXVtpbmRleF0pfSx0aGlzLmdldFJvbWFuQW5kRmlndXJlU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsc3RyRGF0YT1cIlwiLHRhYmxlUm9tYW5BbmRGaWd1cmU9bmV3IEFycmF5KFwiMFwiLFwiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiQVwiLFwiQlwiLFwiQ1wiLFwiRFwiLFwiRVwiLFwiRlwiLFwiR1wiLFwiSFwiLFwiSVwiLFwiSlwiLFwiS1wiLFwiTFwiLFwiTVwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiUVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiIFwiLFwiJFwiLFwiJVwiLFwiKlwiLFwiK1wiLFwiLVwiLFwiLlwiLFwiL1wiLFwiOlwiKTtkbyBpZihsZW5ndGg+MSl7aW50RGF0YT10aGlzLmdldE5leHRCaXRzKDExKTt2YXIgZmlyc3RMZXR0ZXI9TWF0aC5mbG9vcihpbnREYXRhLzQ1KSxzZWNvbmRMZXR0ZXI9aW50RGF0YSU0NTtzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW2ZpcnN0TGV0dGVyXSxzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW3NlY29uZExldHRlcl0sbGVuZ3RoLT0yfWVsc2UgMT09bGVuZ3RoJiYoaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDYpLHN0ckRhdGErPXRhYmxlUm9tYW5BbmRGaWd1cmVbaW50RGF0YV0sbGVuZ3RoLT0xKTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIHN0ckRhdGF9LHRoaXMuZ2V0RmlndXJlU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsc3RyRGF0YT1cIlwiO2RvIGxlbmd0aD49Mz8oaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDEwKSwxMDA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSwxMD5pbnREYXRhJiYoc3RyRGF0YSs9XCIwXCIpLGxlbmd0aC09Myk6Mj09bGVuZ3RoPyhpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoNyksMTA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSxsZW5ndGgtPTIpOjE9PWxlbmd0aCYmKGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg0KSxsZW5ndGgtPTEpLHN0ckRhdGErPWludERhdGE7d2hpbGUobGVuZ3RoPjApO3JldHVybiBzdHJEYXRhfSx0aGlzLmdldDhiaXRCeXRlQXJyYXk9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCxvdXRwdXQ9bmV3IEFycmF5O2RvIGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg4KSxvdXRwdXQucHVzaChpbnREYXRhKSxsZW5ndGgtLTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIG91dHB1dH0sdGhpcy5nZXRLYW5qaVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHVuaWNvZGVTdHJpbmc9XCJcIjtkb3tpbnREYXRhPWdldE5leHRCaXRzKDEzKTt2YXIgbG93ZXJCeXRlPWludERhdGElMTkyLGhpZ2hlckJ5dGU9aW50RGF0YS8xOTIsdGVtcFdvcmQ9KGhpZ2hlckJ5dGU8PDgpK2xvd2VyQnl0ZSxzaGlmdGppc1dvcmQ9MDtzaGlmdGppc1dvcmQ9NDA5NTY+PXRlbXBXb3JkKzMzMDg4P3RlbXBXb3JkKzMzMDg4OnRlbXBXb3JkKzQ5NDcyLHVuaWNvZGVTdHJpbmcrPVN0cmluZy5mcm9tQ2hhckNvZGUoc2hpZnRqaXNXb3JkKSxsZW5ndGgtLX13aGlsZShsZW5ndGg+MCk7cmV0dXJuIHVuaWNvZGVTdHJpbmd9LHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFCeXRlXCIsZnVuY3Rpb24oKXtmb3IodmFyIG91dHB1dD1uZXcgQXJyYXksTU9ERV9OVU1CRVI9MSxNT0RFX1JPTUFOX0FORF9OVU1CRVI9MixNT0RFXzhCSVRfQllURT00LE1PREVfS0FOSkk9ODs7KXt2YXIgbW9kZT10aGlzLk5leHRNb2RlKCk7aWYoMD09bW9kZSl7aWYob3V0cHV0Lmxlbmd0aD4wKWJyZWFrO3Rocm93XCJFbXB0eSBkYXRhIGJsb2NrXCJ9aWYobW9kZSE9TU9ERV9OVU1CRVImJm1vZGUhPU1PREVfUk9NQU5fQU5EX05VTUJFUiYmbW9kZSE9TU9ERV84QklUX0JZVEUmJm1vZGUhPU1PREVfS0FOSkkpdGhyb3dcIkludmFsaWQgbW9kZTogXCIrbW9kZStcIiBpbiAoYmxvY2s6XCIrdGhpcy5ibG9ja1BvaW50ZXIrXCIgYml0OlwiK3RoaXMuYml0UG9pbnRlcitcIilcIjtpZihkYXRhTGVuZ3RoPXRoaXMuZ2V0RGF0YUxlbmd0aChtb2RlKSxkYXRhTGVuZ3RoPDEpdGhyb3dcIkludmFsaWQgZGF0YSBsZW5ndGg6IFwiK2RhdGFMZW5ndGg7c3dpdGNoKG1vZGUpe2Nhc2UgTU9ERV9OVU1CRVI6Zm9yKHZhciB0ZW1wX3N0cj10aGlzLmdldEZpZ3VyZVN0cmluZyhkYXRhTGVuZ3RoKSx0YT1uZXcgQXJyYXkodGVtcF9zdHIubGVuZ3RoKSxqPTA7ajx0ZW1wX3N0ci5sZW5ndGg7aisrKXRhW2pdPXRlbXBfc3RyLmNoYXJDb2RlQXQoaik7b3V0cHV0LnB1c2godGEpO2JyZWFrO2Nhc2UgTU9ERV9ST01BTl9BTkRfTlVNQkVSOmZvcih2YXIgdGVtcF9zdHI9dGhpcy5nZXRSb21hbkFuZEZpZ3VyZVN0cmluZyhkYXRhTGVuZ3RoKSx0YT1uZXcgQXJyYXkodGVtcF9zdHIubGVuZ3RoKSxqPTA7ajx0ZW1wX3N0ci5sZW5ndGg7aisrKXRhW2pdPXRlbXBfc3RyLmNoYXJDb2RlQXQoaik7b3V0cHV0LnB1c2godGEpO2JyZWFrO2Nhc2UgTU9ERV84QklUX0JZVEU6dmFyIHRlbXBfc2J5dGVBcnJheTM9dGhpcy5nZXQ4Yml0Qnl0ZUFycmF5KGRhdGFMZW5ndGgpO291dHB1dC5wdXNoKHRlbXBfc2J5dGVBcnJheTMpO2JyZWFrO2Nhc2UgTU9ERV9LQU5KSTp2YXIgdGVtcF9zdHI9dGhpcy5nZXRLYW5qaVN0cmluZyhkYXRhTGVuZ3RoKTtvdXRwdXQucHVzaCh0ZW1wX3N0cil9fXJldHVybiBvdXRwdXR9KX1HcmlkU2FtcGxlcj17fSxHcmlkU2FtcGxlci5jaGVja0FuZE51ZGdlUG9pbnRzPWZ1bmN0aW9uKGltYWdlLHBvaW50cyl7Zm9yKHZhciB3aWR0aD1xcmNvZGUud2lkdGgsaGVpZ2h0PXFyY29kZS5oZWlnaHQsbnVkZ2VkPSEwLG9mZnNldD0wO29mZnNldDxwb2ludHMuTGVuZ3RoJiZudWRnZWQ7b2Zmc2V0Kz0yKXt2YXIgeD1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXRdKSx5PU1hdGguZmxvb3IocG9pbnRzW29mZnNldCsxXSk7aWYoLTE+eHx8eD53aWR0aHx8LTE+eXx8eT5oZWlnaHQpdGhyb3dcIkVycm9yLmNoZWNrQW5kTnVkZ2VQb2ludHMgXCI7bnVkZ2VkPSExLC0xPT14Pyhwb2ludHNbb2Zmc2V0XT0wLG51ZGdlZD0hMCk6eD09d2lkdGgmJihwb2ludHNbb2Zmc2V0XT13aWR0aC0xLG51ZGdlZD0hMCksLTE9PXk/KHBvaW50c1tvZmZzZXQrMV09MCxudWRnZWQ9ITApOnk9PWhlaWdodCYmKHBvaW50c1tvZmZzZXQrMV09aGVpZ2h0LTEsbnVkZ2VkPSEwKX1udWRnZWQ9ITA7Zm9yKHZhciBvZmZzZXQ9cG9pbnRzLkxlbmd0aC0yO29mZnNldD49MCYmbnVkZ2VkO29mZnNldC09Mil7dmFyIHg9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0XSkseT1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXQrMV0pO2lmKC0xPnh8fHg+d2lkdGh8fC0xPnl8fHk+aGVpZ2h0KXRocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzIFwiO251ZGdlZD0hMSwtMT09eD8ocG9pbnRzW29mZnNldF09MCxudWRnZWQ9ITApOng9PXdpZHRoJiYocG9pbnRzW29mZnNldF09d2lkdGgtMSxudWRnZWQ9ITApLC0xPT15Pyhwb2ludHNbb2Zmc2V0KzFdPTAsbnVkZ2VkPSEwKTp5PT1oZWlnaHQmJihwb2ludHNbb2Zmc2V0KzFdPWhlaWdodC0xLG51ZGdlZD0hMCl9fSxHcmlkU2FtcGxlci5zYW1wbGVHcmlkMz1mdW5jdGlvbihpbWFnZSxkaW1lbnNpb24sdHJhbnNmb3JtKXtmb3IodmFyIGJpdHM9bmV3IEJpdE1hdHJpeChkaW1lbnNpb24pLHBvaW50cz1uZXcgQXJyYXkoZGltZW5zaW9uPDwxKSx5PTA7ZGltZW5zaW9uPnk7eSsrKXtmb3IodmFyIG1heD1wb2ludHMubGVuZ3RoLGlWYWx1ZT15Ky41LHg9MDttYXg+eDt4Kz0yKXBvaW50c1t4XT0oeD4+MSkrLjUscG9pbnRzW3grMV09aVZhbHVlO3RyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludHMxKHBvaW50cyksR3JpZFNhbXBsZXIuY2hlY2tBbmROdWRnZVBvaW50cyhpbWFnZSxwb2ludHMpO3RyeXtmb3IodmFyIHg9MDttYXg+eDt4Kz0yKXt2YXIgeHBvaW50PTQqTWF0aC5mbG9vcihwb2ludHNbeF0pK01hdGguZmxvb3IocG9pbnRzW3grMV0pKnFyY29kZS53aWR0aCo0LGJpdD1pbWFnZVtNYXRoLmZsb29yKHBvaW50c1t4XSkrcXJjb2RlLndpZHRoKk1hdGguZmxvb3IocG9pbnRzW3grMV0pXTtxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50XT1iaXQ/MjU1OjAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCsxXT1iaXQ/MjU1OjAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCsyXT0wLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrM109MjU1LGJpdCYmYml0cy5zZXRfUmVuYW1lZCh4Pj4xLHkpfX1jYXRjaChhaW9vYmUpe3Rocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzXCJ9fXJldHVybiBiaXRzfSxHcmlkU2FtcGxlci5zYW1wbGVHcmlkeD1mdW5jdGlvbihpbWFnZSxkaW1lbnNpb24scDFUb1gscDFUb1kscDJUb1gscDJUb1kscDNUb1gscDNUb1kscDRUb1gscDRUb1kscDFGcm9tWCxwMUZyb21ZLHAyRnJvbVgscDJGcm9tWSxwM0Zyb21YLHAzRnJvbVkscDRGcm9tWCxwNEZyb21ZKXt2YXIgdHJhbnNmb3JtPVBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1F1YWRyaWxhdGVyYWwocDFUb1gscDFUb1kscDJUb1gscDJUb1kscDNUb1gscDNUb1kscDRUb1gscDRUb1kscDFGcm9tWCxwMUZyb21ZLHAyRnJvbVgscDJGcm9tWSxwM0Zyb21YLHAzRnJvbVkscDRGcm9tWCxwNEZyb21ZKTtyZXR1cm4gR3JpZFNhbXBsZXIuc2FtcGxlR3JpZDMoaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl9LFZlcnNpb24uVkVSU0lPTl9ERUNPREVfSU5GTz1uZXcgQXJyYXkoMzE4OTIsMzQyMzYsMzk1NzcsNDIxOTUsNDgxMTgsNTEwNDIsNTUzNjcsNTg4OTMsNjM3ODQsNjg0NzIsNzA3NDksNzYzMTEsNzkxNTQsODQzOTAsODc2ODMsOTIzNjEsOTYyMzYsMTAyMDg0LDEwMjg4MSwxMTA1MDcsMTEwNzM0LDExNzc4NiwxMTk2MTUsMTI2MzI1LDEyNzU2OCwxMzM1ODksMTM2OTQ0LDE0MTQ5OCwxNDUzMTEsMTUwMjgzLDE1MjYyMiwxNTgzMDgsMTYxMDg5LDE2NzAxNyksVmVyc2lvbi5WRVJTSU9OUz1idWlsZFZlcnNpb25zKCksVmVyc2lvbi5nZXRWZXJzaW9uRm9yTnVtYmVyPWZ1bmN0aW9uKHZlcnNpb25OdW1iZXIpe2lmKDE+dmVyc2lvbk51bWJlcnx8dmVyc2lvbk51bWJlcj40MCl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gVmVyc2lvbi5WRVJTSU9OU1t2ZXJzaW9uTnVtYmVyLTFdfSxWZXJzaW9uLmdldFByb3Zpc2lvbmFsVmVyc2lvbkZvckRpbWVuc2lvbj1mdW5jdGlvbihkaW1lbnNpb24pe2lmKGRpbWVuc2lvbiU0IT0xKXRocm93XCJFcnJvciBnZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb25cIjt0cnl7cmV0dXJuIFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcihkaW1lbnNpb24tMTc+PjIpfWNhdGNoKGlhZSl7dGhyb3dcIkVycm9yIGdldFZlcnNpb25Gb3JOdW1iZXJcIn19LFZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uPWZ1bmN0aW9uKHZlcnNpb25CaXRzKXtmb3IodmFyIGJlc3REaWZmZXJlbmNlPTQyOTQ5NjcyOTUsYmVzdFZlcnNpb249MCxpPTA7aTxWZXJzaW9uLlZFUlNJT05fREVDT0RFX0lORk8ubGVuZ3RoO2krKyl7dmFyIHRhcmdldFZlcnNpb249VmVyc2lvbi5WRVJTSU9OX0RFQ09ERV9JTkZPW2ldO2lmKHRhcmdldFZlcnNpb249PXZlcnNpb25CaXRzKXJldHVybiB0aGlzLmdldFZlcnNpb25Gb3JOdW1iZXIoaSs3KTt2YXIgYml0c0RpZmZlcmVuY2U9Rm9ybWF0SW5mb3JtYXRpb24ubnVtQml0c0RpZmZlcmluZyh2ZXJzaW9uQml0cyx0YXJnZXRWZXJzaW9uKTtiZXN0RGlmZmVyZW5jZT5iaXRzRGlmZmVyZW5jZSYmKGJlc3RWZXJzaW9uPWkrNyxiZXN0RGlmZmVyZW5jZT1iaXRzRGlmZmVyZW5jZSl9cmV0dXJuIDM+PWJlc3REaWZmZXJlbmNlP3RoaXMuZ2V0VmVyc2lvbkZvck51bWJlcihiZXN0VmVyc2lvbik6bnVsbH0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbD1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myx4MHAseTBwLHgxcCx5MXAseDJwLHkycCx4M3AseTNwKXt2YXIgcVRvUz10aGlzLnF1YWRyaWxhdGVyYWxUb1NxdWFyZSh4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myksc1RvUT10aGlzLnNxdWFyZVRvUXVhZHJpbGF0ZXJhbCh4MHAseTBwLHgxcCx5MXAseDJwLHkycCx4M3AseTNwKTtyZXR1cm4gc1RvUS50aW1lcyhxVG9TKX0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0uc3F1YXJlVG9RdWFkcmlsYXRlcmFsPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKXtyZXR1cm4gZHkyPXkzLXkyLGR5Mz15MC15MSt5Mi15MywwPT1keTImJjA9PWR5Mz9uZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0oeDEteDAseDIteDEseDAseTEteTAseTIteTEseTAsMCwwLDEpOihkeDE9eDEteDIsZHgyPXgzLXgyLGR4Mz14MC14MSt4Mi14MyxkeTE9eTEteTIsZGVub21pbmF0b3I9ZHgxKmR5Mi1keDIqZHkxLGExMz0oZHgzKmR5Mi1keDIqZHkzKS9kZW5vbWluYXRvcixhMjM9KGR4MSpkeTMtZHgzKmR5MSkvZGVub21pbmF0b3IsbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHgxLXgwK2ExMyp4MSx4My14MCthMjMqeDMseDAseTEteTArYTEzKnkxLHkzLXkwK2EyMyp5Myx5MCxhMTMsYTIzLDEpKX0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvU3F1YXJlPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKXtyZXR1cm4gdGhpcy5zcXVhcmVUb1F1YWRyaWxhdGVyYWwoeDAseTAseDEseTEseDIseTIseDMseTMpLmJ1aWxkQWRqb2ludCgpfTt2YXIgRk9STUFUX0lORk9fTUFTS19RUj0yMTUyMixGT1JNQVRfSU5GT19ERUNPREVfTE9PS1VQPW5ldyBBcnJheShuZXcgQXJyYXkoMjE1MjIsMCksbmV3IEFycmF5KDIwNzczLDEpLG5ldyBBcnJheSgyNDE4OCwyKSxuZXcgQXJyYXkoMjMzNzEsMyksbmV3IEFycmF5KDE3OTEzLDQpLG5ldyBBcnJheSgxNjU5MCw1KSxuZXcgQXJyYXkoMjAzNzUsNiksbmV3IEFycmF5KDE5MTA0LDcpLG5ldyBBcnJheSgzMDY2MCw4KSxuZXcgQXJyYXkoMjk0MjcsOSksbmV3IEFycmF5KDMyMTcwLDEwKSxuZXcgQXJyYXkoMzA4NzcsMTEpLG5ldyBBcnJheSgyNjE1OSwxMiksbmV3IEFycmF5KDI1MzY4LDEzKSxuZXcgQXJyYXkoMjc3MTMsMTQpLG5ldyBBcnJheSgyNjk5OCwxNSksbmV3IEFycmF5KDU3NjksMTYpLG5ldyBBcnJheSg1MDU0LDE3KSxuZXcgQXJyYXkoNzM5OSwxOCksbmV3IEFycmF5KDY2MDgsMTkpLG5ldyBBcnJheSgxODkwLDIwKSxuZXcgQXJyYXkoNTk3LDIxKSxuZXcgQXJyYXkoMzM0MCwyMiksbmV3IEFycmF5KDIxMDcsMjMpLG5ldyBBcnJheSgxMzY2MywyNCksbmV3IEFycmF5KDEyMzkyLDI1KSxuZXcgQXJyYXkoMTYxNzcsMjYpLG5ldyBBcnJheSgxNDg1NCwyNyksbmV3IEFycmF5KDkzOTYsMjgpLG5ldyBBcnJheSg4NTc5LDI5KSxuZXcgQXJyYXkoMTE5OTQsMzApLG5ldyBBcnJheSgxMTI0NSwzMSkpLEJJVFNfU0VUX0lOX0hBTEZfQllURT1uZXcgQXJyYXkoMCwxLDEsMiwxLDIsMiwzLDEsMiwyLDMsMiwzLDMsNCk7Rm9ybWF0SW5mb3JtYXRpb24ubnVtQml0c0RpZmZlcmluZz1mdW5jdGlvbihhLGIpe3JldHVybiBhXj1iLEJJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZhXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDQpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDgpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDEyKV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwxNildK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMjApXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDI0KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwyOCldfSxGb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbihtYXNrZWRGb3JtYXRJbmZvKXt2YXIgZm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uKG1hc2tlZEZvcm1hdEluZm8pO3JldHVybiBudWxsIT1mb3JtYXRJbmZvP2Zvcm1hdEluZm86Rm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihtYXNrZWRGb3JtYXRJbmZvXkZPUk1BVF9JTkZPX01BU0tfUVIpfSxGb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uPWZ1bmN0aW9uKG1hc2tlZEZvcm1hdEluZm8pe2Zvcih2YXIgYmVzdERpZmZlcmVuY2U9NDI5NDk2NzI5NSxiZXN0Rm9ybWF0SW5mbz0wLGk9MDtpPEZPUk1BVF9JTkZPX0RFQ09ERV9MT09LVVAubGVuZ3RoO2krKyl7dmFyIGRlY29kZUluZm89Rk9STUFUX0lORk9fREVDT0RFX0xPT0tVUFtpXSx0YXJnZXRJbmZvPWRlY29kZUluZm9bMF07aWYodGFyZ2V0SW5mbz09bWFza2VkRm9ybWF0SW5mbylyZXR1cm4gbmV3IEZvcm1hdEluZm9ybWF0aW9uKGRlY29kZUluZm9bMV0pO3ZhciBiaXRzRGlmZmVyZW5jZT10aGlzLm51bUJpdHNEaWZmZXJpbmcobWFza2VkRm9ybWF0SW5mbyx0YXJnZXRJbmZvKTtiZXN0RGlmZmVyZW5jZT5iaXRzRGlmZmVyZW5jZSYmKGJlc3RGb3JtYXRJbmZvPWRlY29kZUluZm9bMV0sYmVzdERpZmZlcmVuY2U9Yml0c0RpZmZlcmVuY2UpfXJldHVybiAzPj1iZXN0RGlmZmVyZW5jZT9uZXcgRm9ybWF0SW5mb3JtYXRpb24oYmVzdEZvcm1hdEluZm8pOm51bGx9LEVycm9yQ29ycmVjdGlvbkxldmVsLmZvckJpdHM9ZnVuY3Rpb24oYml0cyl7aWYoMD5iaXRzfHxiaXRzPj1GT1JfQklUUy5MZW5ndGgpdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIEZPUl9CSVRTW2JpdHNdfTt2YXIgTD1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMCwxLFwiTFwiKSxNPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgxLDAsXCJNXCIpLFE9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDIsMyxcIlFcIiksSD1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMywyLFwiSFwiKSxGT1JfQklUUz1uZXcgQXJyYXkoTSxMLEgsUSk7RGF0YUJsb2NrLmdldERhdGFCbG9ja3M9ZnVuY3Rpb24ocmF3Q29kZXdvcmRzLHZlcnNpb24sZWNMZXZlbCl7aWYocmF3Q29kZXdvcmRzLmxlbmd0aCE9dmVyc2lvbi5Ub3RhbENvZGV3b3Jkcyl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtmb3IodmFyIGVjQmxvY2tzPXZlcnNpb24uZ2V0RUNCbG9ja3NGb3JMZXZlbChlY0xldmVsKSx0b3RhbEJsb2Nrcz0wLGVjQmxvY2tBcnJheT1lY0Jsb2Nrcy5nZXRFQ0Jsb2NrcygpLGk9MDtpPGVjQmxvY2tBcnJheS5sZW5ndGg7aSsrKXRvdGFsQmxvY2tzKz1lY0Jsb2NrQXJyYXlbaV0uQ291bnQ7Zm9yKHZhciByZXN1bHQ9bmV3IEFycmF5KHRvdGFsQmxvY2tzKSxudW1SZXN1bHRCbG9ja3M9MCxqPTA7ajxlY0Jsb2NrQXJyYXkubGVuZ3RoO2orKylmb3IodmFyIGVjQmxvY2s9ZWNCbG9ja0FycmF5W2pdLGk9MDtpPGVjQmxvY2suQ291bnQ7aSsrKXt2YXIgbnVtRGF0YUNvZGV3b3Jkcz1lY0Jsb2NrLkRhdGFDb2Rld29yZHMsbnVtQmxvY2tDb2Rld29yZHM9ZWNCbG9ja3MuRUNDb2Rld29yZHNQZXJCbG9jaytudW1EYXRhQ29kZXdvcmRzO3Jlc3VsdFtudW1SZXN1bHRCbG9ja3MrK109bmV3IERhdGFCbG9jayhudW1EYXRhQ29kZXdvcmRzLG5ldyBBcnJheShudW1CbG9ja0NvZGV3b3JkcykpfWZvcih2YXIgc2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzPXJlc3VsdFswXS5jb2Rld29yZHMubGVuZ3RoLGxvbmdlckJsb2Nrc1N0YXJ0QXQ9cmVzdWx0Lmxlbmd0aC0xO2xvbmdlckJsb2Nrc1N0YXJ0QXQ+PTA7KXt2YXIgbnVtQ29kZXdvcmRzPXJlc3VsdFtsb25nZXJCbG9ja3NTdGFydEF0XS5jb2Rld29yZHMubGVuZ3RoO2lmKG51bUNvZGV3b3Jkcz09c2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzKWJyZWFrO2xvbmdlckJsb2Nrc1N0YXJ0QXQtLX1sb25nZXJCbG9ja3NTdGFydEF0Kys7Zm9yKHZhciBzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkcz1zaG9ydGVyQmxvY2tzVG90YWxDb2Rld29yZHMtZWNCbG9ja3MuRUNDb2Rld29yZHNQZXJCbG9jayxyYXdDb2Rld29yZHNPZmZzZXQ9MCxpPTA7c2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHM+aTtpKyspZm9yKHZhciBqPTA7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXJlc3VsdFtqXS5jb2Rld29yZHNbaV09cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXTtmb3IodmFyIGo9bG9uZ2VyQmxvY2tzU3RhcnRBdDtudW1SZXN1bHRCbG9ja3M+ajtqKyspcmVzdWx0W2pdLmNvZGV3b3Jkc1tzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkc109cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXTtmb3IodmFyIG1heD1yZXN1bHRbMF0uY29kZXdvcmRzLmxlbmd0aCxpPXNob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzO21heD5pO2krKylmb3IodmFyIGo9MDtudW1SZXN1bHRCbG9ja3M+ajtqKyspe3ZhciBpT2Zmc2V0PWxvbmdlckJsb2Nrc1N0YXJ0QXQ+aj9pOmkrMTtyZXN1bHRbal0uY29kZXdvcmRzW2lPZmZzZXRdPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK119cmV0dXJuIHJlc3VsdH0sRGF0YU1hc2s9e30sRGF0YU1hc2suZm9yUmVmZXJlbmNlPWZ1bmN0aW9uKHJlZmVyZW5jZSl7aWYoMD5yZWZlcmVuY2V8fHJlZmVyZW5jZT43KXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gRGF0YU1hc2suREFUQV9NQVNLU1tyZWZlcmVuY2VdfSxEYXRhTWFzay5EQVRBX01BU0tTPW5ldyBBcnJheShuZXcgRGF0YU1hc2swMDAsbmV3IERhdGFNYXNrMDAxLG5ldyBEYXRhTWFzazAxMCxuZXcgRGF0YU1hc2swMTEsbmV3IERhdGFNYXNrMTAwLG5ldyBEYXRhTWFzazEwMSxuZXcgRGF0YU1hc2sxMTAsbmV3IERhdGFNYXNrMTExKSxHRjI1Ni5RUl9DT0RFX0ZJRUxEPW5ldyBHRjI1NigyODUpLEdGMjU2LkRBVEFfTUFUUklYX0ZJRUxEPW5ldyBHRjI1NigzMDEpLEdGMjU2LmFkZE9yU3VidHJhY3Q9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYV5ifSxEZWNvZGVyPXt9LERlY29kZXIucnNEZWNvZGVyPW5ldyBSZWVkU29sb21vbkRlY29kZXIoR0YyNTYuUVJfQ09ERV9GSUVMRCksRGVjb2Rlci5jb3JyZWN0RXJyb3JzPWZ1bmN0aW9uKGNvZGV3b3JkQnl0ZXMsbnVtRGF0YUNvZGV3b3Jkcyl7Zm9yKHZhciBudW1Db2Rld29yZHM9Y29kZXdvcmRCeXRlcy5sZW5ndGgsY29kZXdvcmRzSW50cz1uZXcgQXJyYXkobnVtQ29kZXdvcmRzKSxpPTA7bnVtQ29kZXdvcmRzPmk7aSsrKWNvZGV3b3Jkc0ludHNbaV09MjU1JmNvZGV3b3JkQnl0ZXNbaV07dmFyIG51bUVDQ29kZXdvcmRzPWNvZGV3b3JkQnl0ZXMubGVuZ3RoLW51bURhdGFDb2Rld29yZHM7dHJ5e0RlY29kZXIucnNEZWNvZGVyLmRlY29kZShjb2Rld29yZHNJbnRzLG51bUVDQ29kZXdvcmRzKX1jYXRjaChyc2Upe3Rocm93IHJzZX1mb3IodmFyIGk9MDtudW1EYXRhQ29kZXdvcmRzPmk7aSsrKWNvZGV3b3JkQnl0ZXNbaV09Y29kZXdvcmRzSW50c1tpXX0sRGVjb2Rlci5kZWNvZGU9ZnVuY3Rpb24oYml0cyl7Zm9yKHZhciBwYXJzZXI9bmV3IEJpdE1hdHJpeFBhcnNlcihiaXRzKSx2ZXJzaW9uPXBhcnNlci5yZWFkVmVyc2lvbigpLGVjTGV2ZWw9cGFyc2VyLnJlYWRGb3JtYXRJbmZvcm1hdGlvbigpLkVycm9yQ29ycmVjdGlvbkxldmVsLGNvZGV3b3Jkcz1wYXJzZXIucmVhZENvZGV3b3JkcygpLGRhdGFCbG9ja3M9RGF0YUJsb2NrLmdldERhdGFCbG9ja3MoY29kZXdvcmRzLHZlcnNpb24sZWNMZXZlbCksdG90YWxCeXRlcz0wLGk9MDtpPGRhdGFCbG9ja3MuTGVuZ3RoO2krKyl0b3RhbEJ5dGVzKz1kYXRhQmxvY2tzW2ldLk51bURhdGFDb2Rld29yZHM7Zm9yKHZhciByZXN1bHRCeXRlcz1uZXcgQXJyYXkodG90YWxCeXRlcykscmVzdWx0T2Zmc2V0PTAsaj0wO2o8ZGF0YUJsb2Nrcy5sZW5ndGg7aisrKXt2YXIgZGF0YUJsb2NrPWRhdGFCbG9ja3Nbal0sY29kZXdvcmRCeXRlcz1kYXRhQmxvY2suQ29kZXdvcmRzLG51bURhdGFDb2Rld29yZHM9ZGF0YUJsb2NrLk51bURhdGFDb2Rld29yZHM7RGVjb2Rlci5jb3JyZWN0RXJyb3JzKGNvZGV3b3JkQnl0ZXMsbnVtRGF0YUNvZGV3b3Jkcyk7Zm9yKHZhciBpPTA7bnVtRGF0YUNvZGV3b3Jkcz5pO2krKylyZXN1bHRCeXRlc1tyZXN1bHRPZmZzZXQrK109Y29kZXdvcmRCeXRlc1tpXX12YXIgcmVhZGVyPW5ldyBRUkNvZGVEYXRhQmxvY2tSZWFkZXIocmVzdWx0Qnl0ZXMsdmVyc2lvbi5WZXJzaW9uTnVtYmVyLGVjTGV2ZWwuQml0cyk7cmV0dXJuIHJlYWRlcn0scXJjb2RlPXt9LHFyY29kZS5pbWFnZWRhdGE9bnVsbCxxcmNvZGUud2lkdGg9MCxxcmNvZGUuaGVpZ2h0PTAscXJjb2RlLnFyQ29kZVN5bWJvbD1udWxsLHFyY29kZS5kZWJ1Zz0hMSxxcmNvZGUuc2l6ZU9mRGF0YUxlbmd0aEluZm89W1sxMCw5LDgsOF0sWzEyLDExLDE2LDEwXSxbMTQsMTMsMTYsMTJdXSxxcmNvZGUuY2FsbGJhY2s9bnVsbCxxcmNvZGUuZGVjb2RlPWZ1bmN0aW9uKHNyYyl7aWYoMD09YXJndW1lbnRzLmxlbmd0aCl7dmFyIGNhbnZhc19xcj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInFyLWNhbnZhc1wiKSxjb250ZXh0PWNhbnZhc19xci5nZXRDb250ZXh0KFwiMmRcIik7cmV0dXJuIHFyY29kZS53aWR0aD1jYW52YXNfcXIud2lkdGgscXJjb2RlLmhlaWdodD1jYW52YXNfcXIuaGVpZ2h0LHFyY29kZS5pbWFnZWRhdGE9Y29udGV4dC5nZXRJbWFnZURhdGEoMCwwLHFyY29kZS53aWR0aCxxcmNvZGUuaGVpZ2h0KSxxcmNvZGUucmVzdWx0PXFyY29kZS5wcm9jZXNzKGNvbnRleHQpLG51bGwhPXFyY29kZS5jYWxsYmFjayYmcXJjb2RlLmNhbGxiYWNrKHFyY29kZS5yZXN1bHQpLHFyY29kZS5yZXN1bHR9dmFyIGltYWdlPW5ldyBJbWFnZTtpbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXt2YXIgY2FudmFzX3FyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksY29udGV4dD1jYW52YXNfcXIuZ2V0Q29udGV4dChcIjJkXCIpLGNhbnZhc19vdXQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXQtY2FudmFzXCIpO2lmKG51bGwhPWNhbnZhc19vdXQpe3ZhciBvdXRjdHg9Y2FudmFzX291dC5nZXRDb250ZXh0KFwiMmRcIik7b3V0Y3R4LmNsZWFyUmVjdCgwLDAsMzIwLDI0MCksb3V0Y3R4LmRyYXdJbWFnZShpbWFnZSwwLDAsMzIwLDI0MCl9Y2FudmFzX3FyLndpZHRoPWltYWdlLndpZHRoLGNhbnZhc19xci5oZWlnaHQ9aW1hZ2UuaGVpZ2h0LGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLDAsMCkscXJjb2RlLndpZHRoPWltYWdlLndpZHRoLHFyY29kZS5oZWlnaHQ9aW1hZ2UuaGVpZ2h0O3RyeXtxcmNvZGUuaW1hZ2VkYXRhPWNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxpbWFnZS53aWR0aCxpbWFnZS5oZWlnaHQpfWNhdGNoKGUpe3JldHVybiBxcmNvZGUucmVzdWx0PVwiQ3Jvc3MgZG9tYWluIGltYWdlIHJlYWRpbmcgbm90IHN1cHBvcnRlZCBpbiB5b3VyIGJyb3dzZXIhIFNhdmUgaXQgdG8geW91ciBjb21wdXRlciB0aGVuIGRyYWcgYW5kIGRyb3AgdGhlIGZpbGUhXCIsdm9pZChudWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KSl9dHJ5e3FyY29kZS5yZXN1bHQ9cXJjb2RlLnByb2Nlc3MoY29udGV4dCl9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSkscXJjb2RlLnJlc3VsdD1cImVycm9yIGRlY29kaW5nIFFSIENvZGVcIn1udWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KX0saW1hZ2Uuc3JjPXNyY30scXJjb2RlLmRlY29kZV91dGY4PWZ1bmN0aW9uKHMpe3JldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKHMpKX0scXJjb2RlLnByb2Nlc3M9ZnVuY3Rpb24oY3R4KXt2YXIgc3RhcnQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksaW1hZ2U9cXJjb2RlLmdyYXlTY2FsZVRvQml0bWFwKHFyY29kZS5ncmF5c2NhbGUoKSk7aWYocXJjb2RlLmRlYnVnKXtmb3IodmFyIHk9MDt5PHFyY29kZS5oZWlnaHQ7eSsrKWZvcih2YXIgeD0wO3g8cXJjb2RlLndpZHRoO3grKyl7dmFyIHBvaW50PTQqeCt5KnFyY29kZS53aWR0aCo0O3FyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludF09KGltYWdlW3greSpxcmNvZGUud2lkdGhdLDApLHFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsxXT0oaW1hZ2VbeCt5KnFyY29kZS53aWR0aF0sMCkscXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzJdPWltYWdlW3greSpxcmNvZGUud2lkdGhdPzI1NTowfWN0eC5wdXRJbWFnZURhdGEocXJjb2RlLmltYWdlZGF0YSwwLDApfXZhciBkZXRlY3Rvcj1uZXcgRGV0ZWN0b3IoaW1hZ2UpLHFSQ29kZU1hdHJpeD1kZXRlY3Rvci5kZXRlY3QoKTtxcmNvZGUuZGVidWcmJmN0eC5wdXRJbWFnZURhdGEocXJjb2RlLmltYWdlZGF0YSwwLDApO2Zvcih2YXIgcmVhZGVyPURlY29kZXIuZGVjb2RlKHFSQ29kZU1hdHJpeC5iaXRzKSxkYXRhPXJlYWRlci5EYXRhQnl0ZSxzdHI9XCJcIixpPTA7aTxkYXRhLmxlbmd0aDtpKyspZm9yKHZhciBqPTA7ajxkYXRhW2ldLmxlbmd0aDtqKyspc3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaV1bal0pO3ZhciBlbmQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksdGltZT1lbmQtc3RhcnQ7cmV0dXJuIGNvbnNvbGUubG9nKHRpbWUpLHFyY29kZS5kZWNvZGVfdXRmOChzdHIpfSxxcmNvZGUuZ2V0UGl4ZWw9ZnVuY3Rpb24oeCx5KXtpZihxcmNvZGUud2lkdGg8eCl0aHJvd1wicG9pbnQgZXJyb3JcIjtpZihxcmNvZGUuaGVpZ2h0PHkpdGhyb3dcInBvaW50IGVycm9yXCI7cmV0dXJuIHBvaW50PTQqeCt5KnFyY29kZS53aWR0aCo0LHA9KDMzKnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludF0rMzQqcXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzFdKzMzKnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsyXSkvMTAwLHB9LHFyY29kZS5iaW5hcml6ZT1mdW5jdGlvbih0aCl7Zm9yKHZhciByZXQ9bmV3IEFycmF5KHFyY29kZS53aWR0aCpxcmNvZGUuaGVpZ2h0KSx5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBncmF5PXFyY29kZS5nZXRQaXhlbCh4LHkpO3JldFt4K3kqcXJjb2RlLndpZHRoXT10aD49Z3JheT8hMDohMX1yZXR1cm4gcmV0fSxxcmNvZGUuZ2V0TWlkZGxlQnJpZ2h0bmVzc1BlckFyZWE9ZnVuY3Rpb24oaW1hZ2Upe2Zvcih2YXIgbnVtU3FydEFyZWE9NCxhcmVhV2lkdGg9TWF0aC5mbG9vcihxcmNvZGUud2lkdGgvbnVtU3FydEFyZWEpLGFyZWFIZWlnaHQ9TWF0aC5mbG9vcihxcmNvZGUuaGVpZ2h0L251bVNxcnRBcmVhKSxtaW5tYXg9bmV3IEFycmF5KG51bVNxcnRBcmVhKSxpPTA7bnVtU3FydEFyZWE+aTtpKyspe21pbm1heFtpXT1uZXcgQXJyYXkobnVtU3FydEFyZWEpO2Zvcih2YXIgaTI9MDtudW1TcXJ0QXJlYT5pMjtpMisrKW1pbm1heFtpXVtpMl09bmV3IEFycmF5KDAsMCl9Zm9yKHZhciBheT0wO251bVNxcnRBcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO251bVNxcnRBcmVhPmF4O2F4Kyspe21pbm1heFtheF1bYXldWzBdPTI1NTtmb3IodmFyIGR5PTA7YXJlYUhlaWdodD5keTtkeSsrKWZvcih2YXIgZHg9MDthcmVhV2lkdGg+ZHg7ZHgrKyl7dmFyIHRhcmdldD1pbWFnZVthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF07dGFyZ2V0PG1pbm1heFtheF1bYXldWzBdJiYobWlubWF4W2F4XVtheV1bMF09dGFyZ2V0KSx0YXJnZXQ+bWlubWF4W2F4XVtheV1bMV0mJihtaW5tYXhbYXhdW2F5XVsxXT10YXJnZXQpfX1mb3IodmFyIG1pZGRsZT1uZXcgQXJyYXkobnVtU3FydEFyZWEpLGkzPTA7bnVtU3FydEFyZWE+aTM7aTMrKyltaWRkbGVbaTNdPW5ldyBBcnJheShudW1TcXJ0QXJlYSk7Zm9yKHZhciBheT0wO251bVNxcnRBcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO251bVNxcnRBcmVhPmF4O2F4KyspbWlkZGxlW2F4XVtheV09TWF0aC5mbG9vcigobWlubWF4W2F4XVtheV1bMF0rbWlubWF4W2F4XVtheV1bMV0pLzIpO3JldHVybiBtaWRkbGV9LHFyY29kZS5ncmF5U2NhbGVUb0JpdG1hcD1mdW5jdGlvbihncmF5U2NhbGUpe2Zvcih2YXIgbWlkZGxlPXFyY29kZS5nZXRNaWRkbGVCcmlnaHRuZXNzUGVyQXJlYShncmF5U2NhbGUpLHNxcnROdW1BcmVhPW1pZGRsZS5sZW5ndGgsYXJlYVdpZHRoPU1hdGguZmxvb3IocXJjb2RlLndpZHRoL3NxcnROdW1BcmVhKSxhcmVhSGVpZ2h0PU1hdGguZmxvb3IocXJjb2RlLmhlaWdodC9zcXJ0TnVtQXJlYSksYml0bWFwPW5ldyBBcnJheShxcmNvZGUuaGVpZ2h0KnFyY29kZS53aWR0aCksYXk9MDtzcXJ0TnVtQXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtzcXJ0TnVtQXJlYT5heDtheCsrKWZvcih2YXIgZHk9MDthcmVhSGVpZ2h0PmR5O2R5KyspZm9yKHZhciBkeD0wO2FyZWFXaWR0aD5keDtkeCsrKWJpdG1hcFthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF09Z3JheVNjYWxlW2FyZWFXaWR0aCpheCtkeCsoYXJlYUhlaWdodCpheStkeSkqcXJjb2RlLndpZHRoXTxtaWRkbGVbYXhdW2F5XT8hMDohMTtcbiAgICByZXR1cm4gYml0bWFwfSxxcmNvZGUuZ3JheXNjYWxlPWZ1bmN0aW9uKCl7Zm9yKHZhciByZXQ9bmV3IEFycmF5KHFyY29kZS53aWR0aCpxcmNvZGUuaGVpZ2h0KSx5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBncmF5PXFyY29kZS5nZXRQaXhlbCh4LHkpO3JldFt4K3kqcXJjb2RlLndpZHRoXT1ncmF5fXJldHVybiByZXR9LEFycmF5LnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oZnJvbSx0byl7dmFyIHJlc3Q9dGhpcy5zbGljZSgodG98fGZyb20pKzF8fHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpcy5sZW5ndGg9MD5mcm9tP3RoaXMubGVuZ3RoK2Zyb206ZnJvbSx0aGlzLnB1c2guYXBwbHkodGhpcyxyZXN0KX07dmFyIE1JTl9TS0lQPTMsTUFYX01PRFVMRVM9NTcsSU5URUdFUl9NQVRIX1NISUZUPTgsQ0VOVEVSX1FVT1JVTT0yO3FyY29kZS5vcmRlckJlc3RQYXR0ZXJucz1mdW5jdGlvbihwYXR0ZXJucyl7ZnVuY3Rpb24gZGlzdGFuY2UocGF0dGVybjEscGF0dGVybjIpe3JldHVybiB4RGlmZj1wYXR0ZXJuMS5YLXBhdHRlcm4yLlgseURpZmY9cGF0dGVybjEuWS1wYXR0ZXJuMi5ZLE1hdGguc3FydCh4RGlmZip4RGlmZit5RGlmZip5RGlmZil9ZnVuY3Rpb24gY3Jvc3NQcm9kdWN0Wihwb2ludEEscG9pbnRCLHBvaW50Qyl7dmFyIGJYPXBvaW50Qi54LGJZPXBvaW50Qi55O3JldHVybihwb2ludEMueC1iWCkqKHBvaW50QS55LWJZKS0ocG9pbnRDLnktYlkpKihwb2ludEEueC1iWCl9dmFyIHBvaW50QSxwb2ludEIscG9pbnRDLHplcm9PbmVEaXN0YW5jZT1kaXN0YW5jZShwYXR0ZXJuc1swXSxwYXR0ZXJuc1sxXSksb25lVHdvRGlzdGFuY2U9ZGlzdGFuY2UocGF0dGVybnNbMV0scGF0dGVybnNbMl0pLHplcm9Ud29EaXN0YW5jZT1kaXN0YW5jZShwYXR0ZXJuc1swXSxwYXR0ZXJuc1syXSk7aWYob25lVHdvRGlzdGFuY2U+PXplcm9PbmVEaXN0YW5jZSYmb25lVHdvRGlzdGFuY2U+PXplcm9Ud29EaXN0YW5jZT8ocG9pbnRCPXBhdHRlcm5zWzBdLHBvaW50QT1wYXR0ZXJuc1sxXSxwb2ludEM9cGF0dGVybnNbMl0pOnplcm9Ud29EaXN0YW5jZT49b25lVHdvRGlzdGFuY2UmJnplcm9Ud29EaXN0YW5jZT49emVyb09uZURpc3RhbmNlPyhwb2ludEI9cGF0dGVybnNbMV0scG9pbnRBPXBhdHRlcm5zWzBdLHBvaW50Qz1wYXR0ZXJuc1syXSk6KHBvaW50Qj1wYXR0ZXJuc1syXSxwb2ludEE9cGF0dGVybnNbMF0scG9pbnRDPXBhdHRlcm5zWzFdKSxjcm9zc1Byb2R1Y3RaKHBvaW50QSxwb2ludEIscG9pbnRDKTwwKXt2YXIgdGVtcD1wb2ludEE7cG9pbnRBPXBvaW50Qyxwb2ludEM9dGVtcH1wYXR0ZXJuc1swXT1wb2ludEEscGF0dGVybnNbMV09cG9pbnRCLHBhdHRlcm5zWzJdPXBvaW50Q307IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5mYWN0b3J5KCdBdXRoU2VydmljZScsIFtcbiAgICAnJGh0dHAnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJHdpbmRvdycsXG4gICAgJ1Nlc3Npb24nLFxuICAgIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGUsICR3aW5kb3csIFNlc3Npb24pIHtcbiAgICAgIHZhciBhdXRoU2VydmljZSA9IHt9O1xuXG4gICAgICBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MoZGF0YSwgY2IsIHZvbHVudGVlcil7XG4gICAgICAgIC8vIFdpbm5lciB3aW5uZXIgeW91IGdldCBhIHRva2VuXG4gICAgICAgIGlmKCF2b2x1bnRlZXIpIHtTZXNzaW9uLmNyZWF0ZShkYXRhLnRva2VuLCBkYXRhLnVzZXIpO31cblxuICAgICAgICBpZiAoY2Ipe1xuICAgICAgICAgIGNiKGRhdGEudXNlcik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbG9naW5GYWlsdXJlKGRhdGEsIGNiLCB2b2x1bnRlZXIpe1xuICAgICAgICBpZighdm9sdW50ZWVyKSB7JHN0YXRlLmdvKCdob21lJyk7fVxuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjYihkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSwgb25TdWNjZXNzKTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUocmVzcG9uc2UuZGF0YSwgb25GYWlsdXJlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSwgb25TdWNjZXNzKTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcbiAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGxvZ2luRmFpbHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5sb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAvLyBDbGVhciB0aGUgc2Vzc2lvblxuICAgICAgICBTZXNzaW9uLmRlc3Ryb3koY2FsbGJhY2spO1xuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSAsdm9sdW50ZWVyKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZWdpc3RlcicsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgIHZvbHVudGVlcjogdm9sdW50ZWVyLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIG9uU3VjY2Vzcywgdm9sdW50ZWVyKTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUocmVzcG9uc2UuZGF0YSwgb25GYWlsdXJlLCB2b2x1bnRlZXIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UudmVyaWZ5ID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hdXRoL3ZlcmlmeS8nICsgdG9rZW4pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXRVc2VyKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgaWYgKG9uU3VjY2Vzcykge1xuICAgICAgICAgICAgICBvblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKG9uRmFpbHVyZSkge1xuICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCA9IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3ZlcmlmeS9yZXNlbmQnLCB7XG4gICAgICAgICAgICBpZDogU2Vzc2lvbi5nZXRVc2VySWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbihlbWFpbCl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldCcsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHRva2VuLCBwYXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldC9wYXNzd29yZCcsIHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihvblN1Y2Nlc3MsIG9uRmFpbHVyZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gYXV0aFNlcnZpY2U7XG4gICAgfVxuICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiQ2hhbGxlbmdlU2VydmljZVwiLCBbXG4gICAgXCIkaHR0cFwiLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICB2YXIgY2hhbGxlbmdlcyA9IFwiL2FwaS9jaGFsbGVuZ2VzXCI7XG4gICAgICB2YXIgYmFzZSA9IGNoYWxsZW5nZXMgKyBcIi9cIjtcbiAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oY0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGNoYWxsZW5nZXMgKyBcIi9jcmVhdGVcIiwge1xuICAgICAgICAgICAgICBjRGF0YTogY0RhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG5cblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGlkLCBjRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlXCIsIHtcbiAgICAgICAgICAgICAgY0RhdGE6IGNEYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZlXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKTtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFuc3dlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCArIFwiL2Fuc3dlclwiKTtcbiAgICAgICAgfSxcblxuICBcbiAgICAgIH07XG4gICAgfVxuICBdKTtcbiAgIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJNYXJrZXRpbmdTZXJ2aWNlXCIsIFtcbiAgICBcIiRodHRwXCIsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgIHZhciBtYXJrZXRpbmcgPSBcIi9hcGkvbWFya2V0aW5nXCI7XG4gICAgICB2YXIgYmFzZSA9IG1hcmtldGluZyArIFwiL1wiO1xuICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgY3JlYXRlVGVhbTogZnVuY3Rpb24odGVhbURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KG1hcmtldGluZyArIFwiL2NyZWF0ZVRlYW1cIiwge1xuICAgICAgICAgICAgICB0ZWFtRGF0YTogdGVhbURhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZW5kRnJpZW5kSW52aXRlOiBmdW5jdGlvbih1c2VybmFtZSx0ZWFtbWF0ZSl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QobWFya2V0aW5nICsgXCIvc2VuZEludml0ZVwiLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICB0ZWFtbWF0ZTogdGVhbW1hdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICBcbiAgICAgIH07XG4gICAgfVxuICBdKTtcbiAgIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpIFxuICAuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgW1xuICAnJGh0dHAnLFxuICBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICB2YXIgYmFzZSA9ICcvYXBpL3NldHRpbmdzLyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UHVibGljU2V0dGluZ3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlUmVnaXN0cmF0aW9uVGltZXM6IGZ1bmN0aW9uKG9wZW4sIGNsb3NlKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3RpbWVzJywge1xuICAgICAgICAgIHRpbWVPcGVuOiBvcGVuLFxuICAgICAgICAgIHRpbWVDbG9zZTogY2xvc2UsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybS1ieScsIHtcbiAgICAgICAgICB0aW1lOiB0aW1lXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUV2ZW50VGltZXM6IGZ1bmN0aW9uKHN0YXJ0LGVuZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdldmVudHRpbWVzJywge1xuICAgICAgICAgIHRpbWVTdGFydDogc3RhcnQsXG4gICAgICAgICAgdGltZUVuZDogZW5kLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXRXaGl0ZWxpc3RlZEVtYWlsczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3doaXRlbGlzdCcpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbihlbWFpbHMpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2hpdGVsaXN0Jywge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVdhaXRsaXN0VGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd3YWl0bGlzdCcsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUFjY2VwdGFuY2VUZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2FjY2VwdGFuY2UnLCB7XG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZUhvc3RTY2hvb2w6IGZ1bmN0aW9uKGhvc3RTY2hvb2wpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnaG9zdFNjaG9vbCcsIHtcbiAgICAgICAgICBob3N0U2Nob29sOiBob3N0U2Nob29sXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdjb25maXJtYXRpb24nLCB7XG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVBbGxvd01pbm9yczogZnVuY3Rpb24oYWxsb3dNaW5vcnMpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnbWlub3JzJywgeyBcbiAgICAgICAgICBhbGxvd01pbm9yczogYWxsb3dNaW5vcnMgXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuXG4gIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIlNvbHZlZENURlNlcnZpY2VcIiwgW1xuICAgIFwiJGh0dHBcIixcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgdmFyIENURiA9IFwiL2FwaS9DVEZcIjtcbiAgICAgIHZhciBiYXNlID0gQ1RGICsgXCIvXCI7XG4gIFxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHNvbHZlOiBmdW5jdGlvbihjaGFsbGVuZ2UsIHVzZXIsIGFuc3dlciwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KENURiArIFwiL3NvbHZlXCIsIHtcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2U6IGNoYWxsZW5nZSwgXG4gICAgICAgICAgICAgICAgdXNlciA6IHVzZXIsXG4gICAgICAgICAgICAgICAgYW5zd2VyIDogYW5zd2VyLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgb25TdWNjZXNzKGNoYWxsZW5nZSk7XG4gICAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChDVEYpO1xuICAgICAgICB9LFxuICAgIFxuICAgICAgfTtcbiAgICB9XG4gIF0pO1xuICAiLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIlRlYW1TZXJ2aWNlXCIsIFtcbiAgICBcIiRodHRwXCIsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgIHZhciB0ZWFtcyA9IFwiL2FwaS90ZWFtc1wiO1xuICAgICAgdmFyIGJhc2UgPSB0ZWFtcyArIFwiL1wiO1xuICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbih0ZWFtRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodGVhbXMgKyBcIi9jcmVhdGVcIiwge1xuICAgICAgICAgICAgICB0ZWFtRGF0YTogdGVhbURhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGlkLCBjRGF0YSkge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZVwiLCB7XG4gICAgICAgICAgICBjRGF0YTogY0RhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBqb2luOiBmdW5jdGlvbihpZCwgbmV3dXNlcikge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2pvaW5UZWFtXCIsIHtcbiAgICAgICAgICAgIG5ld2pvaW5SZXF1ZXN0OiBuZXd1c2VyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3Zlam9pbjogZnVuY3Rpb24oaWQsIGluZGV4LCB1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXG4gICAgICAgICAgLnRoZW4odGVhbSA9PiB7XG4gICAgICAgICAgICB0ZWFtLmRhdGEuam9pblJlcXVlc3RzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICBpZiAoISh1c2VyPT1mYWxzZSkpe1xuICAgICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZFJlZnVzZWRUZWFtXCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVKb2luVGVhbVwiLCB7XG4gICAgICAgICAgICAgIG5ld2pvaW5SZXF1ZXN0czogdGVhbS5kYXRhLmpvaW5SZXF1ZXN0c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBhY2NlcHRNZW1iZXI6IGZ1bmN0aW9uKGlkLCBuZXd1c2VyLG1heFRlYW1TaXplKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXG4gICAgICAgICAgLnRoZW4odGVhbSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh0ZWFtLmRhdGEubWVtYmVycy5sZW5ndGg+PW1heFRlYW1TaXplKXsgcmV0dXJuICdtYXhUZWFtU2l6ZScgfVxuICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRBY2NlcHRlZFRlYW1cIiwge1xuICAgICAgICAgICAgICBpZDogbmV3dXNlci5pZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvYWRkTWVtYmVyXCIsIHtcbiAgICAgICAgICAgICAgbmV3TWVtYmVyOiBuZXd1c2VyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVtZW1iZXI6IGZ1bmN0aW9uKGlkLCBpbmRleCwgdXNlcklEKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXG4gICAgICAgICAgLnRoZW4odGVhbSA9PiB7XG4gICAgICAgICAgICB2YXIgcmVtb3ZlZFVzZXIgPSB0ZWFtLmRhdGEubWVtYmVyc1tpbmRleF1cbiAgICAgICAgICAgIGlmIChpbmRleD09MCl7cmV0dXJuIFwicmVtb3ZpbmdBZG1pblwifVxuICAgICAgICAgICAgdGVhbS5kYXRhLm1lbWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIGlmICghdXNlcklEKXtcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRBZG1pblJlbW92ZWRUZWFtXCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGVhbS5kYXRhLm1lbWJlcnNbMF0uaWQsXG4gICAgICAgICAgICAgICAgbWVtYmVyOiByZW1vdmVkVXNlci5uYW1lXG4gICAgICAgICAgICAgIH0pOyAgXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRSZW1vdmVkVGVhbVwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHVzZXJJRCxcbiAgICAgICAgICAgICAgfSk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZU1lbWJlclwiLCB7XG4gICAgICAgICAgICAgIG5ld01lbWJlcnM6IHRlYW0uZGF0YS5tZW1iZXJzLFxuICAgICAgICAgICAgICByZW1vdmVkdXNlcklEOiByZW1vdmVkVXNlci5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZVwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgdG9nZ2xlQ2xvc2VUZWFtOiBmdW5jdGlvbihpZCwgc3RhdHVzKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdG9nZ2xlQ2xvc2VUZWFtXCIsIHtcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlSGlkZVRlYW06IGZ1bmN0aW9uKGlkLCBzdGF0dXMpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi90b2dnbGVIaWRlVGVhbVwiLCB7XG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1c1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNlbGVjdGVkVGVhbXM6IGZ1bmN0aW9uKHRleHQsc2tpbGxzRmlsdGVycykge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHRlYW1zICsgXCI/XCIgKyAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgICAgICAgIHNlYXJjaDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBza2lsbHNGaWx0ZXJzOiBza2lsbHNGaWx0ZXJzID8gc2tpbGxzRmlsdGVycyA6IHt9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgXG4gIFxuXG5cbiAgICAgIH07XG4gICAgfVxuICBdKTtcbiAgIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuZmFjdG9yeShcIlVzZXJTZXJ2aWNlXCIsIFtcbiAgXCIkaHR0cFwiLFxuICBcIlNlc3Npb25cIixcbiAgZnVuY3Rpb24oJGh0dHAsIFNlc3Npb24pIHtcbiAgICB2YXIgdXNlcnMgPSBcIi9hcGkvdXNlcnNcIjtcbiAgICB2YXIgYmFzZSA9IHVzZXJzICsgXCIvXCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gQmFzaWMgQWN0aW9uc1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ2V0Q3VycmVudFVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xuICAgICAgfSxcblxuICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldFBhZ2U6IGZ1bmN0aW9uKHBhZ2UsIHNpemUsIHRleHQsc3RhdHVzRmlsdGVycyxOb3RzdGF0dXNGaWx0ZXJzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHVzZXJzICsgXCI/XCIgKyAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgICAgcGFnZTogcGFnZSA/IHBhZ2UgOiAwLFxuICAgICAgICAgICAgICBzaXplOiBzaXplID8gc2l6ZSA6IDIwLFxuICAgICAgICAgICAgICBzdGF0dXNGaWx0ZXJzOiBzdGF0dXNGaWx0ZXJzID8gc3RhdHVzRmlsdGVycyA6IHt9LFxuICAgICAgICAgICAgICBOb3RzdGF0dXNGaWx0ZXJzOiBOb3RzdGF0dXNGaWx0ZXJzID8gTm90c3RhdHVzRmlsdGVycyA6IHt9XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9LFxuXG4gICAgICB1cGxvYWRDVjogZnVuY3Rpb24gKGlkLCBmaWxlcykge1xuICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgXG4gICAgICAgIC8vVGFrZSB0aGUgZmlyc3Qgc2VsZWN0ZWQgZmlsZVxuICAgICAgICBmZC5hcHBlbmQoXCJmaWxlXCIsIGZpbGVzWzBdLCdjdi5wZGYnKTtcblxuICAgICAgICAvL0VSUk9SIGhlcmUgLi4uIG5vdCBwYXNzaW5nIGZpbGUgdG8gZmRcblxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL3VwbG9hZC9jdicsIGZkLCB7XG4gICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9LFxuICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHlcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVQcm9maWxlOiBmdW5jdGlvbihpZCwgcHJvZmlsZSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3Byb2ZpbGVcIiwge1xuICAgICAgICAgIHByb2ZpbGU6IHByb2ZpbGVcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVDb25maXJtYXRpb246IGZ1bmN0aW9uKGlkLCBjb25maXJtYXRpb24pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi9jb25maXJtXCIsIHtcbiAgICAgICAgICBjb25maXJtYXRpb246IGNvbmZpcm1hdGlvblxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZUFsbDogZnVuY3Rpb24oaWQsIHVzZXIpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi91cGRhdGVhbGxcIiwge1xuICAgICAgICAgIHVzZXI6IHVzZXJcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBkZWNsaW5lQWRtaXNzaW9uOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9kZWNsaW5lXCIpO1xuICAgICAgfSxcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gQWRtaW4gT25seVxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRTdGF0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwic3RhdHNcIik7XG4gICAgICB9LFxuXG4gICAgICBnZXRUZWFtU3RhdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInRlYW1TdGF0c1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZXN0YXRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJ1cGRhdGVzdGF0c1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvYWRtaXRcIik7XG4gICAgICB9LFxuICAgICAgcmVqZWN0VXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVqZWN0XCIpO1xuICAgICAgfSxcbiAgICAgIHNvZnRBZG1pdHRVc2VyOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9zb2Z0QWRtaXRcIik7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UaW1lOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVjb25maXJtYnlcIik7XG4gICAgICB9LFxuXG4gICAgICBzb2Z0UmVqZWN0VXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc29mdFJlamVjdFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmRCYXNpY01haWw6IGZ1bmN0aW9uKGlkICwgZW1haWwpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc2VuZEJhc2ljTWFpbFwiLEpTT04uc3RyaW5naWZ5KGVtYWlsKSk7XG4gICAgICB9LFxuXG4gICAgICBjaGVja0luOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9jaGVja2luXCIpO1xuICAgICAgfSxcblxuICAgICAgY2hlY2tPdXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2NoZWNrb3V0XCIpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlVXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZldXNlclwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZXRlYW1maWVsZDogZnVuY3Rpb24oaWQpIHsgICAgICAgIFxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmV0ZWFtZmllbGRcIik7XG4gICAgICB9LFxuXG4gICAgICBtYWtlQWRtaW46IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL21ha2VhZG1pblwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZUFkbWluOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVhZG1pblwiKTtcbiAgICAgIH0sXG5cbiAgICAgIG1hc3NSZWplY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJtYXNzUmVqZWN0XCIpO1xuICAgICAgfSxcblxuICAgICAgZ2V0UmVqZWN0aW9uQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInJlamVjdGlvbkNvdW50XCIpO1xuICAgICAgfSxcblxuICAgICAgZ2V0TGF0ZXJSZWplY3RlZENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJsYXRlclJlamVjdENvdW50XCIpO1xuICAgICAgfSxcblxuICAgICAgbWFzc1JlamVjdFJlc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJtYXNzUmVqZWN0UmVzdFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldFJlc3RSZWplY3Rpb25Db3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwicmVqZWN0aW9uQ291bnRSZXN0XCIpO1xuICAgICAgfSxcblxuICAgICAgcmVqZWN0OiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RcIik7XG4gICAgICB9LFxuXG4gICAgICBzZW5kTGFnZ2VyRW1haWxzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwic2VuZGxhZ2VtYWlsc1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmRSZWplY3RFbWFpbHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVqZWN0RW1haWxzXCIpO1xuICAgICAgfSxcblxuICAgICAgc2VuZFJlamVjdEVtYWlsc1Jlc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVqZWN0RW1haWxzUmVzdFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmRSZWplY3RFbWFpbDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVqZWN0RW1haWxcIik7XG4gICAgICB9LFxuXG4gICAgICBzZW5kUGFzc3dvcmRSZXNldEVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVzZXRFbWFpbFwiLCB7IGVtYWlsOiBlbWFpbCB9KTtcbiAgICAgIH0sXG5cblxuXG4gICAgfTtcbiAgfVxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ2FkbWluQ2hhbGxlbmdlQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJ2NoYWxsZW5nZScsXG4gICAgJ0NoYWxsZW5nZVNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIGNoYWxsZW5nZSwgQ2hhbGxlbmdlU2VydmljZSl7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRjaGFsbGVuZ2UgPSBjaGFsbGVuZ2UuZGF0YTtcbiAgICAgIFxuICAgICAgQ2hhbGxlbmdlU2VydmljZS5nZXRBbnN3ZXIoY2hhbGxlbmdlLmRhdGEuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlLmFuc3dlciA9IHJlc3BvbnNlLmRhdGEuYW5zd2VyO1xuICAgICAgfSk7XG5cbiAgICAgICRzY29wZS50b2dnbGVQYXNzd29yZCA9IGZ1bmN0aW9uICgpIHsgJHNjb3BlLnR5cGVQYXNzd29yZCA9ICEkc2NvcGUudHlwZVBhc3N3b3JkOyB9O1xuXG5cbiAgICAgICRzY29wZS51cGRhdGVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZSgkc2NvcGUuc2VsZWN0ZWRjaGFsbGVuZ2UuX2lkLCAkc2NvcGUuc2VsZWN0ZWRjaGFsbGVuZ2UpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNlbGVjdGVkY2hhbGxlbmdlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIkNoYWxsZW5nZSB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcbiAgICAgICAgICB9KTsgIFxuICAgICAgfTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmNvbnRyb2xsZXIoXCJhZG1pbkNoYWxsZW5nZXNDdHJsXCIsIFtcbiAgXCIkc2NvcGVcIixcbiAgXCIkc3RhdGVcIixcbiAgXCIkc3RhdGVQYXJhbXNcIixcbiAgXCJDaGFsbGVuZ2VTZXJ2aWNlXCIsXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIENoYWxsZW5nZVNlcnZpY2UpIHtcblxuICAgICRzY29wZS5jaGFsbGVuZ2VzID0gW107XG5cbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgQ2hhbGxlbmdlLlxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaFBhZ2UoKSB7XG4gICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldEFsbCgpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAkc2NvcGUuY2hhbGxlbmdlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZWZyZXNoUGFnZSgpO1xuXG4gICAgJHNjb3BlLmdvQ2hhbGxlbmdlID0gZnVuY3Rpb24oJGV2ZW50LCBjaGFsbGVuZ2UpIHtcblxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLmNoYWxsZW5nZVwiLCB7XG4gICAgICAgIGlkOiBjaGFsbGVuZ2UuX2lkXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY3JlYXRlQ2hhbGxlbmdlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHN3YWwoXCJXcml0ZSB0aGUgY2hhbGxlbmdlIHRpdGxlOlwiLCB7XG4gICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxuICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiR2l2ZSB0aGlzIGNoYWxsZW5nZSBhIHNleHkgbmFtZS4uXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXG4gICAgICB9KVxuICAgICAgLnRoZW4oKHRpdGxlKSA9PiB7IGlmICghdGl0bGUpIHtyZXR1cm47fVxuICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGNoYWxsZW5nZSBkZXNjcmlwdGlvbjpcIiwge1xuICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxuICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJEZXNjcmliZSB0aGlzIGNoYWxsZW5nZSBzbyB0aGF0IHBlb3BsZSBjYW4gZ2V0IHRoZSBpZGVhLi5cIix0eXBlOiBcInRleHRcIn0gfSxcbiAgICAgICAgICB9KVxuICAgICAgICAudGhlbigoZGVzY3JpcHRpb24pID0+IHsgaWYgKCFkZXNjcmlwdGlvbikge3JldHVybjt9XG4gICAgICAgICAgc3dhbChcIkVudGVyIHRoZSBjaGFsbGVuZ2UgZGVwZW5kZW5jeSAoTElOSyk6XCIsIHtcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxuICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vQ2hhbGxlbmdlNDIuemlwXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChkZXBlbmRlbmN5KSA9PiB7IGlmICghZGVwZW5kZW5jeSkge3JldHVybjt9XG4gICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGFuc3dlcjpcIiwge1xuICAgICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcbiAgICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcInNoaGhoIHRoaXMgc2kgc3VwZXIgc2VjcmV0IGJyb1wiLHR5cGU6IFwidGV4dFwifSB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4geyBpZiAoIWFuc3dlcikge3JldHVybjt9XG4gICAgICAgICAgICAgIHN3YWwoXCJFbnRlciB0aGUgbnVtYmVyIG9mIHBvaW50cyBmb3IgdGhpcyBjaGFsbGVuZ2U6XCIsIHtcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiUG9pbnRzIGF3YXJkZWQgdG8gY2hhbGxlbmdlIHNvbHZlcnNcIix0eXBlOiBcIm51bWJlclwifSB9LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC50aGVuKChwb2ludHMpID0+IHsgaWYgKCFwb2ludHMpIHtyZXR1cm47fVxuICBcbiAgICAgICAgICAgICAgICBjRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOnRpdGxlLFxuICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5OmRlcGVuZGVuY3ksXG4gICAgICAgICAgICAgICAgICBhbnN3ZXI6YW5zd2VyLFxuICAgICAgICAgICAgICAgICAgcG9pbnRzOnBvaW50cyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgQ2hhbGxlbmdlU2VydmljZS5jcmVhdGUoY0RhdGEpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlZnJlc2hQYWdlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKCRldmVudCwgY2hhbGxlbmdlLCBpbmRleCkge1xuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc3dhbCh7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2VwdDoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGVtXCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgY2hhbGxlbmdlLnRpdGxlICsgXCIhXCIsXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeWVzOiB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRoaXMgY2hhbGxlbmdlXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICB0ZXh0OiBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlLnJlbW92ZShjaGFsbGVuZ2UuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzY29wZS5jaGFsbGVuZ2VzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS50aXRsZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQuXCIsXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlZnJlc2hQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmNvbnRyb2xsZXIoXCJBZG1pbk1haWxDdHJsXCIsIFtcbiAgXCIkc2NvcGVcIixcbiAgXCIkc3RhdGVcIixcbiAgXCIkc3RhdGVQYXJhbXNcIixcbiAgXCJVc2VyU2VydmljZVwiLFxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSkge1xuICAgICRzY29wZS5wYWdlcyA9IFtdO1xuICAgICRzY29wZS51c2VycyA9IFtdO1xuXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXG5cblxuXG4gICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzdGF0ZVBhcmFtcy5xdWVyeSwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgJHNjb3BlLnVzZXJzPSByZXNwb25zZS5kYXRhLnVzZXJzO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNlbmRFbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZpbHRlcmVkVXNlcnMgPSAkc2NvcGUudXNlcnMuZmlsdGVyKFxuICAgICAgICB1ID0+IHUudmVyaWZpZWRcbiAgICApO1xuXG4gICAgICBpZiAoJHNjb3BlLnN0YXR1c0ZpbHRlcnMuY29tcGxldGVkUHJvZmlsZSkge1xuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlXG4gICAgICApfVxuXG4gICAgICBpZiAoJHNjb3BlLnN0YXR1c0ZpbHRlcnMuYWRtaXR0ZWQpIHtcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuYWRtaXR0ZWRcbiAgICAgICl9XG5cbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5jb25maXJtZWQpIHtcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY29uZmlybWVkXG4gICAgICApfVxuXG4gICAgICBpZiAoJHNjb3BlLnN0YXR1c0ZpbHRlcnMuZGVjbGluZWQpIHtcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuZGVjbGluZWRcbiAgICAgICl9XG5cbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5jaGVja2VkSW4pIHtcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY2hlY2tlZEluXG4gICAgICApfVxuXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIHNlbmQgdGhpcyBlbWFpbCB0byAke1xuICAgICAgICAgIGZpbHRlcmVkVXNlcnMubGVuZ3RoXG4gICAgICAgIH0gc2VsZWN0ZWQgdXNlcihzKS5gLFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCBzZW5kIHRoZSBlbWFpbHNcIl0sXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcbiAgICAgIH0pLnRoZW4od2lsbFNlbmQgPT4ge1xuICAgICAgICBlbWFpbCA9IHsgc3ViamVjdDokc2NvcGUuc3ViamVjdCAsIHRpdGxlOiRzY29wZS50aXRsZSwgYm9keTokc2NvcGUuYm9keSB9XG5cbiAgICAgICAgaWYgKHdpbGxTZW5kKSB7XG4gICAgICAgICAgaWYgKGZpbHRlcmVkVXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNlbmRCYXNpY01haWwodXNlci5pZCxlbWFpbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiU2VuZGluZyFcIixcbiAgICAgICAgICAgICAgYFNlbmRpbmcgZW1haWxzIHRvICR7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRVc2Vycy5sZW5ndGhcbiAgICAgICAgICAgICAgfSB1c2VycyFgLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIGFjY2VwdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmNvbnRyb2xsZXIoXCJhZG1pbk1hcmtldGluZ0N0cmxcIiwgW1xuICBcIiRzY29wZVwiLFxuICBcIiRzdGF0ZVwiLFxuICBcIiRzdGF0ZVBhcmFtc1wiLFxuICBcIk1hcmtldGluZ1NlcnZpY2VcIixcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTWFya2V0aW5nU2VydmljZSkge1xuXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXG5cblxuXG5cbiAgICAkc2NvcGUuY3JlYXRlVGVhbXMgPSBmdW5jdGlvbigpe1xuXG4gICAgICBpZiAoJHNjb3BlLmJvZHkgJiYgJHNjb3BlLmV2ZW50KXtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIGFkZCB0aGVzZSB0ZWFtcyBlbWFpbHMgdG8gdGhlIG1hcmtldGluZyBkYXRhYmFzZWAsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCBBZGQgdGVhbXNcIl0sXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0ZWFtcyA9ICRzY29wZS5ib2R5LnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xuICAgICAgICAgICAgICB0ZWFtRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBldmVudDokc2NvcGUuZXZlbnQsXG4gICAgICAgICAgICAgICAgbWVtYmVyczp0ZWFtLnJlcGxhY2UoJyAnLCcnKS5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgTWFya2V0aW5nU2VydmljZS5jcmVhdGVUZWFtKHRlYW1EYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3dhbChcIkFkZGVkXCIsIFwiVGVhbXMgYWRkZWQgdG8gZGF0YWJhc2UuXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICRzY29wZS5ib2R5PVwiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN3YWwoXCJFUlJPUiFcIiwgXCJBbGwgZmllbGRzIGFyZSByZXF1aXJlZC5cIiwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIFxuICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQWRtaW5TZXR0aW5nc0N0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzY2UnLFxuICAgICdTZXR0aW5nc1NlcnZpY2UnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc2NlLCBTZXR0aW5nc1NlcnZpY2UsVXNlclNlcnZpY2Upe1xuXG4gICAgICAkc2NvcGUuc2V0dGluZ3MgPSB7fTtcbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0UHVibGljU2V0dGluZ3MoKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiB1cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyl7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAvLyBGb3JtYXQgdGhlIGRhdGVzIGluIHNldHRpbmdzLlxuICAgICAgICBzZXR0aW5ncy50aW1lT3BlbiA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVPcGVuKTtcbiAgICAgICAgc2V0dGluZ3MudGltZUNsb3NlID0gbmV3IERhdGUoc2V0dGluZ3MudGltZUNsb3NlKTtcbiAgICAgICAgc2V0dGluZ3MudGltZUNvbmZpcm0gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ29uZmlybSk7XG4gICAgICAgIHNldHRpbmdzLnRpbWVTdGFydCA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVTdGFydCk7XG4gICAgICAgIHNldHRpbmdzLnRpbWVFbmQgPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lRW5kKTtcblxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIH1cblxuICAgICAgLy8gQWRkaXRpb25hbCBPcHRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS51cGRhdGVBbGxvd01pbm9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUFsbG93TWlub3JzKCRzY29wZS5zZXR0aW5ncy5hbGxvd01pbm9ycylcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMgPSByZXNwb25zZS5kYXRhLmFsbG93TWlub3JzO1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc1RleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMgP1xuICAgICAgICAgICAgICBcIk1pbm9ycyBhcmUgbm93IGFsbG93ZWQgdG8gcmVnaXN0ZXIuXCIgOlxuICAgICAgICAgICAgICBcIk1pbm9ycyBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgdG8gcmVnaXN0ZXIuXCJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBzdWNjZXNzVGV4dCwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gV2hpdGVsaXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0V2hpdGVsaXN0ZWRFbWFpbHMoKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IHJlc3BvbnNlLmRhdGEuam9pbihcIiwgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUudXBkYXRlV2hpdGVsaXN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIHN3YWwoJ1doaXRlbGlzdCB1cGRhdGVkLicpO1xuICAgICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gcmVzcG9uc2UuZGF0YS53aGl0ZWxpc3RlZEVtYWlscy5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgLy8gUmVnaXN0cmF0aW9uIFRpbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XG4gICAgICAgIGlmICghZGF0ZSl7XG4gICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xuICAgICAgICAgIFwiIFwiICsgZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzJdO1xuICAgICAgfTtcblxuICAgICAgLy8gVGFrZSBhIGRhdGUgYW5kIHJlbW92ZSB0aGUgc2Vjb25kcy5cbiAgICAgIGZ1bmN0aW9uIGNsZWFuRGF0ZShkYXRlKXtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxuICAgICAgICAgIGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICBkYXRlLmdldE1vbnRoKCksXG4gICAgICAgICAgZGF0ZS5nZXREYXRlKCksXG4gICAgICAgICAgZGF0ZS5nZXRIb3VycygpLFxuICAgICAgICAgIGRhdGUuZ2V0TWludXRlcygpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIENsZWFuIHRoZSBkYXRlcyBhbmQgdHVybiB0aGVtIHRvIG1zLlxuICAgICAgICB2YXIgb3BlbiA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZU9wZW4pLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIGNsb3NlID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ2xvc2UpLmdldFRpbWUoKTtcblxuICAgICAgICBpZiAob3BlbiA8IDAgfHwgY2xvc2UgPCAwIHx8IG9wZW4gPT09IHVuZGVmaW5lZCB8fCBjbG9zZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICByZXR1cm4gc3dhbCgnT29wcy4uLicsICdZb3UgbmVlZCB0byBlbnRlciB2YWxpZCB0aW1lcy4nLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BlbiA+PSBjbG9zZSl7XG4gICAgICAgICAgc3dhbCgnT29wcy4uLicsICdSZWdpc3RyYXRpb24gY2Fubm90IG9wZW4gYWZ0ZXIgaXQgY2xvc2VzLicsICdlcnJvcicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyhvcGVuLCBjbG9zZSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5TdWdnZXN0UmVnaXN0cmF0aW9uVGltZSA9IGZ1bmN0aW9uIChob3Vycykge1xuICAgICAgICAkc2NvcGUuc2V0dGluZ3MudGltZUNsb3NlID0gbmV3IERhdGUoIG1vbWVudCgkc2NvcGUuc2V0dGluZ3MudGltZU9wZW4pLmFkZChob3VycywgJ2gnKSlcbiAgICAgIH1cblxuICAgICAgLy8gRXZlbnQgU3RhcnQgVGltZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAkc2NvcGUudXBkYXRlRXZlbnRUaW1lcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIENsZWFuIHRoZSBkYXRlcyBhbmQgdHVybiB0aGVtIHRvIG1zLlxuICAgICAgICB2YXIgc3RhcnQgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVTdGFydCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgZW5kID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lRW5kKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPCAwIHx8IHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgZW5kID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgIHJldHVybiBzd2FsKCdPb3BzLi4uJywgJ1lvdSBuZWVkIHRvIGVudGVyIHZhbGlkIHRpbWVzLicsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydCA+PSBlbmQpe1xuICAgICAgICAgIHN3YWwoJ09vcHMuLi4nLCAnRXZlbnQgY2Fubm90IHN0YXJ0IGFmdGVyIGl0IGVuZHMuJywgJ2Vycm9yJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUV2ZW50VGltZXMoc3RhcnQsIGVuZClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkV2ZW50IFRpbWVzIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLlN1Z2dlc3RTdGFydFRpbWUgPSBmdW5jdGlvbiAoaG91cnMpIHtcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzLnRpbWVFbmQgPSBuZXcgRGF0ZSggbW9tZW50KCRzY29wZS5zZXR0aW5ncy50aW1lU3RhcnQpLmFkZChob3VycywgJ2gnKSlcbiAgICAgIH1cblxuICAgICAgLy8gQ29uZmlybWF0aW9uIFRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvblRpbWUgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY29uZmlybUJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ29uZmlybSkuZ2V0VGltZSgpO1xuXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UaW1lKGNvbmZpcm1CeSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIHN3YWwoXCJTb3VuZHMgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gRGF0ZSBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIFxuICAgICAgJHNjb3BlLlN1Z2dlc3RDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24gKGhvdXJzKSB7XG4gICAgICAgICRzY29wZS5zZXR0aW5ncy50aW1lQ29uZmlybSA9IG5ldyBEYXRlKCBtb21lbnQoJHNjb3BlLnNldHRpbmdzLnRpbWVTdGFydCkuc3VidHJhY3QoaG91cnMsICdoJykpXG4gICAgICB9XG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25Vc2VycyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBjb25maXJtQnkgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVDb25maXJtKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRpbWUoY29uZmlybUJ5KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgLy8gZ2V0IGFsbCB1c2VycyBzb2Z0IGFkbWl0dGVkIGFuZCB1cGRhdGUgY29uZmlybWF0aW9uIHRpbWUgZm9yZWFjaFxuXG4gICAgICAgICAgICBVc2VyU2VydmljZS5nZXRQYWdlKDAsIDAsIFwiXCIsIHtzb2Z0QWRtaXR0ZWQ6dHJ1ZX0pXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnVzZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2UudXBkYXRlQ29uZmlybWF0aW9uVGltZSh1c2VyLl9pZClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIC8vdXBkYXRlIGNvbmZpcm1hdGlvbiB0aW1lIGZvcmVhY2hcbiAgICAgICAgICAgICAgc3dhbChcIlNvdW5kcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBEYXRlIFVwZGF0ZWQgZm9yIGFsbCB1c2Vyc1wiLCBcInN1Y2Nlc3NcIik7ICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgLy8gQWNjZXB0YW5jZSAvIENvbmZpcm1hdGlvbiBUZXh0IC0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcblxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwodGV4dCkpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdhaXRsaXN0VGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLndhaXRsaXN0VGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVdhaXRsaXN0VGV4dCh0ZXh0KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIldhaXRsaXN0IFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS51cGRhdGVIb3N0U2Nob29sID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGhvc3RTY2hvb2wgPSAkc2NvcGUuc2V0dGluZ3MuaG9zdFNjaG9vbDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUhvc3RTY2hvb2woaG9zdFNjaG9vbClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJIb3N0IFNjaG9vbCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIFxuICAgICAgJHNjb3BlLnVwZGF0ZUFjY2VwdGFuY2VUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWNjZXB0YW5jZVRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVBY2NlcHRhbmNlVGV4dCh0ZXh0KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkFjY2VwdGFuY2UgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy5jb25maXJtYXRpb25UZXh0O1xuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGV4dCh0ZXh0KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfV0pO1xuIiwiXG5cbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuLmNvbnRyb2xsZXIoJ0FkbWluVGVhbUN0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnJHN0YXRlJyxcbiAgJyR0aW1lb3V0JyxcbiAgJ2N1cnJlbnRVc2VyJyxcbiAgJ3NldHRpbmdzJyxcbiAgJ1V0aWxzJyxcbiAgJ1VzZXJTZXJ2aWNlJyxcbiAgJ1RlYW1TZXJ2aWNlJyxcbiAgJ1RFQU0nLFxuICBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICR0aW1lb3V0LCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVGVhbVNlcnZpY2UsIFRFQU0pIHtcbiAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuIFxuICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG5cbiAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcblxuICAgIGZ1bmN0aW9uIGlzVGVhbU1lbWJlcih0ZWFtcywgVXNlcmlkKSB7XG4gICAgICB2YXIgdGVzdCA9IGZhbHNlO1xuICAgICAgdGVhbXMuZm9yRWFjaCh0ZWFtID0+IHtcbiAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgICAgICBpZiAobWVtYmVyLmlkID09IFVzZXJpZCkgdGVzdCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGVzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RNZW1iZXIobWVtYmVySWQpIHtcbiAgICAgIFVzZXJTZXJ2aWNlLmdldChtZW1iZXJJZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHVzZXIgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5saW5rZWRpblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RNZW1iZXIgPSBzZWxlY3RNZW1iZXI7XG5cblxuICAgICRzY29wZS5pc2pvaW5lZCA9IGZ1bmN0aW9uICh0ZWFtKSB7XG4gICAgICB2YXIgdGVzdCA9IGZhbHNlO1xuICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB0ZXN0ID0gdHJ1ZTtcbiAgICAgIH0pXG4gICAgICByZXR1cm4gdGVzdDtcbiAgICB9XG5cbiAgICBUZWFtU2VydmljZS5nZXRBbGwoKS50aGVuKHRlYW1zID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHRlYW1zLmRhdGEpO1xuXG4gICAgICAkc2NvcGUuaXNUZWFtQWRtaW4gPSBmYWxzZTtcbiAgICAgICRzY29wZS5pc1RlYW1NZW1iZXIgPSBmYWxzZTtcbiAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcbiAgICAgICAgdGVhbS5pc01heHRlYW0gPSBmYWxzZTtcblxuICAgICAgICBpZiAodGVhbS5tZW1iZXJzLmxlbmd0aCA+PSBTZXR0aW5ncy5tYXhUZWFtU2l6ZSkge1xuICAgICAgICAgIHRlYW0uaXNDb2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgICB0ZWFtLmlzTWF4dGVhbSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVhbS5tZW1iZXJzWzBdLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XG4gICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICAgICAgaWYgKGlzVGVhbU1lbWJlcih0ZWFtcy5kYXRhLCBtZW1iZXIuaWQpKSB7XG4gICAgICAgICAgICAgIG1lbWJlci51bmF2YWlsYWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyBtZW1iZXIudW5hdmFpbGFibGUgPSBmYWxzZSB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJHNjb3BlLnVzZXJBZG1pblRlYW0gPSB0ZWFtO1xuICAgICAgICAgICRzY29wZS5pc1RlYW1BZG1pbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLnVzZXJNZW1iZXJUZWFtID0gdGVhbTtcbiAgICAgICAgICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIFxuICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXMuZGF0YTtcblxuICAgIH0pO1xuXG5cbiAgICAkc2NvcGUuY3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdGVhbURhdGEgPSB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAkc2NvcGUubmV3VGVhbV9kZXNjcmlwdGlvbixcbiAgICAgICAgbWVtYmVyczogW3sgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6ICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwgfV0sXG4gICAgICAgIHNraWxsczogeyBjb2RlOiAkc2NvcGUuc2tpbGxjb2RlLCBkZXNpZ246ICRzY29wZS5za2lsbGRlc2lnbiwgaGFyZHdhcmU6ICRzY29wZS5za2lsbGhhcmR3YXJlLCBpZGVhOiAkc2NvcGUuc2tpbGxpZGVhIH0sXG4gICAgICAgIGlzQ29sb3NlZDogZmFsc2UsXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyh0ZWFtRGF0YSk7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsKTtcblxuICAgICAgVGVhbVNlcnZpY2UuY3JlYXRlKHRlYW1EYXRhKTtcbiAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUuU2hvd2NyZWF0ZVRlYW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuU2hvd05ld1RlYW1Gcm9tID0gdHJ1ZTtcbiAgICAgICRzY29wZS5za2lsbGNvZGUgPSB0cnVlXG4gICAgICAkc2NvcGUuc2tpbGxkZXNpZ24gPSB0cnVlXG4gICAgICAkc2NvcGUuc2tpbGxoYXJkd2FyZSA9IHRydWVcbiAgICAgICRzY29wZS5za2lsbGlkZWEgPSB0cnVlXG4gICAgICAkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsID0gXCJjb2RlXCJcbiAgICB9XG5cblxuICAgICRzY29wZS5TaG93Sm9pblRlYW0gPSBmdW5jdGlvbigpe1xuICAgICAgJHNjb3BlLlNob3dKb2luVGVhbUZyb20gPSB0cnVlOyAgXG4gICAgfVxuXG5cbiAgICAkc2NvcGUuam9pblRlYW1Db2RlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICB0ZWFtSUQgPSAkc2NvcGUubmV3VGVhbV9Db2RlO1xuICAgICAgbmV3VGVhbV9za2lsbD0gJHNjb3BlLm5ld1RlYW1fc2tpbGw7XG5cbiAgICAgIG5ld3VzZXI9IHtpZDpjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTpjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6bmV3VGVhbV9za2lsbH07XG4gICAgICBUZWFtU2VydmljZS5qb2luKHRlYW1JRCxuZXd1c2VyKTsgXG4gICAgICBzd2FsKFxuICAgICAgICBcIkpvaW5lZFwiLFxuICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcbiAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICk7ICBcbiAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiBcbiAgICB9XG4gICAgXG4gICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcblxuICAgICAgdmFyIHZhbHVlO1xuICAgICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgICBzZWxlY3QuY2xhc3NOYW1lID0gJ3NlbGVjdC1jdXN0b20nXG5cblxuICAgICAgdmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnU2VsZWN0IGEgc2tpbGwnO1xuICAgICAgb3B0aW9uLnZhbHVlID0gXCJjb2RlXCJcbiAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXG5cbiAgICAgIGlmICh0ZWFtLnNraWxscy5jb2RlKSB7XG4gICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0NvZGUnO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZWFtLnNraWxscy5kZXNpZ24pIHtcbiAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnRGVzaWduJztcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJkZXNpZ25cIlxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZWFtLnNraWxscy5oYXJkd2FyZSkge1xuICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdIYXJkd2FyZSc7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaGFyZHdhcmVcIlxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZWFtLnNraWxscy5pZGVhKSB7XG4gICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0lkZWEnO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBcImlkZWFcIlxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIH1cblxuICAgICAgc2VsZWN0Lm9uY2hhbmdlID0gZnVuY3Rpb24gc2VsZWN0Q2hhbmdlZChlKSB7XG4gICAgICAgIHZhbHVlID0gZS50YXJnZXQudmFsdWVcbiAgICAgIH1cblxuICAgICAgc3dhbCh7XG4gICAgICAgIHRpdGxlOiBcIlBsZWFzZSBzZWxlY3QgeW91ciBza2lsbCB0byBqb2luXCIsXG5cbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIGVsZW1lbnQ6IHNlbGVjdCxcbiAgICAgICAgfVxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgbmV3dXNlciA9IHsgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6IHZhbHVlIH07XG4gICAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbS5faWQsIG5ld3VzZXIpO1xuICAgICAgICBzd2FsKFxuICAgICAgICAgIFwiSm9pbmVkXCIsXG4gICAgICAgICAgXCJZb3UgaGF2ZSBhcHBsaWNlZCB0byBqb2luIHRoaXMgdGVhbSwgd2FpdCBmb3IgdGhlIFRlYW0tQWRtaW4gdG8gYWNjZXB0IHlvdXIgYXBwbGljYXRpb24uXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgKTtcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgfSlcbiAgICB9XG5cblxuICAgICRzY29wZS5hY2NlcHRNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgbWVtYmVyLm5hbWUgKyBcIiB0byB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbCBhbmQgd2lsbCBzaG93IGluIHRoZSBwdWJsaWMgdGVhbXMgcGFnZS5cIixcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBsZXQgaGltIGluXCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFRlYW1TZXJ2aWNlLmFjY2VwdE1lbWJlcih0ZWFtSUQsIG1lbWJlciwgU2V0dGluZ3MubWF4VGVhbVNpemUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZSA9PSBcIm1heFRlYW1TaXplXCIpIHtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiRXJyb3JcIixcbiAgICAgICAgICAgICAgXCJNYXhpbXVtIG51bWJlciBvZiBtZW1iZXJzIChcIiArIFNldHRpbmdzLm1heFRlYW1TaXplICsgXCIpIHJlYWNoZWRcIixcbiAgICAgICAgICAgICAgXCJlcnJvclwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XG4gICAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRlZFwiLFxuICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gYWNjZXB0ZWQgdG8geW91ciB0ZWFtLlwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cblxuXG4gICAgJHNjb3BlLnJlZnVzZU1lbWJlciA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVmdXNlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlZnVzZSBoaW1cIixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBtZW1iZXIpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICBcIlJlZnVzZWRcIixcbiAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVmdXNlZCBmcm9tIHlvdXIgdGVhbS5cIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUucmVtb3ZlTWVtYmVyZnJvbVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XG4gICAgICBzd2FsKHtcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlbW92ZSBcIiArIG1lbWJlci5uYW1lICsgXCIgZnJvbSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtSUQsIGluZGV4LCBtZW1iZXIuaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZSA9PSBcInJlbW92aW5nQWRtaW5cIikge1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJFcnJvclwiLFxuICAgICAgICAgICAgICBcIllvdSBjYW4ndCByZW1vdmUgdGhlIFRlYW0gQWRtaW4sIEJ1dCB5b3UgY2FuIGNsb3NlIHRoZSB0ZWFtLlwiLFxuICAgICAgICAgICAgICBcImVycm9yXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UyID0+IHtcbiAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcbiAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB5b3VyIHRlYW0uXCIsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICAkc2NvcGUucmVtb3ZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XG4gICAgICBzd2FsKHtcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlbW92ZSB0aGlzIHRlYW0gd2l0aCBhbGwgaXQncyBtZW1iZXJzISBUaGlzIHdpbGwgc2VuZCB0aGVtIGEgbm90aWZpY2F0aW9uIGVtYWlsLiBZb3UgbmVlZCB0byBmaW5kIGFub3RoZXIgdGVhbSB0byB3b3JrIHdpdGguXCIsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRlYW1cIixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlbWFpbCA9IHtcbiAgICAgICAgICBzdWJqZWN0OiBcIllvdXIgdGVhbSBoYXMgYmVlbiByZW1vdmVkXCIsXG4gICAgICAgICAgdGl0bGU6IFwiVGltZSBmb3IgYSBiYWNrdXAgcGxhblwiLFxuICAgICAgICAgIGJvZHk6IFwiVGhlIHRlYW0geW91IGhhdmUgYmVlbiBwYXJ0IChNZW1iZXIvcmVxdWVzdGVkIHRvIGpvaW4pIG9mIGhhcyBiZWVuIHJlbW92ZWQuIFBsZWFzZSBjaGVjayB5b3VyIGRhc2hib2FyZCBhbmQgdHJ5IHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aCBiZWZvcmUgdGhlIGhhY2thdGhvbiBzdGFydHMuXCJcbiAgICAgICAgfVxuXG4gICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZSh0ZWFtLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsIGVtYWlsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKHVzZXIgPT4ge1xuICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgXCJSZW1vdmVkXCIsXG4gICAgICAgICAgICBcIlRlYW0gaGFzIGJlZW4gcmVtb3ZlZC5cIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUubGVhdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gbGVhdmUgeW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCB0aGUgYWRtaW4gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIGhpbVwiLFxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtLl9pZCwgaW5kZXgpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxuICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxlZnQgdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfVxuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG5cblxuICAgICRzY29wZS5jYW5jZWxqb2luVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XG4gICAgICBzd2FsKHtcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNhbmNlbCB5b3VyIHJlcXVlc3QgdG8gam9pbiB0aGlzIHRlYW0hXCIsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBDYW5jZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluZGV4ID0gMDtcblxuICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xuICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtLl9pZCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcbiAgICAgICAgICAgICAgICBcIllvdSBoYXZlIHN1Y2Nlc3NmdWxseSBjYW5jZWxlZCB5b3UgcmVxdWVzdCB0byBqb2luIHRoaXMgdGVhbS4gUGxlYXNlIGZpbmQgYW5vdGhlciB0ZWFtIG9yIGNyZWF0ZSB5b3VyIG93bi5cIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH1cbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUudG9nZ2xlQ2xvc2VUZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcbiAgICAgICAgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBDbG9zZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIlxuICAgICAgfSBlbHNlIHsgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byByZW9wZW4gdGhpcyB0ZWFtLiBUaGlzIHdpbGwgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIiB9XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBUZWFtU2VydmljZS50b2dnbGVDbG9zZVRlYW0odGVhbUlELCBzdGF0dXMpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICBcIkRvbmVcIixcbiAgICAgICAgICAgIFwiT3BlcmF0aW9uIHN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICk7XG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICAkc2NvcGUudG9nZ2xlSGlkZVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gdHJ1ZSkge1xuICAgICAgICB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIEhpZGUgdGhpcyB0ZWFtLiBUaGlzIHdvbid0IGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIlxuICAgICAgfSBlbHNlIHsgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBTaG93IHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIiB9XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBUZWFtU2VydmljZS50b2dnbGVIaWRlVGVhbSh0ZWFtSUQsIHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgc3dhbChcbiAgICAgICAgICAgIFwiRG9uZVwiLFxuICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLiR3YXRjaChcInF1ZXJ5VGV4dFwiLCBmdW5jdGlvbiAocXVlcnlUZXh0KSB7XG4gICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKHF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXG4gICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmFwcGx5c2tpbGxzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgVGVhbVNlcnZpY2UuZ2V0U2VsZWN0ZWRUZWFtcygkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfTtcblxuXG5cblxuXG4gIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKSAuY29uZmlnKFsnQ2hhcnRKc1Byb3ZpZGVyJywgZnVuY3Rpb24gKENoYXJ0SnNQcm92aWRlcikge1xuICAvLyBDb25maWd1cmUgYWxsIGNoYXJ0c1xuICBDaGFydEpzUHJvdmlkZXIuc2V0T3B0aW9ucyh7XG4gICAgY2hhcnRDb2xvcnM6IFsnIzlCNjZGRScsICcjRkY2NDg0JywgJyNGRUEwM0YnLCAnI0ZCRDA0RCcsICcjNERCRkMwJywgJyMzM0EzRUYnLCAnI0NBQ0JDRiddLFxuICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgfSk7XG59XSlcbi5jb250cm9sbGVyKCdBZG1pblN0YXRzQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgIFwiJHN0YXRlXCIsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVXNlclNlcnZpY2Upe1xuICAgICAgXG5cblxuICAgICAgdmFyIHRpbWVGb3JtYXQgPSAnTU0vREQvWVlZWSc7XG5cblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgIC5nZXRBbGwoKVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICB2YXIgdXNlcnMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICB2YXIgcmVzdWx0PVsgW10sW10gXTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIG5ld0RhdGUoRGF5KSB7XG4gICAgICAgICAgcmV0dXJuIG1vbWVudChEYXkpLnRvRGF0ZSgpO1xuICAgICAgICB9IFxuICBcblxuICAgICAgICB1c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xuXG4gICAgICAgICAgaWYgKHJlc3VsdFswXS5pbmNsdWRlcyhtb21lbnQodXNlci50aW1lc3RhbXApLmZvcm1hdCh0aW1lRm9ybWF0KSkpe1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmVzdWx0WzBdLmluZGV4T2YobW9tZW50KHVzZXIudGltZXN0YW1wKS5mb3JtYXQodGltZUZvcm1hdCkpXG4gICAgICAgICAgICByZXN1bHRbMV1baW5kZXhdKytcblxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmVzdWx0WzBdLnB1c2gobW9tZW50KHVzZXIudGltZXN0YW1wKS5mb3JtYXQodGltZUZvcm1hdCkpXG4gICAgICAgICAgICByZXN1bHRbMV0ucHVzaCgxKVxuICAgICAgICAgIH1cblxuXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG5cbiAgICAgICAgJHNjb3BlLmFwcGxpY2FudHMgPSB7XG4gICAgICAgICAgbGFiZWxzIDogcmVzdWx0WzBdLFxuICAgICAgICAgIHNlcmllcyA6IFsnQXBwbGljYXRpb24gVGltZWxpbmUnXSxcbiAgICAgICAgICBkYXRhIDogcmVzdWx0WzFdLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhdGlvbnMgdGltZWxpbmUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NhbGVzOiB7XG4gICAgICAgICAgICAgIHhBeGVzOiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6ICd0aW1lJyxcbiAgICAgICAgICAgICAgICB0aW1lOiB7XG4gICAgICAgICAgICAgICAgICBmb3JtYXQ6IHRpbWVGb3JtYXQsXG4gICAgICAgICAgICAgICAgICAvLyByb3VuZDogJ2RheSdcbiAgICAgICAgICAgICAgICAgIHRvb2x0aXBGb3JtYXQ6ICdsbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogJ0RhdGUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiAnQXBwbGljYW50cyBudW1iZXIgJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICB9KVxuXG5cbiAgICAgICRzY29wZS5wb3B1bGF0aW9uID0ge1xuICAgICAgICBsYWJlbHMgOiBbXCJFYXRpbmdcIiwgXCJEcmlua2luZ1wiLCBcIlNsZWVwaW5nXCIsIFwiRGVzaWduaW5nXCIsIFwiQ29kaW5nXCIsIFwiQ3ljbGluZ1wiLCBcIlJ1bm5pbmdcIl0sXG4gICAgICAgIHNlcmllcyA6IFsnQXBwbGljYXRpb24gVGltZWxpbmUnXSxcbiAgICAgICAgZGF0YSA6IFtcbiAgICAgICAgICBbNjUsIDU5LCA5MCwgODEsIDU2LCA1NSwgNDBdLFxuICAgICAgICAgIFstMjgsIC00OCwgLTQwLCAtMTksIC02NywgLTI3LCAtOTBdXG4gICAgICAgIF0sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhdGlvbnMgdGltZWxpbmUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzY2FsZXM6IHtcblx0XHRcdFx0XHRcdHhBeGVzOiBbe1xuXHRcdFx0XHRcdFx0XHRzdGFja2VkOiB0cnVlLFxuXHRcdFx0XHRcdFx0fV0sXG5cdFx0XHRcdFx0XHR5QXhlczogW3tcbiAgICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgdGlja0Zvcm1hdDogZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQzLmZvcm1hdCgnLGYnKShNYXRoLmFicyhkKSk7ICAgLy8gVXNlIE1hdGguYWJzKCkgdG8gZ2V0IHRoZSBhYnNvbHV0ZSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICBcblx0XHRcdFx0XHRcdH1dXG5cdFx0XHRcdFx0fSxcbiAgICAgICAgfVxuICAgICAgIH1cblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFN0YXRzKClcbiAgICAgICAgLnRoZW4oc3RhdHMgPT4ge1xuICAgICAgICAgICRzY29wZS5zdGF0cyA9IHN0YXRzLmRhdGE7IFxuXG4gICAgICAgICAgLy8gTWVhbHMgXG4gICAgICAgICAgbGFiZWxzPVtdXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0cy5kYXRhLmxpdmUubWVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGFiZWxzLnB1c2goJ01lYWwgJysoaSsxKSkgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1lYWxzID0geyBcbiAgICAgICAgICAgIGxhYmVscyA6IGxhYmVscyxcbiAgICAgICAgICAgIHNlcmllcyA6IFsnTWVhbHMnXSxcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLmxpdmUubWVhbCxcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7XG4gICAgICAgICAgICAgIFwic2NhbGVzXCI6e1xuICAgICAgICAgICAgICAgIFwieEF4ZXNcIjpbe1widGlja3NcIjp7YmVnaW5BdFplcm86dHJ1ZSxtYXg6c3RhdHMuZGF0YS50b3RhbH19XVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDogJ01lYWxzIENvbnN1bWVkJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgLy8gV29ya3Nob3BzIFxuICAgICAgICAgIGxhYmVscz1bXVxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdHMuZGF0YS5saXZlLndvcmtzaG9wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsYWJlbHMucHVzaCgnV29ya3Nob3AgJysoaSsxKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkc2NvcGUud29ya3Nob3BzID0geyBcbiAgICAgICAgICAgIGxhYmVscyA6IGxhYmVscyxcbiAgICAgICAgICAgIHNlcmllcyA6IFsnV29ya3Nob3BzJ10sXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5saXZlLndvcmtzaG9wLFxuICAgICAgICAgICAgb3B0aW9uczp7XG4gICAgICAgICAgICAgIGVsZW1lbnRzOiB7XG4gICAgICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDAuNSwgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdXb3Jrc2hvcHMgYXR0ZW5kYW5jZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjbHVic1xuICAgICAgICAgICRzY29wZS5jbHVicyA9IHtcbiAgICAgICAgICAgIGxhYmVscyA6IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzTGFiZWxzLFxuICAgICAgICAgICAgc2VyaWVzIDogWydDbHVicyddLFxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzLFxuICAgICAgICAgICAgb3B0aW9uczp7XG4gICAgICAgICAgICAgIGVsZW1lbnRzOiB7XG4gICAgICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDAuNSwgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhbnRzIHZpYSBDbHVicydcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuXG4gICAgICAgICAgIC8vIEdldCB0aGUgbW9zdCBhY3RpdmUgY2x1YlxuICAgICAgICAgICB2YXIgYXJyID1zdGF0cy5kYXRhLnNvdXJjZS5jbHVic1xuICAgICAgICAgICB2YXIgbWF4ID0gYXJyWzBdO1xuICAgICAgICAgICB2YXIgbWF4SW5kZXggPSAwO1xuICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgaWYgKGFycltpXSA+IG1heCkge1xuICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICBtYXggPSBhcnJbaV07XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cblxuICAgICAgICAgICAkc2NvcGUuZmlyc3RDbHViID0gc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnNMYWJlbHNbbWF4SW5kZXhdXG5cbiAgICAgICBcblxuXG4gICAgICAgICAgLy8gc291cmNlcyBcbiAgICAgICAgICAkc2NvcGUuc291cmNlID0ge1xuICAgICAgICAgICAgbGFiZWxzIDogWydGYWNlYm9vaycsJ0VtYWlsJywnQ2x1YnMnXSxcbiAgICAgICAgICAgIHNlcmllcyA6IFsnU291cmNlcyddLFxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEuc291cmNlLmdlbmVyYWwsXG4gICAgICAgICAgICBvcHRpb25zOntcbiAgICAgICAgICAgICAgZWxlbWVudHM6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDogJ0FwcGxpY2FudHMgc291cmNlcydcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pOyAgXG5cblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFRlYW1TdGF0cygpXG4gICAgICAgIC50aGVuKHRlYW1zdGF0cyA9PiB7XG4gICAgICAgICAgJHNjb3BlLnRlYW1zdGF0cyA9IHRlYW1zdGF0cy5kYXRhOyBcbiAgICAgICAgfSk7ICBcblxuXG4gICAgICAkc2NvcGUuZnJvbU5vdyA9IGZ1bmN0aW9uKGRhdGUpe1xuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmxvY2FsZSgnZW4nKS5mcm9tTm93KCk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlc3RhdHMgPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZS51cGRhdGVzdGF0cygpXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgIH07XG5cbiAgICAgIENoYXJ0LmRlZmF1bHRzLmdsb2JhbC5jb2xvcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDUyLCAxNTIsIDIxOSwgMC41KScsXG4gICAgICAgICAgcG9pbnRCYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDUyLCAxNTIsIDIxOSwgMC41KScsXG4gICAgICAgICAgcG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcjogJ3JnYmEoMTUxLDE4NywyMDUsMC41KScsXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICdyZ2JhKDAsMCwwLDAnLFxuICAgICAgICAgIHBvaW50Qm9yZGVyQ29sb3I6ICcjZmZmJyxcbiAgICAgICAgICBwb2ludEhvdmVyQm9yZGVyQ29sb3I6ICdyZ2JhKDE1MSwxODcsMjA1LDAuNSknXG4gICAgICAgIH1cbiAgICAgIF0gICAgICAgIFxuXG5cbiAgICAgICRzY29wZS5zZW5kTGFnZ2VyRW1haWxzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgIHRleHQ6IFwiVGhpcyB3aWxsIHNlbmQgYW4gZW1haWwgdG8gZXZlcnkgdXNlciB3aG8gaGFzIG5vdCBzdWJtaXR0ZWQgYW4gYXBwbGljYXRpb24uIEFyZSB5b3Ugc3VyZT8uXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgc2VuZC5cIixcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgLnNlbmRMYWdnZXJFbWFpbHMoKVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWxzIGhhdmUgYmVlbiBzZW50LicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VuZFJlamVjdEVtYWlscyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICB0ZXh0OiBcIlRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHRvIGV2ZXJ5IHVzZXIgd2hvIGhhcyBiZWVuIHJlamVjdGVkLiBBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgc2VuZC5cIixcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgLnNlbmRSZWplY3RFbWFpbHMoKVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWxzIGhhdmUgYmVlbiBzZW50LicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VuZFJlamVjdEVtYWlsc1Jlc3QgPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5nZXRMYXRlclJlamVjdGVkQ291bnQoKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgICAgICB0ZXh0OiBgVGhpcyB3aWxsIHNlbmQgcmVqZWN0aW9uIGVtYWlsIHRvICR7Y291bnR9IHVzZXJzLmAsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHJlamVjdC5cIixcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5zZW5kUmVqZWN0RW1haWxzUmVzdCgpXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlscyBoYXZlIGJlZW4gc2VudC4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5tYXNzUmVqZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLmdldFJlamVjdGlvbkNvdW50KClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihjb3VudCkge1xuICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICAgICAgdGV4dDogYFRoaXMgd2lsbCByZWplY3QgJHtjb3VudH0gdXNlcnMuYCxcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgcmVqZWN0LlwiLFxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICBcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgICAgICAgLm1hc3NSZWplY3QoKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnTWFzcyBSZWplY3Rpb24gc3VjY2Vzc2Z1bC4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLm1hc3NSZWplY3RSZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLmdldFJlc3RSZWplY3Rpb25Db3VudCgpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY291bnQpIHtcbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgIHRleHQ6IGBUaGlzIHdpbGwgcmVqZWN0ICR7Y291bnR9IHVzZXJzLmAsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHJlamVjdC5cIixcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5tYXNzUmVqZWN0UmVzdCgpXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdNYXNzIFJlamVjdGlvbiBzdWNjZXNzZnVsLicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuXG5cblxuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAndXNlcicsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBVc2VyLCBVc2VyU2VydmljZSl7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gVXNlci5kYXRhO1xuXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2Nob29sIGRyb3Bkb3duXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcblxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCl7XG5cbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuc2VsZWN0ZWRVc2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XG5cbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XG4gICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIucHJvZmlsZS5zY2hvb2wgPSBzY2hvb2xzW2VtYWlsXS5zY2hvb2w7XG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS51cGRhdGVQcm9maWxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZSgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiUHJvZmlsZSB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cblxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbigkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5jb25maXJtYXRpb24pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJDb25maXJtYXRpb24gdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG5cbiAgICAgICRzY29wZS51cGRhdGVBbGxVc2VyID0gZnVuY3Rpb24oKXtcblxuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVBbGwoJHNjb3BlLnNlbGVjdGVkVXNlci5faWQsICRzY29wZS5zZWxlY3RlZFVzZXIpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJBTEwgUHJvZmlsZSB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcbiAgICAgICAgICB9KTsgIFxuICAgICAgfTtcblxuXG5cblxuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluVXNlcnNDdHJsXCIsIFtcbiAgXCIkc2NvcGVcIixcbiAgXCIkc3RhdGVcIixcbiAgXCIkc3RhdGVQYXJhbXNcIixcbiAgXCJVc2VyU2VydmljZVwiLFxuICAnQXV0aFNlcnZpY2UnLFxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSwgQXV0aFNlcnZpY2UpIHtcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcblxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB7fTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7XG4gICAgICBzdGF0dXM6IFwiXCIsXG4gICAgICBjb25maXJtYXRpb246IHtcbiAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uczogW11cbiAgICAgIH0sXG4gICAgICBwcm9maWxlOiBcIlwiXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpIHtcbiAgICAgICRzY29wZS51c2VycyA9IGRhdGEudXNlcnM7XG4gICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XG4gICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XG5cbiAgICAgIHZhciBwID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKSB7XG4gICAgICAgIHAucHVzaChpKTtcbiAgICAgIH1cbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2Vyc1wiLCB7XG4gICAgICAgIHBhZ2U6IDAsXG4gICAgICAgIHNpemU6ICRzdGF0ZVBhcmFtcy5zaXplIHx8IDIwXG4gICAgICB9KTtcbiAgICAgICRzY29wZS5wYWdlcyA9IHA7XG4gICAgfVxuXG4gICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzdGF0ZVBhcmFtcy5xdWVyeSwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG4gICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiR3YXRjaChcInF1ZXJ5VGV4dFwiLCBmdW5jdGlvbihxdWVyeVRleHQpIHtcbiAgICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCBxdWVyeVRleHQsICRzY29wZS5zdGF0dXNGaWx0ZXJzKS50aGVuKFxuICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcblxuXG4gICAgJHNjb3BlLmFwcGx5U3RhdHVzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycywkc2NvcGUuTm90c3RhdHVzRmlsdGVycykudGhlbihcbiAgICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAkc3RhdGUuZ28oXCJhcHAuYWRtaW4udXNlcnNcIiwge1xuICAgICAgICBwYWdlOiBwYWdlLFxuICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCAyMFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5nb1VzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIpIHtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJcIiwge1xuICAgICAgICBpZDogdXNlci5faWRcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgICRzY29wZS5hY2NlcHRVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc3dhbCh7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2VwdDoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIGFjY2VwdCB0aGVtXCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeWVzOiB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgYWNjZXB0IHRoaXMgdXNlclwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgIFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBhY2NlcHRlZCB0aGlzIHVzZXIuIFwiICtcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBVc2VyU2VydmljZS5zb2Z0QWRtaXR0VXNlcih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiQWNjZXB0ZWRcIixcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBhZG1pdHRlZC5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgICAkc2NvcGUucmVqZWN0dFVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzd2FsKHtcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWNjZXB0OiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVqZWN0IHRoZW1cIixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZWplY3QgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHllczoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlamVjdCB0aGlzIHVzZXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgcmVqZWN0ZWQgdGhpcyB1c2VyLiBcIiArXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgVXNlclNlcnZpY2Uuc29mdFJlamVjdFVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICBcIlJlamVjdGVkXCIsXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gcmVqZWN0ZWQuXCIsXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG5cbiAgICAkc2NvcGUucmVtb3ZlVXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXG4gICAgICBzd2FsKHtcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWNjZXB0OiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRoZW1cIixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHllczoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGlzIHVzZXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgcmVtb3ZlZCB0aGlzIHVzZXIuIFwiICtcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZVVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlbmRBY2NlcHRhbmNlRW1haWxzID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmaWx0ZXJTb2Z0QWNjZXB0ZWQgPSAkc2NvcGUudXNlcnMuZmlsdGVyKFxuICAgICAgICB1ID0+IHUuc3RhdHVzLnNvZnRBZG1pdHRlZCAmJiAhdS5zdGF0dXMuYWRtaXR0ZWRcbiAgICAgICk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcblxuICAgICAgc3dhbCh7XG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCBhY2NlcHRhbmNlIGVtYWlscyAoYW5kIGFjY2VwdCkgJHtcbiAgICAgICAgICBmaWx0ZXJTb2Z0QWNjZXB0ZWQubGVuZ3RoXG4gICAgICAgIH0gdXNlcihzKS5gLFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCBhY2NlcHQgdGhlbSBhbmQgc2VuZCB0aGUgZW1haWxzXCJdLFxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlXG4gICAgICB9KS50aGVuKHdpbGxTZW5kID0+IHtcbiAgICAgICAgaWYgKHdpbGxTZW5kKSB7XG4gICAgICAgICAgaWYgKGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZpbHRlclNvZnRBY2NlcHRlZC5mb3JFYWNoKHVzZXIgPT4ge1xuICAgICAgICAgICAgICBVc2VyU2VydmljZS5hZG1pdFVzZXIodXNlci5faWQpOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxuICAgICAgICAgICAgICBgQWNjZXB0aW5nIGFuZCBzZW5kaW5nIGVtYWlscyB0byAke1xuICAgICAgICAgICAgICAgIGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGhcbiAgICAgICAgICAgICAgfSB1c2VycyFgLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIGFjY2VwdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgICAkc2NvcGUuc2VuZFJlamVjdGlvbkVtYWlscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmlsdGVyU29mdFJlamVjdGVkID0gJHNjb3BlLnVzZXJzLmZpbHRlcihcbiAgICAgICAgdSA9PiB1LnN0YXR1cy5zb2Z0UmVqZWN0ZWRcbiAgICAgICk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcblxuICAgICAgc3dhbCh7XG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCByZWplY3Rpb24gZW1haWxzIChhbmQgcmVqZWN0KSAke1xuICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5sZW5ndGhcbiAgICAgICAgfSB1c2VyKHMpLmAsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIHJlamVjdCB0aGVtIGFuZCBzZW5kIHRoZSBlbWFpbHNcIl0sXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcbiAgICAgIH0pLnRoZW4od2lsbFNlbmQgPT4ge1xuICAgICAgICBpZiAod2lsbFNlbmQpIHtcbiAgICAgICAgICBpZiAoZmlsdGVyU29mdFJlamVjdGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgZmlsdGVyU29mdFJlamVjdGVkLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlamVjdFVzZXIodXNlci5faWQpOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxuICAgICAgICAgICAgICBgUmVqZWN0aW5nIGFuZCBzZW5kaW5nIGVtYWlscyB0byAke1xuICAgICAgICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5sZW5ndGhcbiAgICAgICAgICAgICAgfSB1c2VycyFgLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIHJlamVjdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgJHNjb3BlLmV4cG9ydFVzZXJzID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBjb2x1bW5zID0gW1wiTsKwXCIsIFwiR2VuZGVyXCIsIFwiRnVsbCBOYW1lXCIsXCJTY2hvb2xcIl07XG4gICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgVXNlclNlcnZpY2UuZ2V0QWxsKCkudGhlbih1c2VycyA9PiB7XG4gICAgICAgIHZhciBpPTE7XG4gICAgICAgIHVzZXJzLmRhdGEuZm9yRWFjaCh1c2VyID0+IHtcbiAgICAgICAgICByb3dzLnB1c2goW2krKyx1c2VyLnByb2ZpbGUuZ2VuZGVyLHVzZXIucHJvZmlsZS5uYW1lLHVzZXIucHJvZmlsZS5zY2hvb2xdKVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGRvYyA9IG5ldyBqc1BERigncCcsICdwdCcpO1xuXG5cbiAgICAgICAgdmFyIHRvdGFsUGFnZXNFeHAgPSBcInt0b3RhbF9wYWdlc19jb3VudF9zdHJpbmd9XCI7XG5cbiAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhFQURFUlxuICAgICAgICAgICAgZG9jLnNldEZvbnRTaXplKDIwKTtcbiAgICAgICAgICAgIGRvYy5zZXRUZXh0Q29sb3IoNDApO1xuICAgICAgICAgICAgZG9jLnNldEZvbnRTdHlsZSgnbm9ybWFsJyk7XG4gICAgICAgICAgICAvLyBpZiAoYmFzZTY0SW1nKSB7XG4gICAgICAgICAgICAvLyAgICAgZG9jLmFkZEltYWdlKGJhc2U2NEltZywgJ0pQRUcnLCBkYXRhLnNldHRpbmdzLm1hcmdpbi5sZWZ0LCAxNSwgMTAsIDEwKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGRvYy50ZXh0KFwiUGFydGljaXBhbnRzIExpc3RcIiwgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCArIDE1LCAyMik7XG4gICAgXG4gICAgICAgICAgICAvLyBGT09URVJcbiAgICAgICAgICAgIHZhciBzdHIgPSBcIlBhZ2UgXCIgKyBkYXRhLnBhZ2VDb3VudDtcbiAgICAgICAgICAgIC8vIFRvdGFsIHBhZ2UgbnVtYmVyIHBsdWdpbiBvbmx5IGF2YWlsYWJsZSBpbiBqc3BkZiB2MS4wK1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2MucHV0VG90YWxQYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIFwiIG9mIFwiICsgdG90YWxQYWdlc0V4cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvYy5zZXRGb250U2l6ZSgxMCk7XG4gICAgICAgICAgICB2YXIgcGFnZUhlaWdodCA9IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5oZWlnaHQgfHwgZG9jLmludGVybmFsLnBhZ2VTaXplLmdldEhlaWdodCgpO1xuICAgICAgICAgICAgZG9jLnRleHQoc3RyLCBkYXRhLnNldHRpbmdzLm1hcmdpbi5sZWZ0LCBwYWdlSGVpZ2h0ICAtIDEwKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGRvYy5hdXRvVGFibGUoY29sdW1ucywgcm93cywge1xuICAgICAgICAgICAgYWRkUGFnZUNvbnRlbnQ6IHBhZ2VDb250ZW50LFxuICAgICAgICAgICAgbWFyZ2luOiB7dG9wOiAzMH0sXG4gICAgICAgICAgICB0aGVtZTogJ2dyaWQnXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mIGRvYy5wdXRUb3RhbFBhZ2VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZG9jLnB1dFRvdGFsUGFnZXModG90YWxQYWdlc0V4cCk7XG4gICAgICAgIH1cbiAgICAgICAgZG9jLnNhdmUoJ1BhcnRpY2lwYW50cyBMaXN0LnBkZicpO1xuICAgICAgfSlcbiAgICB9XG5cblxuICAgICRzY29wZS50b2dnbGVBZG1pbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKCF1c2VyLmFkbWluKSB7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IG1ha2UgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIGFuIGFkbWluIVwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpcm06IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIG1ha2UgdGhlbSBhbiBhZG1pblwiLFxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBVc2VyU2VydmljZS5tYWtlQWRtaW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFwiTWFkZVwiLCByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGFuIGFkbWluLlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVXNlclNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZT0+e1xuICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgcmVzcG9uc2UuZGF0YS5mb3JFYWNoKHVzZXIgPT4ge1xuICAgICAgICAgICAgaWYgKHVzZXIuYWRtaW4pIGNvdW50Kys7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGNvdW50PjEpIHtcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZUFkbWluKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgIHN3YWwoXCJSZW1vdmVkXCIsIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgYXMgYWRtaW5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBzd2FsKFwiTm8gb3RoZXIgQWRtaW5cIixcIllvdSBjYW4ndCByZW1vdmUgYWxsIGFkbWlucy5cIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKSB7XG4gICAgICBpZiAodGltZSkge1xuICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmxvY2FsZSgnZW4nKS5mb3JtYXQoXCJNTU1NIERvIFlZWVksIGg6bW06c3MgYVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICBpZiAodXNlci5hZG1pbikge1xuICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xuICAgICAgICByZXR1cm4gXCJwb3NpdGl2ZVwiO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcbiAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpIHtcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJCYXNpYyBJbmZvXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlZCBPblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTGFzdCBVcGRhdGVkXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIubGFzdFVwZGF0ZWQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkNvbmZpcm0gQnlcIixcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSB8fCBcIk4vQVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkNoZWNrZWQgSW5cIixcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8IFwiTi9BXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiRW1haWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIlByb2ZpbGVcIixcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJOYW1lXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubmFtZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZW5kZXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiRGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5kZXNjcmlwdGlvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJFc3NheVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmVzc2F5XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubGlua2VkaW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6XCJDViBsaW5rXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUucGl0Y2hMaW5rXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQ29uZmlybWF0aW9uXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5waG9uZU51bWJlclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJOZWVkcyBIYXJkd2FyZVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ud2FudHNIYXJkd2FyZSxcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFyZHdhcmUgUmVxdWVzdGVkXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5oYXJkd2FyZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTpcIk5hdGlvbmFsIENhcmQgSURcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5hdGlvbmFsQ2FyZElEXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJUcmF2ZWxcIixcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJBZGRpdGlvbmFsIE5vdGVzXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XG4gICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJOZXcgVm9sdW50ZWVyIEFkZGVkLlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcbiAgICAgIHN3YWwoXCJUcnkgYWdhaW4hXCIsIGRhdGEubWVzc2FnZSwgXCJlcnJvclwiKVxuICAgIH1cblxuICAgICRzY29wZS5hZGRWb2x1bnRlZXIgPSBmdW5jdGlvbigpe1xuXG4gICAgICBzd2FsKFwiV3JpdGUgdGhlIGNoYWxsZW5nZSB0aXRsZTpcIiwge1xuICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJJbnZpdGVcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxuICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiZXhhbXBsZUBnbWFpbC5jb21cIix0eXBlOiBcInRleHRcIn0gfSxcbiAgICAgIH0pLnRoZW4oKG1haWwpID0+IHsgaWYgKCFtYWlsKSB7cmV0dXJuO30gXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlZ2lzdGVyKFxuICAgICAgICAgIG1haWwsIFwiaGFja2F0aG9uXCIsIG9uU3VjY2Vzcywgb25FcnJvciwgdHJ1ZSlcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgJHNjb3BlLnNlbGVjdFVzZXIgPSBzZWxlY3RVc2VyO1xuICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLnNlcnZpY2UoJ3NldHRpbmdzJywgZnVuY3Rpb24oKSB7fSlcbiAgLmNvbnRyb2xsZXIoJ0Jhc2VDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICdFVkVOVF9JTkZPJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIEVWRU5UX0lORk8pe1xuXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ2FkbWluQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgVXNlclNlcnZpY2Upe1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRodHRwJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1Nlc3Npb24nLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgJ01hcmtldGluZ1NlcnZpY2UnLFxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGh0dHAsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgU2Vzc2lvbiwgVXNlclNlcnZpY2UsIE1hcmtldGluZ1NlcnZpY2UpIHtcblxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgIC8vIElzIHRoZSBzdHVkZW50IGZyb20gSG9zdFNjaG9vbD9cbiAgICAgICRzY29wZS5pc0hvc3RTY2hvb2wgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdID09IHNldHRpbmdzLmRhdGEuaG9zdFNjaG9vbDtcblxuICAgICAgLy8gSWYgc28sIGRlZmF1bHQgdGhlbSB0byBhZHVsdDogdHJ1ZVxuICAgICAgaWYgKCRzY29wZS5pc0hvc3RTY2hvb2wpIHtcbiAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5hZHVsdCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cbiAgICAgIHBvcHVsYXRlU2Nob29scygpO1xuICAgICAgX3NldHVwRm9ybSgpO1xuXG4gICAgICBwb3B1bGF0ZUNvdW50cmllcygpO1xuXG4gICAgICAkc2NvcGUucmVnSXNDbG9zZWQgPSBEYXRlLm5vdygpID4gc2V0dGluZ3MuZGF0YS50aW1lQ2xvc2U7XG5cbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpIHtcbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS51c2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XG5cbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSkge1xuICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICRodHRwXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmNzdicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHMgPSByZXMuZGF0YS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAkc2NvcGUuc2Nob29scy5wdXNoKCdPdGhlcicpO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLnNjaG9vbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHNbaV0gPSAkc2NvcGUuc2Nob29sc1tpXS50cmltKCk7XG4gICAgICAgICAgICAgIGNvbnRlbnQucHVzaCh7IHRpdGxlOiAkc2NvcGUuc2Nob29sc1tpXSB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcjc2Nob29sLnVpLnNlYXJjaCcpXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHJlc3VsdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cblxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVDb3VudHJpZXMoKSB7XG4gICAgICAgICRodHRwXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9jb3VudHJpZXMuY3N2JylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgJHNjb3BlLmNvdW50cmllcy5wdXNoKCdPdGhlcicpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAkc2NvcGUuY291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICRzY29wZS5jb3VudHJpZXNbaV0gPSAkc2NvcGUuY291bnRyaWVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKHsgdGl0bGU6ICRzY29wZS5jb3VudHJpZXNbaV0gfSlcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICQoJyNjb3VudHJ5LnVpLnNlYXJjaCcpXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHJlc3VsdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuY291bnRyeSA9IHJlc3VsdC50aXRsZS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICQoJyNjb21wYW55Y291bnRyeS51aS5zZWFyY2gnKVxuICAgICAgICAgICAgICAuc2VhcmNoKHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChyZXN1bHQsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLmNvbXBhbnljb3VudHJ5ID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG5cblxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG5cbiAgICAgIC8vIGZ1bmN0aW9uIHBvcHVsYXRlQ2x1YnMoKSB7XG4gICAgICAvLyAgICRodHRwXG4gICAgICAvLyAgICAgLmdldCgnL2Fzc2V0cy9jbHVicy5jc3YnKVxuICAgICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIC8vICAgICAgICRzY29wZS5jbHVicyA9IHJlcy5kYXRhLnNwbGl0KCdcXG4nKTtcbiAgICAgIC8vICAgICAgICRzY29wZS5jbHVicy5wdXNoKCdPdGhlcicpO1xuXG4gICAgICAvLyAgICAgICB2YXIgY29udGVudCA9IFtdO1xuXG4gICAgICAvLyAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLmNsdWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyAgICAgICAgICRzY29wZS5jbHVic1tpXSA9ICRzY29wZS5jbHVic1tpXS50cmltKCk7XG4gICAgICAvLyAgICAgICAgIGNvbnRlbnQucHVzaCh7IHRpdGxlOiAkc2NvcGUuY2x1YnNbaV0gfSlcbiAgICAgIC8vICAgICAgIH1cblxuICAgICAgLy8gICAgICAgJCgnI2NsdWIudWkuc2VhcmNoJylcbiAgICAgIC8vICAgICAgICAgLnNlYXJjaCh7XG4gICAgICAvLyAgICAgICAgICAgc291cmNlOiBjb250ZW50LFxuICAgICAgLy8gICAgICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgLy8gICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAocmVzdWx0LCByZXNwb25zZSkge1xuICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLmNsdWIgPSByZXN1bHQudGl0bGUudHJpbSgpO1xuICAgICAgLy8gICAgICAgICAgIH1cbiAgICAgIC8vICAgICAgICAgfSlcbiAgICAgIC8vICAgICB9KTtcbiAgICAgIC8vICAgaWYgKCRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlICE9IHVuZGVmaW5lZCkge1xuICAgICAgLy8gICAgICRzY29wZS5Vc2VyU291cmNlID0gJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2Uuc3BsaXQoJyMnKVswXTtcbiAgICAgIC8vICAgICAkc2NvcGUuY2x1YiA9ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlLnNwbGl0KCcjJylbMV07XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVzKG15QXJyLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBteUFyci5maWx0ZXIoKG9iaiwgcG9zLCBhcnIpID0+IHtcbiAgICAgICAgICByZXR1cm4gYXJyLm1hcChtYXBPYmogPT4gbWFwT2JqW3Byb3BdKS5pbmRleE9mKG9ialtwcm9wXSkgPT09IHBvcztcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNlbmRNYXJrZXRpbmdFbWFpbHMoKSB7XG4gICAgICAgIE1hcmtldGluZ1NlcnZpY2UuZ2V0QWxsKCkudGhlbih0ZWFtcyA9PiB7XG4gICAgICAgICAgdmFyIGVtYWlscyA9IFtdO1xuICAgICAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcbiAgICAgICAgICAgIHZhciBpc1RlYW1tYXRlID0gZmFsc2U7XG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICBpZiAobWVtYmVyID09IGN1cnJlbnRVc2VyLmRhdGEuZW1haWwpIHtcbiAgICAgICAgICAgICAgICBpc1RlYW1tYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaXNUZWFtbWF0ZSkge1xuICAgICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghKG1lbWJlciA9PSBjdXJyZW50VXNlci5kYXRhLmVtYWlsKSkge1xuICAgICAgICAgICAgICAgICAgZW1haWxzLnB1c2goeyBlbWFpbDogbWVtYmVyLCBldmVudDogdGVhbS5ldmVudCB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVtb3ZlRHVwbGljYXRlcyhlbWFpbHMsICdlbWFpbCcpLmZvckVhY2godGVhbW1hdGUgPT4ge1xuICAgICAgICAgICAgTWFya2V0aW5nU2VydmljZS5zZW5kRnJpZW5kSW52aXRlKGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCB0ZWFtbWF0ZSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKSB7XG5cbiAgICAgICAgLy9DaGVjayBpZiBVc2VyJ3MgZmlyc3Qgc3VibWlzc2lvblxuICAgICAgICB2YXIgc2VuZE1haWwgPSB0cnVlO1xuICAgICAgICBpZiAoY3VycmVudFVzZXIuZGF0YS5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSkgeyBzZW5kTWFpbCA9IGZhbHNlIH1cblxuICAgICAgICAvLyBHZXQgdXNlciBTb3VyY2VcbiAgICAgICAgaWYgKCRzY29wZS5Vc2VyU291cmNlICE9ICcyJykgeyAkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZSA9ICRzY29wZS5Vc2VyU291cmNlIH1cbiAgICAgICAgZWxzZSB7ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlID0gJHNjb3BlLlVzZXJTb3VyY2UgKyBcIiNcIiArICRzY29wZS5jbHViIH1cblxuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKFNlc3Npb24uZ2V0VXNlcklkKCksICRzY29wZS51c2VyLnByb2ZpbGUpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIkF3ZXNvbWUhXCIsIFwiWW91ciBhcHBsaWNhdGlvbiBoYXMgYmVlbiBzYXZlZC5cIiwgXCJzdWNjZXNzXCIpLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgICBpZiAoc2VuZE1haWwpIHsgc2VuZE1hcmtldGluZ0VtYWlscygpOyB9XG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5kYXNoYm9hcmRcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiVWggb2ghXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFwiZXJyb3JcIik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNNaW5vcigpIHtcbiAgICAgICAgcmV0dXJuICEkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtaW5vcnNBcmVBbGxvd2VkKCkge1xuICAgICAgICByZXR1cm4gc2V0dGluZ3MuZGF0YS5hbGxvd01pbm9ycztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWlub3JzVmFsaWRhdGlvbigpIHtcbiAgICAgICAgLy8gQXJlIG1pbm9ycyBhbGxvd2VkIHRvIHJlZ2lzdGVyP1xuICAgICAgICBpZiAoaXNNaW5vcigpICYmICFtaW5vcnNBcmVBbGxvd2VkKCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKSB7XG4gICAgICAgIC8vIEN1c3RvbSBtaW5vcnMgdmFsaWRhdGlvbiBydWxlXG4gICAgICAgICQuZm4uZm9ybS5zZXR0aW5ncy5ydWxlcy5hbGxvd01pbm9ycyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBtaW5vcnNWYWxpZGF0aW9uKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZCBhdGlvblxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xuICAgICAgICAgIG9uOiAnYmx1cicsXG4gICAgICAgICAgaW5saW5lOiB0cnVlLFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnbmFtZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvdW50cnk6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2NvdW50cnknLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IHlvdXIgY291bnRyeSBvZiByZXNpZGVuY2UuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdlbmRlcjoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZ2VuZGVyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCBhIGdlbmRlci4gJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBhbnk6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2NvbXBhbnknLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBjb21wYW55IG5hbWUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZHVzdHJ5OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdpbmR1c3RyeScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIGNvbXBhbnkgaW5kdXN0cnkuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd0aXRsZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHRpdGxlIGluIHlvdXIgY29tcGFueS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRyZXNzZToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnYWRyZXNzZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIGNvbXBhbnkgYWRyZXNzZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGFueWNvdW50cnk6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2NvbXBhbnljb3VudHJ5JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgY29tcGFueSBIUSBjb3VudHJ5LidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNlY3Rvcjoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2VjdG9yJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgY29tcGFueSBzZWN0b3IuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVzc2F5OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdlc3NheScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0ZWxsIHVzIHdvdWxkIHlvdSBsaWtlIHRvIGdldCBvdXQgb2YgVVZTUSBDb25mLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1c2VyU291cmNlOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd1c2VyU291cmNlJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnSG93IGRpZCB5b3UgaGVhciBhYm91dCB1cyA/J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVzZXJUeXBlOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd1c2VyVHlwZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ0hvdyBkbyB5b3UgcGxhbiB0byBhdHRlbmQgVVZTUSBDb25mPydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG5cblxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCgnLnVpLmZvcm0nKS5mb3JtKCdpcyB2YWxpZCcpKSB7XG4gICAgICAgICAgLy8gJCgnLnVpLnN1Ym1pdC5idXR0b24nKS5jbGljaygpO1xuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbi5jb250cm9sbGVyKCdDaGVja2luQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICckc3RhdGUnLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJ1VzZXJTZXJ2aWNlJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xuICAgICQoJyNyZWFkZXInKS5odG1sNV9xcmNvZGUoZnVuY3Rpb24odXNlcklEKXtcbiAgICAgICAgICAvL0NoYW5nZSB0aGUgaW5wdXQgZmllbGRzIHZhbHVlIGFuZCBzZW5kIHBvc3QgcmVxdWVzdCB0byB0aGUgYmFja2VuZFxuICAgICAgICAgIFxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmdldCh1c2VySUQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG4gICAgICAgICAgICB1c2VyID1yZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbikge1xuICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjaGVjayBpbiBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW5cIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICBcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5jaGVja0luKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5xdWVyeVRleHQgPSB1c2VyLmVtYWlsO1xuICAgICAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICAgICAgXCJDaGVja2VkIGluXCIsXG4gICAgICAgICAgICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZCBpbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICBcIkFscmVhZHkgY2hlY2tlZEluXCIsXG4gICAgICAgICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkLWluIGF0OiBcIisgZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSksXG4gICAgICAgICAgICAgICAgXCJ3YXJuaW5nXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgIH0sIGZ1bmN0aW9uKHZpZGVvRXJyb3Ipe1xuICAgICAgICAvL3RoZSB2aWRlbyBzdHJlYW0gY291bGQgYmUgb3BlbmVkXG4gICAgICB9XG4gICAgKTtcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcbiAgICAkc2NvcGUuc29ydEJ5ID0gJ3RpbWVzdGFtcCdcbiAgICAkc2NvcGUuc29ydERpciA9IGZhbHNlXG4gICAgJHNjb3BlLnN0YXR1c0ZpbHRlcnM9IHt2ZXJpZmllZDp0cnVlLGNvbXBsZXRlZFByb2ZpbGU6dHJ1ZSxhZG1pdHRlZDogdHJ1ZSxjb25maXJtZWQ6dHJ1ZX1cblxuICAgICRzY29wZS5maWx0ZXIgPSBkZXNlcmlhbGl6ZUZpbHRlcnMoJHN0YXRlUGFyYW1zLmZpbHRlcik7XG4gICAgJHNjb3BlLmZpbHRlci50ZXh0ID0gJHN0YXRlUGFyYW1zLnF1ZXJ5IHx8IFwiXCI7XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZUZpbHRlcnModGV4dCkge1xuICAgICAgdmFyIG91dCA9IHt9O1xuICAgICAgaWYgKCF0ZXh0KSByZXR1cm4gb3V0O1xuICAgICAgdGV4dC5zcGxpdChcIixcIikuZm9yRWFjaChmdW5jdGlvbihmKXtvdXRbZl09dHJ1ZX0pO1xuICAgICAgcmV0dXJuICh0ZXh0Lmxlbmd0aD09PTApP3t9Om91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemVGaWx0ZXJzKGZpbHRlcnMpIHtcbiAgICAgIHZhciBvdXQgPSBcIlwiO1xuICAgICAgZm9yICh2YXIgdiBpbiBmaWx0ZXJzKSB7aWYodHlwZW9mKGZpbHRlcnNbdl0pPT09XCJib29sZWFuXCImJmZpbHRlcnNbdl0pIG91dCArPSB2K1wiLFwiO31cbiAgICAgIHJldHVybiAob3V0Lmxlbmd0aD09PTApP1wiXCI6b3V0LnN1YnN0cigwLG91dC5sZW5ndGgtMSk7XG4gICAgfVxuXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXG4gICAgJCgnLnVpLmRpbW1lcicpLnJlbW92ZSgpO1xuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB7fTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7XG4gICAgICBzdGF0dXM6IFwiXCIsXG4gICAgICBjb25maXJtYXRpb246IHtcbiAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uczogW11cbiAgICAgIH0sXG4gICAgICBwcm9maWxlOiBcIlwiXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpIHtcbiAgICAgICRzY29wZS51c2VycyA9IGRhdGEudXNlcnM7XG4gICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XG4gICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XG5cbiAgICAgIHZhciBwID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKSB7XG4gICAgICAgIHAucHVzaChpKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5wYWdlcyA9IHA7XG4gICAgfVxuICAgIFxuICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnksICRzY29wZS5zdGF0dXNGaWx0ZXJzKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uKHF1ZXJ5VGV4dCkge1xuICAgICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsIHF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXG4gICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuXG5cbiAgICAkc2NvcGUuYXBwbHlTdGF0dXNGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSkge1xuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJzXCIsIHtcbiAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgMjBcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tJbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKCF1c2VyLnN0YXR1cy5jaGVja2VkSW4pIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBjaGVjayB0aGVtIGluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgVXNlclNlcnZpY2UuY2hlY2tJbih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiQ2hlY2tlZCBpblwiLFxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQgaW4uXCIsXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3YWwoXG4gICAgICAgICAgXCJBbHJlYWR5IGNoZWNrZWRJblwiLFxuICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZC1pbiBhdDogXCIrIGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpLFxuICAgICAgICAgIFwid2FybmluZ1wiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xuICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5sb2NhbGUoJ2VuJykuZm9ybWF0KFwiTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGFcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgaWYgKHVzZXIuYWRtaW4pIHtcbiAgICAgICAgcmV0dXJuIFwiYWRtaW5cIjtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcbiAgICAgICAgcmV0dXJuIFwicG9zaXRpdmVcIjtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XG4gICAgICAgIHJldHVybiBcIndhcm5pbmdcIjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKSB7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xuICAgICAgJChcIi5sb25nLnVzZXIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQmFzaWMgSW5mb1wiLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkNyZWF0ZWQgT25cIixcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci50aW1lc3RhbXApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkxhc3QgVXBkYXRlZFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLmxhc3RVcGRhdGVkKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJDb25maXJtIEJ5XCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgXCJOL0FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJDaGVja2VkIEluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCBcIk4vQVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkVtYWlsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTmFtZVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm5hbWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHcmFkdWF0aW9uIFllYXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ncmFkdWF0aW9uWWVhclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJIYWNrYXRob25zIHZpc2l0ZWRcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ob3dNYW55SGFja2F0aG9uc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJEZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkVzc2F5XCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZXNzYXlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTWFqb3JcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5tYWpvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiRmFjZWJvb2tcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5mYWNlYm9va1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJMaW5rZWRpblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJDb25maXJtYXRpb25cIixcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJQaG9uZSBOdW1iZXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIk5lZWRzIEhhcmR3YXJlXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi53YW50c0hhcmR3YXJlLFxuICAgICAgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJIYXJkd2FyZSBSZXF1ZXN0ZWRcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhhcmR3YXJlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJUcmF2ZWxcIixcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJBZGRpdGlvbmFsIE5vdGVzXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgJHNjb3BlLnNlbGVjdFVzZXIgPSBzZWxlY3RVc2VyO1xuICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdDb25maXJtYXRpb25DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdVdGlscycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY3VycmVudFVzZXIsIFV0aWxzLCBVc2VyU2VydmljZSl7XG5cbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IERhdGUubm93KCkgPiB1c2VyLnN0YXR1cy5jb25maXJtQnk7XG5cbiAgICAgICRzY29wZS5mb3JtYXRUaW1lID0gVXRpbHMuZm9ybWF0VGltZTtcblxuICAgICAgX3NldHVwRm9ybSgpO1xuXG4gICAgICAkc2NvcGUuZmlsZU5hbWUgPSB1c2VyLl9pZCArIFwiX1wiICsgdXNlci5wcm9maWxlLm5hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJfXCIpO1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBBbGwgdGhpcyBqdXN0IGZvciBkaWV0YXJ5IHJlc3RyaWN0aW9uIGNoZWNrYm94ZXMgZm1sXG5cbiAgICAgIHZhciBkaWV0YXJ5UmVzdHJpY3Rpb25zID0ge1xuICAgICAgICAnVmVnZXRhcmlhbic6IGZhbHNlLFxuICAgICAgICAnVmVnYW4nOiBmYWxzZSxcbiAgICAgICAgJ0hhbGFsJzogZmFsc2UsXG4gICAgICAgICdLb3NoZXInOiBmYWxzZSxcbiAgICAgICAgJ051dCBBbGxlcmd5JzogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGlmICh1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zKXtcbiAgICAgICAgdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3RyaWN0aW9uKXtcbiAgICAgICAgICBpZiAocmVzdHJpY3Rpb24gaW4gZGlldGFyeVJlc3RyaWN0aW9ucyl7XG4gICAgICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zW3Jlc3RyaWN0aW9uXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkaWV0YXJ5UmVzdHJpY3Rpb25zO1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpe1xuICAgICAgICB2YXIgY29uZmlybWF0aW9uID0gJHNjb3BlLnVzZXIuY29uZmlybWF0aW9uO1xuICAgICAgICAvLyBHZXQgdGhlIGRpZXRhcnkgcmVzdHJpY3Rpb25zIGFzIGFuIGFycmF5XG4gICAgICAgIHZhciBkcnMgPSBbXTtcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICBpZiAoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnNba2V5XSl7XG4gICAgICAgICAgICBkcnMucHVzaChrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZHJzO1xuICAgICAgICBcblxuICAgICAgICAvLyBVc2VyU2VydmljZS51cGxvYWRDVih1c2VyLl9pZCwgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjdicpKVswXS5maWxlcykudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIC8vICAgc3dhbChcIlVwbG9hZGVkXCIsIFwiQ1YgdXBsb2FkZWQuXCIsIFwic3VjY2Vzc1wiKVxuXG5cbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbih1c2VyLl9pZCwgY29uZmlybWF0aW9uKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgc3dhbChcIldvbyFcIiwgXCJZb3UncmUgY29uZmlybWVkIVwiLCBcInN1Y2Nlc3NcIikudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZGFzaGJvYXJkXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xuICAgICAgICB9KVxuXG5cbiAgICAgICAgLy8gfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAvLyAgIHN3YWwoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gKEZpbGUpXCIsIFwiZXJyb3JcIik7XG4gICAgICAgIC8vIH0pXG4gIFxuICAgICAgICBcblxuICAgICAgICBcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpe1xuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkYXRpb25cbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNoaXJ0OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaGlydCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBnaXZlIHVzIGEgc2hpcnQgc2l6ZSEnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGhvbmU6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3Bob25lJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIGEgcGhvbmUgbnVtYmVyLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduYXR1cmVDb2RlT2ZDb25kdWN0OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVDb2RlT2ZDb25kdWN0JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmF0aW9uYWxDYXJkSUQ6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hdGlvbmFsQ2FyZElEJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBOYXRpb25hbCBDYXJkIElELidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCgnLnVpLmZvcm0nKS5mb3JtKCdpcyB2YWxpZCcpKXtcbiAgICAgICAgICBfdXBkYXRlVXNlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJQbGVhc2UgRmlsbCBUaGUgUmVxdWlyZWQgRmllbGRzXCIsIFwiZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2NvcGUnLFxuICAgICckc2NlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgJ0VWRU5UX0lORk8nLFxuICAgICdEQVNIQk9BUkQnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHNjZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBFVkVOVF9JTkZPLCBEQVNIQk9BUkQpe1xuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICRzY29wZS50aW1lQ2xvc2UgPSBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSk7XG4gICAgICAkc2NvcGUudGltZUNvbmZpcm0gPSBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDb25maXJtKTtcblxuICAgICAgJHNjb3BlLkRBU0hCT0FSRCA9IERBU0hCT0FSRDtcblxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0FQUF9ERUFETElORV0nKSkge1xuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQVBQX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0NPTkZJUk1fREVBRExJTkVdJykpIHtcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0NPTkZJUk1fREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cbiAgICAgIHZhciByZWdJc09wZW4gPSAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xuICAgICAgdmFyIHBhc3RDb25maXJtYXRpb24gPSAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcblxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gICAgICAgIHZhciB1c2VyID0gJHNjb3BlLnVzZXI7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgICAgY2FzZSAndW52ZXJpZmllZCc6XG4gICAgICAgICAgICByZXR1cm4gIXVzZXIudmVyaWZpZWQ7XG4gICAgICAgICAgY2FzZSAnb3BlbkFuZEluY29tcGxldGUnOlxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnZlcmlmaWVkICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlO1xuICAgICAgICAgIGNhc2UgJ29wZW5BbmRTdWJtaXR0ZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRJbmNvbXBsZXRlJzpcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRTdWJtaXR0ZWQnOiAvLyBXYWl0bGlzdGVkIFN0YXRlXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbkNvbmZpcm0nOlxuICAgICAgICAgICAgcmV0dXJuICFwYXN0Q29uZmlybWF0aW9uICYmXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2Fubm90Q29uZmlybSc6XG4gICAgICAgICAgICByZXR1cm4gcGFzdENvbmZpcm1hdGlvbiAmJlxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgICBjYXNlICdjb25maXJtZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmIHVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgICAgY2FzZSAnZGVjbGluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93V2FpdGxpc3QgPSAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuXG4gICAgICAkc2NvcGUucmVzZW5kRW1haWwgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgIC5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCgpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIkNoZWNrIHlvdXIgSW5ib3ghXCIsIFwiWW91ciBlbWFpbCBoYXMgYmVlbiBzZW50LlwiLCBcInN1Y2Nlc3NcIik7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAvLyAkc2NvcGUucHJpbnRDb25maXJtYXRpb24gPWZ1bmN0aW9uKEltYWdlVVJMKXtcblxuICAgICAgLy8gICBodG1sMmNhbnZhcygkKCcjcXJDb2RlJyksIHtcbiAgICAgIC8vICAgICBhbGxvd1RhaW50OiB0cnVlLFxuICAgICAgLy8gICAgIG9ucmVuZGVyZWQ6IGZ1bmN0aW9uIChjYW52YXMpIHtcbiAgICAgIC8vICAgICAgICAgdmFyIGltZ0RhdGEgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvanBlZ1wiLCAxLjApO1xuICAgICAgLy8gICAgICAgICB2YXIgcGRmID0gbmV3IGpzUERGKCdwJywgJ21tJywgJ2EwJyk7XG4gIFxuICAgICAgLy8gICAgICAgICBwZGYuYWRkSW1hZ2UoaW1nRGF0YSwgJ0pQRUcnLCAwLCAwKTtcbiAgICAgIC8vICAgICAgICAgcGRmLnNhdmUoXCJDdXJyZW50IERhdGEyLnBkZlwiKVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vIH0pO1xuICAgICAgXG4gICAgICAvLyB9XG5cblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIFRleHQhXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcbiAgICAgICRzY29wZS5hY2NlcHRhbmNlVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmFjY2VwdGFuY2VUZXh0KSk7XG4gICAgICAkc2NvcGUuY29uZmlybWF0aW9uVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQpKTtcbiAgICAgICRzY29wZS53YWl0bGlzdFRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy53YWl0bGlzdFRleHQpKTtcblxuICAgICAgJHNjb3BlLmRlY2xpbmVBZG1pc3Npb24gPSBmdW5jdGlvbigpe1xuXG4gICAgICBzd2FsKHtcbiAgICAgICAgdGl0bGU6IFwiV2hvYSFcIixcbiAgICAgICAgdGV4dDogXCJBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gZGVjbGluZSB5b3VyIGFkbWlzc2lvbj8gXFxuXFxuIFlvdSBjYW4ndCBnbyBiYWNrIVwiLFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uZmlybToge1xuICAgICAgICAgICAgdGV4dDogXCJZZXMsIEkgY2FuJ3QgbWFrZSBpdFwiLFxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5kZWNsaW5lQWRtaXNzaW9uKHVzZXIuX2lkKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBFVkVOVF9JTkZPKXtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cblxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cbiAgICAgIC8vIFN0YXJ0IHN0YXRlIGZvciBsb2dpblxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xuXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJlc2V0RXJyb3IoKTtcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2V0TG9naW5TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xuICAgICAgICBBdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbChlbWFpbCk7XG4gICAgICAgIHN3YWwoXCJEb24ndCBzd2VhdCFcIiwgXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgfTtcblxuXG5cblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignTG9naW5DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyRzdGF0ZScsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgJ0VWRU5UX0lORk8nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZSwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgRVZFTlRfSU5GTyl7XG5cbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcblxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cbiAgICAgIC8vIFN0YXJ0IHN0YXRlIGZvciBsb2dpblxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xuXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJlc2V0RXJyb3IoKTtcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2V0TG9naW5TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xuICAgICAgICBBdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbChlbWFpbCk7XG4gICAgICAgIHN3YWwoXCJEb24ndCBzd2VhdCFcIiwgXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgfTtcblxuICAgIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0Q3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlUGFyYW1zJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUuY2hhbmdlUGFzc3dvcmQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcGFzc3dvcmQgPSAkc2NvcGUucGFzc3dvcmQ7XG4gICAgICAgIHZhciBjb25maXJtID0gJHNjb3BlLmNvbmZpcm07XG5cbiAgICAgICAgaWYgKHBhc3N3b3JkICE9PSBjb25maXJtKXtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIjtcbiAgICAgICAgICAkc2NvcGUuY29uZmlybSA9IFwiXCI7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZChcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAkc2NvcGUucGFzc3dvcmQsXG4gICAgICAgICAgbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiTmVhdG8hXCIsIFwiWW91ciBwYXNzd29yZCBoYXMgYmVlbiBjaGFuZ2VkIVwiLCBcInN1Y2Nlc3NcIikudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignVmVyaWZ5Q3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlUGFyYW1zJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSl7XG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnZlcmlmeSh0b2tlbixcbiAgICAgICAgICBmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XSk7XG4iLCJcblxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdUZWFtQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJHRpbWVvdXQnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgJ1RlYW1TZXJ2aWNlJyxcbiAgICAnVEVBTScsXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRlYW1TZXJ2aWNlLCBURUFNKSB7XG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuXG4gICAgICBmdW5jdGlvbiBpc1RlYW1NZW1iZXIodGVhbXMsIFVzZXJpZCkge1xuICAgICAgICB2YXIgdGVzdCA9IGZhbHNlO1xuICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xuICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkID09IFVzZXJpZCkgdGVzdCA9IHRydWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2VsZWN0TWVtYmVyKG1lbWJlcklkKSB7XG4gICAgICAgIFVzZXJTZXJ2aWNlLmdldChtZW1iZXJJZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgdXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiUHJvZmlsZVwiLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkdlbmRlclwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkdpdGh1YlwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2l0aHViXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5saW5rZWRpblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zZWxlY3RNZW1iZXIgPSBzZWxlY3RNZW1iZXI7XG5cblxuICAgICAgJHNjb3BlLmlzam9pbmVkID0gZnVuY3Rpb24gKHRlYW0pIHtcbiAgICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcbiAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHRlc3QgPSB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgIH1cblxuICAgICAgVGVhbVNlcnZpY2UuZ2V0QWxsKCkudGhlbih0ZWFtcyA9PiB7XG4gICAgICAgICRzY29wZS5pc1RlYW1BZG1pbiA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaXNUZWFtTWVtYmVyID0gZmFsc2U7XG4gICAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcbiAgICAgICAgICB0ZWFtLmlzTWF4dGVhbSA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHRlYW0ubWVtYmVycy5sZW5ndGggPj0gU2V0dGluZ3MubWF4VGVhbVNpemUpIHtcbiAgICAgICAgICAgIHRlYW0uaXNDb2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGVhbS5tZW1iZXJzWzBdLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XG4gICAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgIGlmIChpc1RlYW1NZW1iZXIodGVhbXMuZGF0YSwgbWVtYmVyLmlkKSkge1xuICAgICAgICAgICAgICAgIG1lbWJlci51bmF2YWlsYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7IG1lbWJlci51bmF2YWlsYWJsZSA9IGZhbHNlIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHNjb3BlLnVzZXJBZG1pblRlYW0gPSB0ZWFtO1xuICAgICAgICAgICAgJHNjb3BlLmlzVGVhbUFkbWluID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xuICAgICAgICAgICAgICAgICRzY29wZS51c2VyTWVtYmVyVGVhbSA9IHRlYW07XG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlciA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAkc2NvcGUudGVhbXMgPSB0ZWFtcy5kYXRhO1xuXG4gICAgICB9KTtcblxuXG4gICAgICAkc2NvcGUuY3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0ZWFtRGF0YSA9IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJHNjb3BlLm5ld1RlYW1fZGVzY3JpcHRpb24sXG4gICAgICAgICAgbWVtYmVyczogW3sgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6ICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwgfV0sXG4gICAgICAgICAgc2tpbGxzOiB7IGNvZGU6ICRzY29wZS5za2lsbGNvZGUsIGRlc2lnbjogJHNjb3BlLnNraWxsZGVzaWduLCBoYXJkd2FyZTogJHNjb3BlLnNraWxsaGFyZHdhcmUsIGlkZWE6ICRzY29wZS5za2lsbGlkZWEgfSxcbiAgICAgICAgICBpc0NvbG9zZWQ6IGZhbHNlLFxuICAgICAgICB9XG5cbiAgICAgICAgVXNlclNlcnZpY2UuZ2V0KGN1cnJlbnRVc2VyLmRhdGEuX2lkKS50aGVuKHVzZXI9PntcbiAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyLmRhdGEudGVhbSk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKHR5cGVvZih1c2VyLmRhdGEudGVhbSk9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgVGVhbVNlcnZpY2UuY3JlYXRlKHRlYW1EYXRhKTtcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJZb3UndmUgYW5vdGhlciB0ZWFtXCIsXG4gICAgICAgICAgICAgIFwiWW91IGNhbid0IGJlIHBhcnQgb2YgdHdvIHRlYW1zIGF0IHRoZSBzYW1lIHRpbWUsIHBsZWFzZSBsZWF2ZSB5b3VyIGN1cnJlbnQgdGVhbSB0byBjcmVhdGUgYW5vdGhlciBvbmUuXCIsXG4gICAgICAgICAgICAgIFwiZXJyb3JcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH07XG5cblxuICAgICAgJHNjb3BlLlNob3djcmVhdGVUZWFtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuU2hvd05ld1RlYW1Gcm9tID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNraWxsY29kZSA9IHRydWVcbiAgICAgICAgJHNjb3BlLnNraWxsZGVzaWduID0gdHJ1ZVxuICAgICAgICAkc2NvcGUuc2tpbGxoYXJkd2FyZSA9IHRydWVcbiAgICAgICAgJHNjb3BlLnNraWxsaWRlYSA9IHRydWVcbiAgICAgICAgJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCA9IFwiY29kZVwiXG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLlNob3dKb2luVGVhbSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5TaG93Sm9pblRlYW1Gcm9tID0gdHJ1ZTsgIFxuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5qb2luVGVhbUNvZGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGVhbUlEID0gJHNjb3BlLm5ld1RlYW1fQ29kZTtcbiAgICAgICAgbmV3VGVhbV9za2lsbD0gJHNjb3BlLm5ld1RlYW1fc2tpbGw7XG5cbiAgICAgICAgbmV3dXNlcj0ge2lkOmN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOmN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDpuZXdUZWFtX3NraWxsfTtcbiAgICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtSUQsbmV3dXNlcikudGhlbiggZT0+ICAgICAgICAgXG4gICAgICAgICAgc3dhbChcbiAgICAgICAgICBcIkpvaW5lZFwiLFxuICAgICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgIClcbiAgICAgICAgKS5jYXRjaChlcnI9PiBcbiAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgXCJUZWFtIG5vdCBmb3VuZFwiLFxuICAgICAgICAgICAgXCJUaGUgdGVhbSBjb2RlIHlvdSBlbnRlcmVkIGRvZXNuJ3QgZXhpc3QuXCIsXG4gICAgICAgICAgICBcImVycm9yXCJcbiAgICAgICAgICApXG4gICAgICAgICAgKTsgXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcblxuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgICBzZWxlY3QuY2xhc3NOYW1lID0gJ3NlbGVjdC1jdXN0b20nXG5cblxuICAgICAgICB2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnU2VsZWN0IGEgc2tpbGwnO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblxuXG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5jb2RlKSB7XG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdDb2RlJztcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5kZXNpZ24pIHtcbiAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0Rlc2lnbic7XG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJkZXNpZ25cIlxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5oYXJkd2FyZSkge1xuICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnSGFyZHdhcmUnO1xuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaGFyZHdhcmVcIlxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5pZGVhKSB7XG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdJZGVhJztcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImlkZWFcIlxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0Lm9uY2hhbmdlID0gZnVuY3Rpb24gc2VsZWN0Q2hhbmdlZChlKSB7XG4gICAgICAgICAgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiUGxlYXNlIHNlbGVjdCB5b3VyIHNraWxsIHRvIGpvaW5cIixcblxuICAgICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHNlbGVjdCxcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgbmV3dXNlciA9IHsgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6IHZhbHVlIH07XG4gICAgICAgICAgXG4gICAgICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtLl9pZCwgbmV3dXNlcikudGhlbiggZT0+ICAgICAgICAgXG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgXCJKb2luZWRcIixcbiAgICAgICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICApXG4gICAgICAgICAgKS5jYXRjaChlcnI9PiBcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiVGVhbSBub3QgZm91bmRcIixcbiAgICAgICAgICAgICAgXCJUaGUgdGVhbSBjb2RlIHlvdSBlbnRlcmVkIGRvZXNuJ3QgZXhpc3QuXCIsXG4gICAgICAgICAgICAgIFwiZXJyb3JcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTsgXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5hY2NlcHRNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XG5cbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgbWVtYmVyLm5hbWUgKyBcIiB0byB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbCBhbmQgd2lsbCBzaG93IGluIHRoZSBwdWJsaWMgdGVhbXMgcGFnZS5cIixcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgbGV0IGhpbSBpblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBUZWFtU2VydmljZS5hY2NlcHRNZW1iZXIodGVhbUlELCBtZW1iZXIsIFNldHRpbmdzLm1heFRlYW1TaXplKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSBcIm1heFRlYW1TaXplXCIpIHtcbiAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICBcIkVycm9yXCIsXG4gICAgICAgICAgICAgICAgXCJNYXhpbXVtIG51bWJlciBvZiBtZW1iZXJzIChcIiArIFNldHRpbmdzLm1heFRlYW1TaXplICsgXCIpIHJlYWNoZWRcIixcbiAgICAgICAgICAgICAgICBcImVycm9yXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UyID0+IHtcbiAgICAgICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICAgICAgXCJBY2NlcHRlZFwiLFxuICAgICAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiBhY2NlcHRlZCB0byB5b3VyIHRlYW0uXCIsXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUucmVmdXNlTWVtYmVyID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZWZ1c2UgXCIgKyBtZW1iZXIubmFtZSArIFwiIGZyb20geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlZnVzZSBoaW1cIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBtZW1iZXIpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJSZWZ1c2VkXCIsXG4gICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVmdXNlZCBmcm9tIHlvdXIgdGVhbS5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5yZW1vdmVNZW1iZXJmcm9tVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtSUQsIGluZGV4LCBtZW1iZXIuaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwicmVtb3ZpbmdBZG1pblwiKSB7XG4gICAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgICAgXCJFcnJvclwiLFxuICAgICAgICAgICAgICAgIFwiWW91IGNhbid0IHJlbW92ZSB0aGUgVGVhbSBBZG1pbiwgQnV0IHlvdSBjYW4gY2xvc2UgdGhlIHRlYW0uXCIsXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XG4gICAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxuICAgICAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZW1vdmVkIGZyb20geW91ciB0ZWFtLlwiLFxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnJlbW92ZVRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgdGhpcyB0ZWFtIHdpdGggYWxsIGl0J3MgbWVtYmVycyEgVGhpcyB3aWxsIHNlbmQgdGhlbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC4gWW91IG5lZWQgdG8gZmluZCBhbm90aGVyIHRlYW0gdG8gd29yayB3aXRoLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGVhbVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGVtYWlsID0ge1xuICAgICAgICAgICAgc3ViamVjdDogXCJZb3VyIHRlYW0gaGFzIGJlZW4gcmVtb3ZlZFwiLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGltZSBmb3IgYSBiYWNrdXAgcGxhblwiLFxuICAgICAgICAgICAgYm9keTogXCJUaGUgdGVhbSB5b3UgaGF2ZSBiZWVuIHBhcnQgb2YgKE1lbWJlci9yZXF1ZXN0ZWQgdG8gam9pbikgaGFzIGJlZW4gcmVtb3ZlZC4gUGxlYXNlIGNoZWNrIHlvdXIgZGFzaGJvYXJkIGFuZCB0cnkgdG8gZmluZCBhbm90aGVyIHRlYW0gdG8gd29yayB3aXRoIGJlZm9yZSB0aGUgaGFja2F0aG9uIHN0YXJ0cy5cIlxuICAgICAgICAgIH1cblxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZSh0ZWFtLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaCh1c2VyID0+IHtcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2UucmVtb3ZldGVhbWZpZWxkKHVzZXIuaWQpXG4gICAgICAgICAgICAgIGlmICh1c2VyLmlkICE9IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaCh1c2VyID0+IHtcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXG4gICAgICAgICAgICAgIFwiVGVhbSBoYXMgYmVlbiByZW1vdmVkLlwiLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGxlYXZlIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgdGhlIGFkbWluIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlbWVtYmVyKHRlYW0uX2lkLCBpbmRleCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxuICAgICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbGVmdCB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuXG4gICAgICAkc2NvcGUuY2FuY2Vsam9pblRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjYW5jZWwgeW91ciByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtIVwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIENhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xuICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW0uX2lkLCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcbiAgICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGNhbmNlbGVkIHlvdSByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLnRvZ2dsZUNsb3NlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIHN0YXR1cykge1xuICAgICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcbiAgICAgICAgICB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIENsb3NlIHRoaXMgdGVhbS4gVGhpcyB3b24ndCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIGpvaW4geW91ciB0ZWFtIVwiXG4gICAgICAgIH0gZWxzZSB7IHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gcmVvcGVuIHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gam9pbiB5b3VyIHRlYW0hXCIgfVxuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUNsb3NlVGVhbSh0ZWFtSUQsIHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICBcIkRvbmVcIixcbiAgICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnRvZ2dsZUhpZGVUZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgc3RhdHVzKSB7XG4gICAgICAgIGlmIChzdGF0dXMgPT0gdHJ1ZSkge1xuICAgICAgICAgIHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gSGlkZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBzZWUgeW91ciB0ZWFtIVwiXG4gICAgICAgIH0gZWxzZSB7IHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gU2hvdyB0aGlzIHRlYW0uIFRoaXMgd2lsbCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIHNlZSB5b3VyIHRlYW0hXCIgfVxuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUhpZGVUZWFtKHRlYW1JRCwgc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiRG9uZVwiLFxuICAgICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24gKHF1ZXJ5VGV4dCkge1xuICAgICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKHF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnRlYW1zID0gcmVzcG9uc2UuZGF0YS50ZWFtcztcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLmFwcGx5c2tpbGxzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKCRzY29wZS5xdWVyeVRleHQsICRzY29wZS5za2lsbHNGaWx0ZXJzKS50aGVuKFxuICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfTtcblxuXG5cblxuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5zZXJ2aWNlKCdzZXR0aW5ncycsIGZ1bmN0aW9uKCkge30pXG4gIC5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzY29wZScsXG4gICAgJ1NldHRpbmdzU2VydmljZScsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBTZXR0aW5nc1NlcnZpY2UsIFV0aWxzLCBBdXRoU2VydmljZSwgU2Vzc2lvbiwgRVZFTlRfSU5GTyl7XG5cbiAgICAgIHZhciB1c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcbiAgICAgIC8vJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHNldHRpbmdzLnRpbWVTdGFydCk7XG5cbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHJlc3BvbnNlLmRhdGEudGltZVN0YXJ0KVxuICAgICAgfSk7XG5cbiAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xuICAgICAgJHNjb3BlLnRvZ2dsZVNpZGViYXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSAhJHNjb3BlLnNob3dTaWRlYmFyO1xuICAgICAgfTtcblxuICAgICAgLy8gb2ggZ29kIGpRdWVyeSBoYWNrXG4gICAgICAkKCcuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB9XSk7XG4iXX0=

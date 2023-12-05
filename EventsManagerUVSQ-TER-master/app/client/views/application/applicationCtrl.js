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

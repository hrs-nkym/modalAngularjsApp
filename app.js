//====================================================
// modal / Youtube embeded / with Backend
//====================================================

(function(){
        
    "use strict";

    var app = ons.bootstrap("myApp", ["onsen", "ngResource"]);

    // WhiteList configure
    app.config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://www.youtube.com/embed/**'
        ]);
    });
    
    // List Controller
    app.controller("listController", function($scope, $resource) {
        
        var i8items = $resource(
                'http://localhost/res.php/:id',
                { id: '@id' }
            );

       $scope.items = i8items.query();
 
        $scope.showDetail = function(item) {
            myNavigator.pushPage("detail.html", {item: item});
        };
    });

    // Detail Controller
    app.controller("detailController", function($scope) {        
        ons.ready(function() {
            $scope.item = myNavigator.getCurrentPage().options.item;
        });
    });

    // Admins List Controller
    app.controller("adminListController", function($scope, $resource){
        var i8items = $resource(
            'http://localhost/res.php/:id',
            { id: '@id' }
        );

        $scope.title = 'list';
        $scope.items = i8items.query();
        
        $scope.confirm = function(id) {
            ons.notification.confirm({
                message: 'Are you sure you want to delete?',
                callback: function(idx) {
                    switch (idx) {
                        case 0:
                        ons.notification.alert({message: 'Canceled.'});
                        break;
                        case 1:
                        i8items.delete(
                           { id: id },
                           function() {
                               $scope.items = i8items.query();
                        });
                        ons.notification.alert({message: 'Deleted.'});
                        break;
                    }
                }
            });
        }
        
        $scope.showDetail = function(item) {
            myNavigator.pushPage("detail.html", {item: item});
        };
    });

    // Admins Detail Controlloer
    app.controller("adminDetailController", function($scope, $resource) {
        ons.ready(function() {
            
            $scope.item = myNavigator.getCurrentPage().options.item;
            var activeTabIndex = i8Tabbar.getActiveTabIndex();

            if(activeTabIndex==1){ // from list.html
                i8Tabbar.setActiveTab(0);
            }else if( activeTabIndex==0 ){} // from detail.html
            
            if(!angular.isUndefined($scope.item)){ // item defined
                $scope.insbtn = true;
                $scope.updbtn = false;
            }else{
                $scope.insbtn = false;
                $scope.updbtn = true;
            }
        });

        $scope.title = 'create/update';
        
        var i8items = $resource(
            'http://localhost/res.php/:id',
            { id: '@id' },
            {   
                save: { method: 'POST'},
                update: { method: 'PUT' }
            }
        );
        
        $scope.onupdate = function() {
            i8items.update($scope.item);
            ons.notification.alert({message: 'updated.'});
        };
        $scope.oninsert = function() {
            i8items.save($scope.item);
            ons.notification.alert({message: 'added.'});
        };
    });
})();




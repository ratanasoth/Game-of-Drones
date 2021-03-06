describe('HomeController', function() {

    var controller,
        scope,
        modelServiceMock,
        stateMock,
        ionicPopupMock,
        ionicHistoryMock;

    // load the modules for our app
    beforeEach(module('App'));
	
	// disable template caching
	beforeEach(module(function($provide, $urlRouterProvider) {
    	$provide.value('$ionicTemplateCache', function(){} );
	    $urlRouterProvider.deferIntercept();
	}));
	
	// instantiate the controller and mocks for every test
	beforeEach(inject(function($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
		
		//modelServiceMock = $injector.get('Model');
        modelServiceMock = {
            Game: jasmine.createSpyObj('Game spy', [ 'getInstance' ])
        };
        var Player = function(){
            this.name = null;
            this.moves = [];
            this.setName = function(){};
            this.setMove = function(){};
        };
        modelServiceMock.Game.getInstance.and.returnValue({
            firstPlayer : new Player(),
            secondPlayer : new Player(),
            score: [],
            winner: null,
            saved: false
        });

		stateMock = jasmine.createSpyObj('$state spy', ['go']);		
		ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
        ionicHistoryMock = jasmine.createSpyObj('$ionicHistory spy', ['nextViewOptions']);
		
		controller = $controller('HomeController', {
            '$scope': scope,
            '$state': stateMock, 
            '$ionicPopup': ionicPopupMock, 
            'Model': modelServiceMock,
            '$ionicHistory' : ionicHistoryMock 
        });
        scope.$emit('$ionicView.enter');
        scope.$digest();
	}));

    describe('when the $ionicView.enter is executed,', function() {
        
        it('should have a new instance of the game', function () {
            spyOn(scope, '$on').and.callThrough();
            scope.$on('$ionicView.enter');

            expect(scope.$on).toHaveBeenCalledWith('$ionicView.enter');
            expect(modelServiceMock.Game.getInstance).toHaveBeenCalled();
        });
    });

    describe('#startGame', function() {

        describe('when the startGame is executed,', function() {

            it("if successful, should the first player's name does not equal to the second player's name", function() {
                scope.home = {
                    firstPlayerName : 'Valentina',
                    secondPlayerName : 'Juan David'
                };
                scope.startGame();
                expect(scope.home.firstPlayerName).not.toEqual(scope.home.secondPlayerName);
            });

            it('if successful, should change state to app.game', function() {
                scope.home = {
                    firstPlayerName : 'Valentina',
                    secondPlayerName : 'Juan David'
                };
                scope.startGame();
                expect(stateMock.go).toHaveBeenCalledWith('app.game', {}, {location:'replace'});
            });

            it('if unsuccessful, should show a popup', function() {
                scope.home = {
                    firstPlayerName : 'Valentina',
                    secondPlayerName : 'Valentina'
                };
                scope.startGame();
                expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
        });
    });
});
Template.addon.events({
	'click .js-button':function(event, template){
		event.preventDefault();

		$("#panel").toggleClass("action-loading");
		//$(".login").toggleClass("action-message");

		Meteor.setTimeout(function() {

		}, 2000);
	}
});
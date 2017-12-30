// Code by TreBlack

// This object holds the information for the notification to be created when a new window launches.

var notification = {
	type: "basic",
	title: "Better Bookmarks",
	message: "There is a site that you wished to view later. Would you like to view it now?",
	iconUrl: "betterBookmarksLogoSingle.png",
	buttons: [{title: "Yes"}, {title: "Extend for One Day"}],
	isClickable: true,
};

//Context Menu creation for the browser action

var delayTimeMenu = {
    title: "Delay Time",
    contexts: ["browser_action"],
    id: "delayTime",
    
}

var threeDayMenu = {
    
    title: "3 Days",
    type: "radio",
    id: "threeDays",
    contexts: ["browser_action"],
    parentId: "delayTime",
    checked: false,
}

var halfDayMenu = {
    
    title: "1/2 Day",
    type: "radio",
    id: "0.5days",
    contexts: ["browser_action"],
    parentId: "delayTime",
    checked: false,
}

var oneDayMenu = {
    
    title: "1 Day",
    type: "radio",
    id: "oneDay",
    contexts: ["browser_action"],
    parentId: "delayTime",
    checked: true,
}


/*

cBooks is an array full of bookmarks that are retrieved when a new window launches
*/
var cBooks = [];

//Array of time delay value
var delayTimesInMillis = [
    //0.5 days
    43200000,
    //One Day
    86400000,
    //3 Days
    259200000
    
];

//Create bookmark function

function addMark(delayTimeIndex)
{

	/*
		Function returns an array of tabs that are active and are in the current Window. 
		Then in the callback, a bookmark titled with a unique identified is created.
	*/
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		var tUrl = tabs[0].url;
		var date = new Date();
        var uniqueTitle = date.getTime().toString();
        
		chrome.bookmarks.create({title: uniqueTitle, url: tUrl});
        chrome.alarms.create(uniqueTitle, {when: Date.now() + delayTimesInMillis[delayTimeIndex]});
	});


}

//Function that is called when a new window is created

function startUp(alarmName)
{
	//Creates function with object detailed above
	
	
	//Gets an array of bookmarks that has the title "Later"
	chrome.bookmarks.search({title: alarmName}, function(results)
	{
		if(results.length >= 1)
		{
            chrome.notifications.create("starter", notification);
            
			for(var i = 0; i <= results.length; i++)
			{
				cBooks[i] = results[i];
				  
			}
			
		}

	});
}

//On notification button click listener function
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex)
{
	
    //If the user wants to view the bookmark, the tab is loaded
    if(buttonIndex === 0)
	{
		for(var i = 0; i <= cBooks.length; i++)
		{
			chrome.tabs.create({url: cBooks[i].url});
			chrome.bookmarks.remove(cBooks[i].id, chrome.notifications.clear(notificationId));
           
            
		}
        
    //Else, the bookmark will be added again, but this time the alarm will launch in 12 hours
	} else {
        
        var date = new Date();
        var uniqueTitle = date.getTime().toString();
        
        for(var i = 0; i <= cBooks.length; i++) {
        
			chrome.bookmarks.update(cBooks[i].id, {title: uniqueTitle});
            chrome.alarms.create(uniqueTitle, {when: Date.now() + delayTimesInMillis[0]});
            chrome.notifications.clear(notificationId);
            
		}
        
    }
	
    cBooks = [];
});







//Listener function calls for browserAction interaction and when a Window is created

chrome.browserAction.onClicked.addListener(function(tab){
    
    addMark(1);
});

//Listener function for when alarm goes off
chrome.alarms.onAlarm.addListener(function(alarm){
    
    startUp(alarm.name);
});

//Listener function for when a context menu radio button is selected
chrome.contextMenus.onClicked.addListener(function(info, tab){
   
    if(info.parentMenuItemId === "delayTime"){
        
        switch(info.menuItemId){
                
                
            case "0.5days":
                
                addMark(0);
                break;
            
            case "oneDay":
                
                addMark(1);
                break;
            
            case "threeDays":
            
                addMark(2);
                break;
        }
            
            
    }
});
//Creating the context menu
chrome.contextMenus.create(delayTimeMenu);

//Creating sub-context menus
chrome.contextMenus.create(halfDayMenu);
chrome.contextMenus.create(oneDayMenu);
chrome.contextMenus.create(threeDayMenu);














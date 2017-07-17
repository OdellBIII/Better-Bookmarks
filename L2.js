// Code by TreBlack

// Declared class wide variables to be used later

// This object holds the information for the notification to be created when a new window launches.

var rNote = {
	type: "basic",
	title: "SFL",
	message: "There are some sites you wanted to launch later. Would you like to launch them now?",
	iconUrl: "SFL.png",
	buttons: [{title: "Yes"}, {title: "Later"}],
	isClickable: true
}

/*

cBooks is an array full of bookmarks that are retrieved when a new window launches

cTabs is an array that is in the code, but I am not too sure of why it's there. I tried deleting it 
and the entire extension stopped working. It's staying in until I come up with a better solution.
*/
var cBooks = [];
var cTabs = [];


//Create bookmark function

function addMark()
{

	/*
		Function returns an array of tabs that are active and are in the current Window. 
		Then in the callback, a bookmark titled "Later" is created.
	*/
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		var tUrl = tabs[0].url;
		
		/*
		This is a situation where I don't understand why I did this. All this line does is push the tab to the end of
		an empty array. The array is used once and never again in the code. I tried deleting it, but the extension didn't work.
		Try it yourself
		*/
		cTabs.push(tabs[0]);
		chrome.bookmarks.create({title: "Later", url: tUrl});
	});


}

//Function that is called when a new window is created

function startUp()
{
	//Creates function with object detailed above
	chrome.notifications.create("starter", rNote);
	
	//Gets an array of bookmarks that has the title "Later"
	chrome.bookmarks.search({title: "Later"}, function(results)
	{
		if(results.length >= 1)
		{
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
	if(buttonIndex === 0)
	{
		for(var i = 0; i <= cBooks.length; i++)
		{
			chrome.tabs.create({url: cBooks[i].url});
			chrome.bookmarks.remove(cBooks[i].id);
		}
	}
	else
	{
		chrome.notifications.clear("starter");
	}
});

//Listener function calls for browserAction interaction and when a Window is created
chrome.browserAction.onClicked.addListener(addMark);
chrome.windows.onCreated.addListener(startUp);
















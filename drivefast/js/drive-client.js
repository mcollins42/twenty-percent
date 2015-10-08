function generateThumbnailUrl(file) {
  // gapi.auth.getToken()
  return file.thumbnailLink;
};

function getAlternateLink(file) {
  if (file.alternateLink) {
    if (file.mimeType.indexOf('application/vnd.google-apps.') == 0) {
      return '<a href="' + file.alternateLink + '"><span class="alt-link">alternate</span></a>';
    } else {
      return '<span class="alt-preview" href= "' + file.alternateLink + '">preview</span>';
    }
  } else {
    return '';
  }
};

function getWebContentLink(file) {
  if (file.webContentLink) {
    return '<a href="' + file.webContentLink + '"><span class="content-link">web content</span></a>';
  } else {
    return '';
  }
};

function generateFileTile(file) {
  return '<div class="file-tile" id="' + file.id + '"> ' +
    '<a href="https://drive.google.com/open?id=' + file.id +
    '" target="_blank">' +
    '<img src="' + generateThumbnailUrl(file) + '"><br/>' +
    '<span class="file-name">' + file.title + '</span></a>' +
    getAlternateLink(file) +
    getWebContentLink(file) +
    '</div>';
};

function loadFiles(parentId) {
  var request = gapi.client.drive.files.list({
    'q': "'" + parentId + "' in parents",
    'fields': 'items(id,title,mimeType,lastViewedByMeDate,modifiedByMeDate,thumbnailLink,webContentLink,defaultOpenWithLink,alternateLink)'
  });
  request.execute(function(response) {
    if (response.items) {
      if (response.items.length == 0) {
	$('#status').html('No items returned');
      }
      $('#file-grid').html('');
      for (var i = 0; i < response.items.length; i++) {
	$('#file-grid').append(generateFileTile(response.items[i]));
      }
      registerHandlers();
    } else {
      $('#log').append('<p>Failed to list files</p>');
    }
  });
};

function loadApi() {
  gapi.client.load("drive", "v2", function() {
    loadFiles('root');
  });
};

function authorize() {
  var params = {
    client_id: '886494239824-mu038ki9d8se5k61aabo0sv8bhffb0tj.apps.googleusercontent.com',
    scope: [
      'https://www.googleapis.com/auth/drive',
    ],
    immediate: true
  };

  gapi.load('auth:client', function () {
    gapi.auth.authorize(params, function(authToken) {
      if (authToken.error) {
	params.immediate = false;
	gapi.auth.authorize(params, function() {
          loadApi();
	});
      } else {
	loadApi();
      }
    });
  });
};

function registerHandlers() {
  $('.alt-preview').click(function(e) {
    var target = e.target;
    var src = e.target.getAttribute('href');
    $('#overlay-iframe').attr('src', src);
    $('#overlay').toggleClass('shown');
  });
};

$(document).ready(function() {
  authorize();
  $('#overlay').click(function() {
    $('#overlay').toggleClass('shown');
  });
});

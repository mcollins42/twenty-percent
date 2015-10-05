function generateThumbnailUrl(file) {
  // gapi.auth.getToken()
  return file.thumbnailLink;
};

function generateFileTile(file) {
  return '<div class="file-tile" id="' + file.id + '"> ' +
    '<a href="https://drive.google.com/open?id=' + file.id +
    '" target="_blank">' +
    '<img src="' + generateThumbnailUrl(file) + '"><br/>' +
    '<span class="file-name">' + file.name + '</span></a>' +
    '</div>';
};

function loadFiles(parentId) {
  var request = gapi.client.drive.files.list({
    'q': "'" + parentId + "' in parents",
    'fields': 'files(id,name,mimeType,viewedByMeTime,modifiedByMeTime,thumbnailLink)'
  });
  request.execute(function(response) {
    if (response.files) {
      if (response.files.length == 0) {
	$('#status').html('No items returned');
      }
      $('#file-grid').html('');
      for (var i = 0; i < response.files.length; i++) {
	$('#file-grid').append(generateFileTile(response.files[i]));
      }
    } else {
      $('#log').append('<p>Failed to list files</p>');
    }
  });
};

function loadApi() {
  gapi.client.load("drive", "v3", function() {
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

$(document).ready(function() {
  authorize();
});

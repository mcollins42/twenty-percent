
var fileMap = {};

function generateThumbnailUrl(file, size, crop) {
  var options = '=s' + (size || 220);
  if (crop) {
    options += '-' + crop;
  }
  var accessToken = gapi.auth.getToken().access_token;
  return 'https://lh3.googleusercontent.com/d/' + file.id + options +
      '?access_token=' + accessToken;
};

function getAlternateLink(file) {
  if (file.alternateLink) {
    if (file.mimeType.indexOf('application/vnd.google-apps.') == 0) {
      return '<a href="' + file.alternateLink + '"><span class="alt-link">alternate</span></a>';
    } else {
      var src = file.alternateLink.replace('/view?usp=drivesdk', '/preview');
      return '<span class="alt-preview" href= "' + src + '">preview</span>';
    }
  } else {
    return '';
  }
};

function getPreviewLink(file) {
  if (file.alternateLink) {
    if (file.mimeType.indexOf('application/vnd.google-apps.') == 0) {
      return '';
    } else {
      return file.alternateLink.replace('/view?usp=drivesdk', '/preview');
    }
  }
  return '';
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
    '<img src="' + generateThumbnailUrl(file, 220, 'c') + '"><br/>' +
    '<span class="file-name">' + file.title + '</span></a>' +
    getAlternateLink(file) +
    getWebContentLink(file) +
    '</div>';
};

function generateFileListEntry(file) {
  return '<div class="file-list-item" id="' + file.id + '"> ' +
    '<span class="icon-holder"><img src="' + file.iconLink + '"></span>' +
    '<a href="https://drive.google.com/open?id=' + file.id +
    '" target="_blank">' +
    '<span class="file-name">' + file.title + '</span></a>' +
    '</div>';
};

function generateDetails(file) {
  var thumb =
    '<div class="thumbnail"><img src="' + generateThumbnailUrl(file, 400) + '"></div>';
  var previewLink = getPreviewLink(file);
  var preview = previewLink ?
    '<div class="preview"><span class="preview-link" src="' + previewLink +
    '">preview</span></div>' : '';
  return thumb + preview;
}

function loadFiles(parentId) {
  var request = gapi.client.drive.files.list({
    'q': "'" + parentId + "' in parents",
    'fields': 'items(id,iconLink,title,mimeType,lastViewedByMeDate,modifiedByMeDate,thumbnailLink,webContentLink,defaultOpenWithLink,alternateLink)'
  });
  request.execute(function(response) {
    if (response.items) {
      if (response.items.length == 0) {
	      $('#status').html('No items returned');
      }
      fileMap = new Map(response.items.map(function(file) { return [file.id, file]; }));

      var items = [];
      for (var i = 0; i < response.items.length; i++) {
	      items.push(generateFileListEntry(response.items[i]));
      }
      $('#file-list').html(items.join(''));
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
  $('.file-list-item').click(function(e) {
    var id = e.target.id;
    var file = fileMap.get(id);
    $('#details-content').html(generateDetails(file));
    detailsHandlers();
  });
};

function detailsHandlers() {
  $('.preview-link').click(function(e) {
    var target = e.target;
    var src = e.target.getAttribute('src');
    $('#overlay-iframe').attr('src', src);
    $('#overlay').toggleClass('shown');
  });
};

$(document).ready(function() {
  authorize();
  $('#close').click(function() {
    $('#overlay').toggleClass('shown');
  });
});

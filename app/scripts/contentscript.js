'use strict';

var missingGithubLinks = {

  packageType: null,

  init: function( type ) {
    if( !type ) {
      return;
    }

    this.packageType = type;

    try {
      this._run();
    } catch(err) {
      console.error(err);
    }
  },

  _run: function() {
    var self = this;
    if(self.packageType === 'npm') {
      self.registryList = npmRegistry.rows;
      chrome.runtime.sendMessage({action: 'init', value: self.packageType});
    }else if(self.packageType === 'bower') {
      self.registryList = bowerRegistry.rows;
      chrome.runtime.sendMessage({action: 'init', value: self.packageType});
    }

    self._updateDom();
  },

  _updateDom: function() {
    var self = this;

    $('.code-body a span').unwrap();

    var types = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    var list = types.map(function( item ) {
      return self._getPackageNodes(item);
    });

    $.each(list, function( index, item ) {
      self._createLinkTag(item);
    });
  },

  _getPackageNodes: function( selector ) {
    var root = $('.code-body .nt:contains(\'' + selector + '\')');

    if( !root || root.length === 0 ) {
      return [];
    }

    var result = [];
    var el;
    var elVersion = null;
    var next = root.parent().next();

    if( next ) {
      while( next.children().length !== 1 ) {
        el = next.children().eq(0);
        elVersion = next.children().eq(2);
        var targetURL = null;
        if(elVersion.length) {
            var versionString = elVersion.html().replace(/"/g, '');
            if(versionString.split('/').length === 2) {
                targetURL = 'https://github.com/' + versionString;
            }
        }

        var pkgData = {
          el: el,
          pkgName: el.html().replace(/"/g, ''),
          targetURL: targetURL
        };

        result.push(pkgData);
        next = next.next();
      }
    }
    return result;
  },

  _createLinkTag: function( list ) {
    var self = this;

    $.each(list, function( index, item ) {
      var link = self.registryList[item.pkgName];
      var $link = $('<a>');

      if(item.targetURL) {
        link = item.targetURL;
      } else if( !link && self.packageType === 'npm' ) {
        link = 'https://npmjs.org/package/' + item.pkgName;
      }

      if( link ) {
        $link.attr('href', link)
        .on('click', function() {
          var url =  $(this).attr('href');
          chrome.runtime.sendMessage({action: 'forwarding', value: url});
        });
        item.el.wrap($link);
      } else {
        item.el.addClass('tooltipped tooltipped-e').attr('aria-label', 'Sorry, there is no link for this package available');
      }
    });
  }
};

var validate = require('jsonschema').validate;
require("setimmediate");

function ElementQuery (styles) {
  this.styles = styles;
};

ElementQuery.prototype.hook = function (elem) {
  setImmediate(function () {
    var parent = elem.parentElement;
    var width = parent.clientWidth;
    var height = parent.clientHeight;
    var style = this.styles(width, height);
    this.recurse(elem, style)
  }.bind(this))
};

ElementQuery.prototype.recurse = function (elem, style) {
  if (this.match(elem, style)) {
    this.setStyle(elem, style.properties);
    if (elem.childNodes && style.children) {
      for (var i=0;i<elem.childNodes.length;i++) {
        for (var j=0;j<style.children.length;j++) {
          console.log(elem.childNodes[i], style.children[j])
          this.recurse(elem.childNodes[i], style.children[j])
        }
      }
    }
  }
};

ElementQuery.prototype.setStyle = function (elem, properties) {
  var inlineStyle = JSON.stringify(properties)
                        .replace(/[{}"]/g, '')
                        .replace(/,/g, '; ');
  elem.setAttribute('style', inlineStyle);
};

ElementQuery.prototype.match = function (elem, style) {
  if (typeof style.className === 'string' && elem.classList.contains(style.className)) return true;
  if (typeof style.className === 'object') {
    var validation = validate(elem.className, style.className);
    return validation.errors.length === 0 ? true : false;
  }
};

module.exports = ElementQuery;

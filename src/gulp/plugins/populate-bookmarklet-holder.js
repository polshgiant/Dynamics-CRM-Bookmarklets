/* globals Buffer */
var _ = require('lodash'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    template;

// Use handlebars like syntax
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

/*template = _.template([
    "<a href='javascript:{{ Script }}' class='card bookmarklet' title='Drag me to your bookmarks bar!'>",
        "<div class='card-block'>",
            "<header class='bookmarklet-header'>{{ Title }}</header>",
            "<span class='card-text bookmarklet-description' data-description='{{ Description }}'></span>",
        "</div>",
    "</a>"
].join(''));*/
template = fs.readFileSync('./src/content/templates/partials/bookmarklet-link.hbt', 'utf8');
//console.log(template);
template = _.template(template);

function processFiles(files, snippets, fileFormat) {
    var contents,
        matches,
        snippetName,
        r,
        snippetContents;

    
    //console.log("snippets: ", snippets);
    _.chain(files).filter(function filterToHtml(file, fileName) {
        return path.extname(fileName) === '.html';
    }).each(function (file, fileName) {
        contents = file.contents.toString(fileFormat);
        

        if(file.page !== "index" && file.page !== "record-related") {
            return;
        }

        //console.log("file.page: ", file.page);
        //console.log("    contents: ", contents.slice(150, -200));
        
        _.each(snippets, function (snippet) {
            snippetName = path.basename(snippet, '.js');//.replace(/-/g, '\\-');
            //console.log("    snippet: ", snippetName);
            r = new RegExp('\\[bookmarklet' + 
                '[\\s]+file=&quot;' + snippetName + '&quot;' + 
                '[\\s]+name=&quot;(.*)&quot;' + 
                '[\\s]+description=&quot;(.*)&quot;' + 
                '(?:[\\s]+runFrom=&quot;(.*)&quot;)?' + 
                '[\\s]*\\]', 'gi');

            matches = r.exec(contents);

            if (matches && matches.length >= 3) {
                //console.log("   found match:", matches[0], matches[1], matches[2], matches[3]);

                snippetContents = fs.readFileSync(snippet, fileFormat);
                contents = contents.replace(r, template({
                    Script: snippetContents,
                    Title: matches[1],
                    Description: matches[2],
                    RunFrom: matches[3]
                }));
            }
        });
        
        file.contents = new Buffer(contents);
    }).value();
}

module.exports = function defineTask(options) {
    var globPattern = options.pattern,
        fileFormat = options.format || 'utf8';

    return function doReplace(files, metalsmith, done) {
        glob(globPattern, function (error, snippets) {
            if (error) {
                return console.error(error);
            }

            processFiles(files, snippets, fileFormat);
            
            done();
        });
    };
};
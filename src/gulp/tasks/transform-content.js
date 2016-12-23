// gulp related
var _ = require('lodash'),
    frontMatter = require('gulp-front-matter'),
    populateBookmarkletHolder = require('../plugins/populate-bookmarklet-holder'),
    assignPaths = require('../plugins/assign-paths');
    
// Metalsmith related
var gulpsmith = require('gulpsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    Handlebars = require('handlebars'),
    drafts = require('../plugins/drafts');
    

// Equals helper because Handlebars feels like it must be logicless :(
Handlebars.registerHelper('equals', function (a, b, options) {
    //console.log("HANDLEBARS HELPER: ", a, b);
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

module.exports = function defineTask(gulp) {

    return function transformContent() {
        return gulp.src('./src/content/*.*')
            // Parse the frontmatter and flatten the result object
            //  for use by metalsmith
            .pipe(frontMatter()).on('data', function(file) {
                _.assign(file, file.frontMatter); 
                delete file.frontMatter;
            })
            .pipe(
                // Order of operations is important here
                gulpsmith()
                    // Remove draft files
                    .use(drafts())
                    // Group the files so we can build navigation
                    .use(collections({
                        pages: {
                            pattern: '*.md',
                            sortBy: 'index',
                            refer: false
                        }
                    }))
                    // Render each markdown file as HTML
                    .use(markdown())
                    // Insert Code Snippets
                    .use(populateBookmarkletHolder({
                        pattern: './dist/bookmarklets/**/*.js',
                    }))
                    // Permalinks jacks things up, so assign our own paths
                    .use(assignPaths())
                    // Encapsulate each markdown file in its template
                    .use(templates({
                        engine: 'handlebars',
                        directory: './src/content/templates/',
                        partials: {
                            'github-link': 'partials/github-link',
                            'google-analytics': 'partials/google-analytics',
                            'header': 'partials/header',
                            'navigation': 'partials/navigation',
                            'scripts': 'partials/scripts'
                        }
                    }))
            )
            .pipe(gulp.dest('./dist/site/'));
    };
    
};
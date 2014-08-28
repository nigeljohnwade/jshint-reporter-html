// Author: Nigel Wade, based on work by Boy Baukema
// http://github.com/nigeljohnwade

module.exports =
{
    reporter: function (results, data, opts)
    {
        "use strict";

        var files = {},
            errors = {},
            out = [],
            pairs = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            },
            fileName, 
            errorName,
            i, 
            issue,  
            complexity = [];

        opts = opts || {};

        results.forEach(function (result) {
            // Register the file in the files object
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }
            // Add the error to the file object, avoiding cyclomatic complexity if turned on
            if(result.error.code !== 'W074') {
                files[result.file].push({
                    error: result.error.id,
                    line: result.error.line,
                    column: result.error.character,
                    message: result.error.reason,
                    evidence: result.error.evidence,
                    code: result.error.code
                });
            //Add complexity errorvalues to a complexity array
            }else{
                var currentComplexity = parseInt(result.error.reason.substring(result.error.reason.indexOf('(') + 1, result.error.reason.lastIndexOf(')')));
                complexity.push(currentComplexity);
            }
            //Register the error in the error object
            if(!errors[result.error.code]){
                errors[result.error.code] = [];
            }

            errors[result.error.code].push({
                file: result.file,
                error: result.error.id,
                line: result.error.line,
                column: result.error.character,
                message: result.error.reason,
                evidence: result.error.evidence,
                code: result.error.code
            });
        });
        
        


        out.push("<!DOCTYPE html><html><head><title>JSHint Results</title><style>label{display: block;cursor:pointer;}input{display: none}ol{display:none;}ul li :checked + ol{display:block;}</style></head><body><h1>JSHint Results</h1>");
        if(complexity.length > 0) {
            out.push("<section><header><h2>Application Level</h2></header><p>Timestamp: " + new Date() + "</p><p>Highest cyclomatic complexity is " + Math.max.apply(Math, complexity) + "</p></section>");
        }
        out.push("<section><header><h2>By File</h2></header>");
        out.push("<ul>");
        for (fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                if(files[fileName].length> 0) {
                    out.push("<li>");
                    out.push("<label for='" + fileName.replace(/\\/g, '') + "'>" + fileName.replace(/\\/g, '') + " (" + files[fileName].length + ")</label>");
                    out.push("<input type='checkbox' id='" + fileName.replace(/\\/g, '') + "'>");
                    out.push('<ol>');
                    for (i = 0; i < files[fileName].length; i++) {
                        out.push('<li>');
                        issue = files[fileName][i];
                        var errorString = "<p>At line" + issue.line + ", char " + issue.column + "</p>" +
                            //"<p>" + issue.error + " (" + issue.code + ")</p>" +
                            "<p><code>" + issue.message + "</code> in " +
                            "<code>" + issue.evidence + "</code></p>"
                        out.push(errorString);
                        out.push('</li>');
                    }
                    out.push('</ol>');
                    out.push('</li>');
                    out.push("<hr>");
                }
            }
        }
        out.push("</ul>");
        out.push("</section>");

        out.push("<section><header><h2>By Error</h2></header>");
        out.push("<ul>");
        for (errorName in errors) {
            if (errors.hasOwnProperty(errorName)) {
                if(errors[errorName].length> 0) {
                    out.push("<li>");
                    out.push("<label for='" + errorName + "'>" + errorName +  " - " + errors[errorName][0].message + " (" + errors[errorName].length + ")</label>");
                    out.push("<input type='checkbox' id='" + errorName + "'>");
                    out.push('<ol>');
                    for (i = 0; i < errors[errorName].length; i++) {
                        out.push('<li>');
                        issue = errors[errorName][i];
                        var errorString = "<p>At line" + issue.line + ", char " + issue.column + "</p>" +
//                            //"<p>" + issue.error + " (" + issue.code + ")</p>" +
                            "<p><code>" + issue.message + "</code> in " +
                            "<code>" + issue.evidence + "</code></p>"
                        out.push(errorString);
                        out.push('</li>');
                    }
                    out.push('</ol>');
                    out.push('</li>');
                    out.push("<hr>");
                }
            }
        }
        out.push("</ul>");
        out.push("</section>");
        out.push("</body></html>");

        console.log(out.join("\n"));
    }
};


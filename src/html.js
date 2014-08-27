// Author: Nigel Wade, based on work by Boy Baukema
// http://github.com/nigeljohnwade

module.exports =
{
    reporter: function (results, data, opts)
    {
        "use strict";

        var files = {},
            out = [],
            pairs = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            },
            fileName, 
            i, 
            issue, 
            errorMessage, 
            complexity = [];

        opts = opts || {};

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }

        results.forEach(function (result) {
            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }
            // Add the error
            if(result.error.code !== 'W074') {
                files[result.file].push({
                    error: result.error.id,
                    line: result.error.line,
                    column: result.error.character,
                    message: result.error.reason,
                    evidence: result.error.evidence,
                    code: result.error.code
                });
           }else{
                var currentComplexity = parseInt(result.error.reason.substring(result.error.reason.indexOf('(') + 1, result.error.reason.lastIndexOf(')')));
                complexity.push(currentComplexity);
           }
        });
        
        


        out.push("<!DOCTYPE html><html><head><title>JSHint Results</title><style>label{display: block;cursor:pointer;}input{display: none}ol{display:none;}ul li :checked + ol{display:block;}</style></head><body><h1>JSHint Results</h1>");
        if(complexity.length > 0) {
            out.push("<section><header><h2>Application Level</h2></header><p>Max complexity is " + Math.max.apply(Math, complexity) + "</p></section>");
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
        out.push("</section>");

        out.push("</ul></body></html>");

        console.log(out.join("\n"));
    }
};


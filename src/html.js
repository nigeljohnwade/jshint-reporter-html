// Author: Boy Baukema
// http://github.com/relaxnow
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
            fileName, i, issue, errorMessage;

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
            files[result.file].push({
                error: result.error.id,
                line: result.error.line,
                column: result.error.character,
                message: result.error.reason,
                evidence: result.error.evidence,
                code: result.error.code
            });
        });


        out.push("<!DOCTYPE html><html><head><title>JS Hint</title></head><body><h1></h1>");
        
        out.push("<ul>")
        for (fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                out.push("<h2>" + fileName + "</h2>");
                out.push('<ol>');
                for (i = 0; i < files[fileName].length; i++) {
                    out.push('<li>');
                    issue = files[fileName][i];
                    var errorString = "<p>At line" + issue.line + ", char " + issue.column + "</p>" +
                        //"<p>" + issue.error + " (" + issue.code + ")</p>" +
                        "<p><code>" + issue.message + "</code> in " +
                    "<code>" + issue.evidence + "</code></p>"
                    out.push(errorString);
                    out.push('</li>')
                }
                out.push('</ol>')
                out.push("<hr>");
            }
        }

        out.push("</ul></body></html>");

        console.log(out.join("\n"));
    }
};

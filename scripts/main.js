// This code is an obvious mess but I prioritized other things as the front-end was not the project's primary purpose
// It essentially uses the API to update the colours of all criteria on the page
function submission() {
    var editor = ace.edit("editor");
    var code = editor.getSession().getValue();
    try {
        var wh_res = challenger.whitelist(["FunctionDeclaration", "VariableDeclaration"],code);
        var bl_res = challenger.blacklist(["ForStatement"],code);
        var st_res = challenger.structure(["WhileStatement","IfStatement","CallExpression"],code);
    } catch(err) {
        document.getElementById("overall_result").innerHTML = "Failed to parse code. Please check for errors.";
        document.getElementById("overall_result").className = "error_message";
        return 1;
    }

    overall_result = true;
    for (var i = 0; i < wh_res.length; i++) {
        var mes = document.getElementById("whitelist").childNodes[1+i*2];
        if (wh_res[i] === true) {
            mes.className = "success_message";
        } else {
            mes.className = "error_message";
            overall_result = false;
        }
    }
    for (var i = 0; i < bl_res.length; i++) {
        var mes = document.getElementById("blacklist").childNodes[1+i*2];
        if (bl_res[i] === true) {
            mes.className = "success_message";
        } else {
            mes.className = "error_message";
            overall_result = false;
        }
    }            
    for (var i = 0; i < st_res.length; i++) {
        var mes = document.getElementById("structure").childNodes[1+i*2];
        if (st_res[i] === true) {
            mes.className = "success_message";
        } else {
            mes.className = "error_message";
            overall_result = false;
        }
    }

    if (overall_result === true) {
        document.getElementById("overall_result").innerHTML = "GOOD JOB!";
        document.getElementById("overall_result").className = "success_message";
    } else {
        document.getElementById("overall_result").innerHTML = " ";
    }
}

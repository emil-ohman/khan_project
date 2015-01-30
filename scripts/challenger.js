/***
* Overview:
*   The "challenger" API has three methods (see below) that examine input code.
*   The input code has to be written in JavaSript, and the input parameters to the methods have to be valid Esprima expressions (see below).
* 
* Dependencies:
*   esprima.js
* 
* Methods
*   1. whitelist(lst,code)
*      Converts all elements in list "lst" of Esprima expressions into true if the expression exists in "code," otherwise false.
*      More intuitively, it checks if each element occurs in "code."
*   2. blacklist(lst,code)
*      Converts all elements in list "lst" of Esprima expressions into true if the expression does not exist in "code," otherwise false.
*      More intuitively, it checks if each element does not occur in "code."
*   3. structure(lst,code)
*      Converts all elements in list "lst" of Esprima expressions to true if it is contained in the bodies of all expressions to its left in "lst." 
*      More intuitively, it checks if each element is contained in the previous elements.
* 
* Valid Esprima expressions:
*   AssignmentExpression
*   ArrayExpression
*   BlockStatement
*   BinaryExpression
*   BreakStatement
*   CallExpression
*   CatchClause
*   ConditionalExpression
*   ContinueStatement
*   DoWhileStatement
*   DebuggerStatement
*   EmptyStatement
*   ExpressionStatement
*   ForStatement
*   ForInStatement
*   FunctionDeclaration
*   FunctionExpression
*   Identifier
*   IfStatement
*   Literal
*   LabeledStatement
*   LogicalExpression
*   MemberExpression
*   NewExpression
*   ObjectExpression
*   Program
*   Property
*   ReturnStatement
*   SequenceExpression
*   SwitchStatement
*   SwitchCase
*   ThisExpression 
*   ThrowStatement 
*   TryStatement
*   UnaryExpression
*   UpdateExpression
*   VariableDeclaration
*   VariableDeclarator
*   WhileStatement
*   WithStatement
* 
***/

var challenger = (function() {
    var bool_lst, check_lst;

    // Updates "check_lst" to "passed_lst" and "bool_lst" to all false. Returns "code" processed with esprima.
    function pre_process(passed_lst, code) {
        check_lst = passed_lst;
        bool_lst = [];
        for(var i = 0; i < check_lst.length; i++)
            bool_lst.push(false);

        try {
            var syntax = esprima.parse(code);
        } catch (err) {
            throw "Missing challenger dependency: esprima";
        }
        return syntax;
    }

    // Executes visitor on the object and its children, passing a copy of "info_array" to its recursive calls.
    function traverse(syntax, info_array, visitor) {
        var key, child;
        if (typeof(info_array) != 'undefined') {
            var info_array = info_array.slice(0);
        }
        visitor.call(null, syntax, info_array);
        for (key in syntax) {
            if (syntax.hasOwnProperty(key)) {
                child = syntax[key];
                if (typeof child === 'object' && child !== null) {
                    traverse(child, info_array, visitor);
                }
            }
        }
    }

    return {
        // Calls pre_process() and then traverses the code looking for the desired elements
        whitelist : function(lst, code) {
            var syntax = pre_process(lst,code);
            traverse(syntax, undefined, function (node, info_object) {
                for (var j = 0; j < check_lst.length; j++) {
                    if (node.type === check_lst[j]) {
                        bool_lst[j] = true;
                    }
                }
            });
            return bool_lst;
        },
        // Identical to whitelist, but ends by reversing "bool_lst"
        blacklist : function(lst, code) {
            var syntax = pre_process(lst,code);
            traverse(syntax, undefined, function (node, info_object) {
                for (var j = 0; j < check_lst.length; j++) {
                    if (node.type === check_lst[j]) {
                        bool_lst[j] = true;
                    }
                }
            });
            for (var i = 0; i < check_lst.length; i++) {
                bool_lst[i] = !bool_lst[i];
            }
            return bool_lst;
        },
        // Calls pre_process() and then traverses the code, passing along an array keeping track of which elements have been visited.
        structure : function(lst, code) {
            var syntax = pre_process(lst,code);
            traverse(syntax, bool_lst, function (node, bool_lst_copy) {
                for (var j = 0; j < check_lst.length; j++) {
                    if (node.type === check_lst[j] && (j === 0 || j>0 && bool_lst_copy[j-1] === true)) {
                        bool_lst[j] = true;
                        bool_lst_copy[j] = true;
                    }
                }
            });
            return bool_lst;
        }
    }
})();
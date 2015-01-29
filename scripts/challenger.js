/***
* Overview:
*   
* Dependencies:
*   esprima.js
* 
* Functions:
*   1. whitelist(lst,syntax)
*      Converts all elements in list "lst" of Esprima expressions into true if the expression exists in "syntax," otherwise false.
*      More intuitively, it checks if each element occurs.
*   2. blacklist(lst,syntax)
*      Converts all elements in list "lst" of Esprima expressions into false if the expression exists in "syntax," otherwise true.
*      More intuitively, it checks if each element does not occur.
*   3. structure(lst,syntax)
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
    var boolst;
    // Executes visitor on the object and its children (recursively).
    function traverse(object, visitor) {
        var key, child;

        visitor.call(null, object);
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    traverse(child, visitor);
                }
            }
        }
    }
    function structTraverse(object, passed_boolst, lst) {
        var key, child;
        var boolstcopy = passed_boolst.slice(0);

        for (var j = 0; j < lst.length; j++) {
            if (object.type === lst[j] && (j === 0 || j>0 && boolstcopy[j-1] === true)) {
                boolst[j] = true;
                boolstcopy[j] = true;
            }
        }
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    structTraverse(child, boolstcopy, lst);
                }
            }
        }
    }

    return {
        whitelist : function(lst,code) {
            // Assumes each element is not in syntax
            var syntax = esprima.parse(code);
            boolst = [];
            for(var i = 0; i < lst.length; i++)
                boolst.push(false);
            // Traverses the syntax in search for whitelisted types
            traverse(syntax, function (node) {
                for (var j = 0; j < lst.length; j++) {
                    if (node.type === lst[j]) {
                        boolst[j] = true;
                    }
                }
            });
            return boolst;
        },
        blacklist : function(lst,code) {
            // Assumes each element is in syntax
            var syntax = esprima.parse(code);
            boolst = [];
            for(var i = 0; i < lst.length; i++)
                boolst.push(true);
            // Traverses the syntax in search for blacklisted types
            traverse(syntax, function (node) {
                for (var j = 0; j < lst.length; j++) {
                    if (node.type === lst[j]) {
                        boolst[j] = false;
                    }
                }
            });
            return boolst;
        },
        structure : function(lst,code) {
            // Assumes each element is part of the wrong structure
            var syntax = esprima.parse(code);
            boolst = [];
            for(var i = 0; i < lst.length; i++)
                boolst.push(false);
            structTraverse(syntax, boolst,lst);
            return boolst;
        }
    }
})();
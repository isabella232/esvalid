/* global suite test */
"use strict";
var assert = require("assert");

var esvalid = require("..");
function valid(x, msg) { assert.ok(esvalid.isValid(x), msg); }
function invalid(x, msg) { assert.ok(!esvalid.isValid(x), msg); }

var STMT = {type: "EmptyStatement"};
var BLOCK = {type: "BlockStatement", body: []};
var EXPR = {type: "Literal", value: null};
var NUM = {type: "Literal", value: 0};
var STR = {type: "Literal", value: "a"};
var ID = {type: "Identifier", name: "a"};
var CATCH = {type: "CatchClause", param: ID, body: BLOCK};

suite("unit", function(){

  test("non-nodes", function() {
    invalid(null);
    invalid(0);
    invalid({});
    invalid("Program");
    invalid({type: null});
    invalid({type: false});
    invalid({type: ""});
    invalid({type: "Node"});
  });

  test("Node", function() {
    invalid({type: "EmptyStatement", loc: {}});
    invalid({type: "EmptyStatement", loc: {start: null, end: 0}});
    invalid({type: "EmptyStatement", loc: {start: {}, end: {}}});
    invalid({type: "EmptyStatement", loc: {start: {line: "a", column: "b"}, end: {line: "a", column: "b"}}});
    invalid({type: "EmptyStatement", loc: {start: {line: 0, column: 0}, end: {line: 1, column: 0}}});
    invalid({type: "EmptyStatement", loc: {start: {line: 1, column: 0}, end: {line: 0, column: 0}}});
    invalid({type: "EmptyStatement", loc: {start: {line: 1, column: -1}, end: {line: 1, column: 0}}});
    invalid({type: "EmptyStatement", loc: {start: {line: 1, column: 0}, end: {line: 1, column: -1}}});
    invalid({type: "EmptyStatement", loc: {source: 0, start: {line: 1, column: 0}, end: {line: 1, column: 0}}});
    valid({type: "EmptyStatement", loc: {start: {line: 1, column: 0}, end: {line: 1, column: 0}}});
    valid({type: "EmptyStatement", loc: {source: "", start: {line: 1, column: 0}, end: {line: 1, column: 0}}});
    valid({type: "EmptyStatement", loc: null});
  });


  test("ArrayExpression", function() {
    valid({type: "ArrayExpression", elements: []});
    valid({type: "ArrayExpression", elements: [null]});
    valid({type: "ArrayExpression", elements: [EXPR]});
    valid({type: "ArrayExpression", elements: [EXPR, EXPR]});
    valid({type: "ArrayExpression", elements: [EXPR, null, EXPR]});
    invalid({type: "ArrayExpression"});
    invalid({type: "ArrayExpression", elements: [STMT]});
  });

  test("IfStatement", function() {
    valid({type: "IfStatement", test: EXPR, consequent: STMT});
    valid({type: "IfStatement", test: EXPR, consequent: BLOCK});
    valid({type: "IfStatement", test: EXPR, consequent: STMT, alternate: STMT});
    valid({type: "IfStatement", test: EXPR, consequent: BLOCK, alternate: BLOCK});
    valid({type: "IfStatement", test: EXPR, consequent: STMT, alternate: BLOCK});
    valid({type: "IfStatement", test: EXPR, consequent: BLOCK, alternate: STMT});
    invalid({type: "IfStatement", test: EXPR});
    invalid({type: "IfStatement", test: STMT, consequent: STMT});
    invalid({type: "IfStatement", test: EXPR, consequent: EXPR});
    invalid({type: "IfStatement", test: EXPR, alternate: STMT});
    invalid({type: "IfStatement", test: EXPR, consequent: {type: "IfStatement", test: EXPR, consequent: STMT}, alternate: STMT});
    invalid({type: "IfStatement", test: EXPR, consequent: {type: "IfStatement", test: EXPR, consequent: STMT, alternate: {type: "IfStatement", test: EXPR, consequent: STMT}}, alternate: STMT});
    invalid({type: "IfStatement", test: EXPR, consequent: {type: "IfStatement", test: EXPR, consequent: {type: "IfStatement", test: EXPR, consequent: STMT}}, alternate: STMT});
  });

  test("ObjectExpression", function() {
    valid({type: "ObjectExpression", properties: []});
    valid({type: "ObjectExpression", properties: [{kind: "init", key: ID, value: EXPR}]});
    valid({type: "ObjectExpression", properties: [{kind: "get", key: ID, value: EXPR}]});
    valid({type: "ObjectExpression", properties: [{kind: "set", key: ID, value: EXPR}]});
    valid({type: "ObjectExpression", properties: [{kind: "init", key: NUM, value: EXPR}]});
    valid({type: "ObjectExpression", properties: [{kind: "init", key: STR, value: EXPR}]});
    invalid({type: "ObjectExpression"});
    invalid({type: "ObjectExpression", properties: [{key: ID, value: EXPR}]});
    invalid({type: "ObjectExpression", properties: [{kind: "-", key: ID, value: EXPR}]});
    invalid({type: "ObjectExpression", properties: [{kind: "init", key: STMT, value: EXPR}]});
    invalid({type: "ObjectExpression", properties: [{kind: "init", key: ID, value: STMT}]});
    invalid({type: "ObjectExpression", properties: [{kind: "init", key: ID, value: BLOCK}]});
    invalid({type: "ObjectExpression", properties: [{kind: "init", key: EXPR, value: EXPR}]});
    invalid({type: "ObjectExpression", properties: [{kind: "init", key: {type: "Literal", value: null}, value: EXPR}]});
    invalid({type: "ObjectExpression", properties: [{kind: "init", key: {type: "Literal", value: /./}, value: EXPR}]});
  });

  test("Program", function() {
    invalid({type: "Program"});
    invalid({type: "Program", body: null});
    valid({type: "Program", body: []});
    valid({type: "Program", body: [STMT]});
    valid({type: "Program", body: [STMT, STMT]});
    invalid({type: "Program", body: [STMT, EXPR, STMT]});
  });

  test("SequenceExpression", function() {
    invalid({type: "SequenceExpression"});
    invalid({type: "SequenceExpression", expressions: null});
    invalid({type: "SequenceExpression", expressions: []});
    invalid({type: "SequenceExpression", expressions: [EXPR]});
    valid({type: "SequenceExpression", expressions: [EXPR, EXPR]});
  });

  test("SwitchStatement", function() {
    invalid({type: "SwitchStatement", discriminant: EXPR});
    invalid({type: "SwitchStatement", discriminant: EXPR, cases: null});
    invalid({type: "SwitchStatement", discriminant: EXPR, cases: []});
    valid({type: "SwitchStatement", discriminant: EXPR, cases: [{type: "SwitchCase", test: EXPR, consequent: []}]});
  });

  test("TryStatement", function() {
    invalid({type: "TryStatement"});
    invalid({type: "TryStatement", block: BLOCK});
    invalid({type: "TryStatement", block: BLOCK, handler: BLOCK});
    invalid({type: "TryStatement", block: BLOCK, handlers: []});
    invalid({type: "TryStatement", block: BLOCK, handlers: [CATCH, null, CATCH]});
    invalid({type: "TryStatement", block: BLOCK, handlers: [CATCH, BLOCK, CATCH]});
    valid({type: "TryStatement", block: BLOCK, handler: CATCH});
    valid({type: "TryStatement", block: BLOCK, finalizer: BLOCK});
    valid({type: "TryStatement", block: BLOCK, handler: CATCH, finalizer: BLOCK});
    valid({type: "TryStatement", block: BLOCK, handlers: [CATCH]});
    valid({type: "TryStatement", block: BLOCK, handlers: [CATCH, CATCH]});
    valid({type: "TryStatement", block: BLOCK, finalizer: BLOCK});
    valid({type: "TryStatement", block: BLOCK, handler: CATCH, finalizer: BLOCK});
  });

  test("VariableDeclaration", function() {
    invalid({type: "VariableDeclaration"});
    invalid({type: "VariableDeclaration", declarations: null});
    invalid({type: "VariableDeclaration", declarations: []});
    valid({type: "VariableDeclaration", declarations: [{type: "VariableDeclarator", id: ID}]});
    valid({type: "VariableDeclaration", declarations: [{type: "VariableDeclarator", id: ID, init: EXPR}]});
    valid({type: "VariableDeclaration", declarations: [{type: "VariableDeclarator", id: ID}, {type: "VariableDeclarator", id: ID}]});
  });

});

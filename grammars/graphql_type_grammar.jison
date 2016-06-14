/* lexical grammar */
%lex

%{
  // Pre-lexer code can go here
%}

%%

[\s\r\n]+               /* skip whitespace */
"type"                return 'type'
"implements"          return 'implements'
"{"                   return '{'
"}"                   return '}'
"("                   return '('
")"                   return ')'
"["                   return '['
"]"                   return ']'
"!"                   return '!'
","                   return ','
":"                   return ':'
'\'\'\''              return 'DOCSTRING_DELIMETER'
[A-Z][a-zA-Z_0-9]*    return 'TYPE_NAME'
[a-z][a-zA-Z_0-9]*    return 'FIELD_NAME'
[a-zA-Z_0-9]+			    return 'WORD'
(.|\n)                return 'CHAR'
<<EOF>>               return 'EOF'

/lex

%start expressions

%left 'TYPE_NAME' 'FIELD_NAME' 'WORD'

%% /* language grammar */

expressions
    : type_definition 'EOF' { return yy.parser.yy; }
    ;

type_definition
    : 'type' 'TYPE_NAME' 'implements' type_list '{' field_list '}'
        { return {'name': $2, 'implements': $4, 'fields': $6}; }
    | 'type' 'TYPE_NAME' '{' field_list '}'
        { return {'name': $2, 'implements': [], 'fields': $4}; }
    | 'type' 'TYPE_NAME' '{' '}'
        { return {'name': $2, 'implements': [], 'fields': []}; }
    ;

type_list
    : type_list ',' TYPE_NAME
        { $$ = $1; $$.push($3); }
    | TYPE_NAME
        { $$ = [$1]; }
    ;

field_list
    : field_list field
        { $$ = $1; $$.push($2); }
    | field
        { $$ = [$1]; }
    ;

field
    : FIELD_NAME field_arguments ':' field_type '!'
        { $$ = {'name': $1, 'args': $2, 'type': $4, 'required': true}; }
    | FIELD_NAME field_arguments ':' field_type
        { $$ = {'name': $1, 'args': $2, 'type': $4, 'required': false}; }
    ;

field_arguments
    : '(' field_argument_list ')'
        { $$ = $2; }
    |
        { $$ = []; }
    ;

field_argument_list
    : field_argument_list ',' field_argument
        { $$ = $1; $$.push($3); }
    | field_argument
        { $$ = [$1]; }
    ;

field_argument
    : FIELD_NAME ':' field_type '!'
        { $$ = {'name': $1, 'type': $3, 'required': true}; }
    | FIELD_NAME ':' field_type
        { $$ = {'name': $1, 'type': $3, 'required': false}; }
    ;

field_type
    : '[' TYPE_NAME ']'
        { $$ = {'name': $2, 'isList': true}; }
    | TYPE_NAME
        { $$ = {'name': $1, 'isList': false}; }
    ;

%%

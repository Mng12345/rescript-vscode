// Generated by ReScript, PLEASE EDIT WITH CARE

import * as List from "rescript/lib/es6/list.js";
import * as $$String from "rescript/lib/es6/string.js";
import * as Pervasives from "rescript/lib/es6/pervasives.js";
import * as Res_minibuffer from "./res_minibuffer.js";

var line = {
  TAG: /* LineBreak */5,
  _0: /* Classic */0
};

var softLine = {
  TAG: /* LineBreak */5,
  _0: /* Soft */1
};

function text(s) {
  return {
          TAG: /* Text */0,
          _0: s
        };
}

function _concat(_acc, _l) {
  while(true) {
    var l = _l;
    var acc = _acc;
    if (!l) {
      return acc;
    }
    var s1 = l.hd;
    if (typeof s1 === "number") {
      if (s1 === /* Nil */0) {
        _l = l.tl;
        continue ;
      }
      
    } else {
      switch (s1.TAG | 0) {
        case /* Text */0 :
            var match = l.tl;
            if (match) {
              var s2 = match.hd;
              if (typeof s2 !== "number" && s2.TAG === /* Text */0) {
                return {
                        hd: {
                          TAG: /* Text */0,
                          _0: s1._0 + s2._0
                        },
                        tl: _concat(acc, match.tl)
                      };
              }
              
            }
            break;
        case /* Concat */1 :
            _l = s1._0;
            _acc = _concat(acc, l.tl);
            continue ;
        default:
          
      }
    }
    var rest = l.tl;
    var rest1 = _concat(acc, rest);
    if (rest1 === rest) {
      return l;
    } else {
      return {
              hd: s1,
              tl: rest1
            };
    }
  };
}

function concat(l) {
  return {
          TAG: /* Concat */1,
          _0: _concat(/* [] */0, l)
        };
}

function indent(d) {
  return {
          TAG: /* Indent */2,
          _0: d
        };
}

function ifBreaks(t, f) {
  return {
          TAG: /* IfBreaks */3,
          yes: t,
          no: f,
          broken: false
        };
}

function lineSuffix(d) {
  return {
          TAG: /* LineSuffix */4,
          _0: d
        };
}

function group(d) {
  return {
          TAG: /* Group */6,
          shouldBreak: false,
          doc: d
        };
}

function breakableGroup(forceBreak, d) {
  return {
          TAG: /* Group */6,
          shouldBreak: forceBreak,
          doc: d
        };
}

function customLayout(gs) {
  return {
          TAG: /* CustomLayout */7,
          _0: gs
        };
}

var comma = {
  TAG: /* Text */0,
  _0: ","
};

var trailingComma = {
  TAG: /* IfBreaks */3,
  yes: comma,
  no: /* Nil */0,
  broken: false
};

function propagateForcedBreaks(doc) {
  var walk = function (_doc) {
    while(true) {
      var doc = _doc;
      if (typeof doc === "number") {
        if (doc === /* BreakParent */1) {
          return true;
        } else {
          return false;
        }
      }
      switch (doc.TAG | 0) {
        case /* Concat */1 :
            return List.fold_left((function (forceBreak, child) {
                          var childForcesBreak = walk(child);
                          if (forceBreak) {
                            return true;
                          } else {
                            return childForcesBreak;
                          }
                        }), false, doc._0);
        case /* Indent */2 :
            _doc = doc._0;
            continue ;
        case /* IfBreaks */3 :
            var trueDoc = doc.yes;
            var falseForceBreak = walk(doc.no);
            if (falseForceBreak) {
              walk(trueDoc);
              doc.broken = true;
              return true;
            }
            _doc = trueDoc;
            continue ;
        case /* LineBreak */5 :
            return doc._0 >= 2;
        case /* Group */6 :
            var forceBreak = doc.shouldBreak;
            var childForcesBreak = walk(doc.doc);
            var shouldBreak = forceBreak || childForcesBreak;
            doc.shouldBreak = shouldBreak;
            return shouldBreak;
        case /* CustomLayout */7 :
            walk({
                  TAG: /* Concat */1,
                  _0: doc._0
                });
            return false;
        default:
          return false;
      }
    };
  };
  walk(doc);
  
}

function willBreak(_doc) {
  while(true) {
    var doc = _doc;
    if (typeof doc === "number") {
      if (doc === /* BreakParent */1) {
        return true;
      } else {
        return false;
      }
    }
    switch (doc.TAG | 0) {
      case /* Concat */1 :
          return List.exists(willBreak, doc._0);
      case /* Indent */2 :
          _doc = doc._0;
          continue ;
      case /* IfBreaks */3 :
          if (willBreak(doc.yes)) {
            return true;
          }
          _doc = doc.no;
          continue ;
      case /* LineBreak */5 :
          return doc._0 >= 2;
      case /* Group */6 :
          var match = doc.shouldBreak;
          if (match) {
            return true;
          }
          _doc = doc.doc;
          continue ;
      case /* CustomLayout */7 :
          var match$1 = doc._0;
          if (!match$1) {
            return false;
          }
          _doc = match$1.hd;
          continue ;
      default:
        return false;
    }
  };
}

function join(sep, docs) {
  var loop = function (_acc, sep, _docs) {
    while(true) {
      var docs = _docs;
      var acc = _acc;
      if (!docs) {
        return List.rev(acc);
      }
      var xs = docs.tl;
      var x = docs.hd;
      if (!xs) {
        return List.rev({
                    hd: x,
                    tl: acc
                  });
      }
      _docs = xs;
      _acc = {
        hd: sep,
        tl: {
          hd: x,
          tl: acc
        }
      };
      continue ;
    };
  };
  var l = loop(/* [] */0, sep, docs);
  return {
          TAG: /* Concat */1,
          _0: _concat(/* [] */0, l)
        };
}

function fits(w, stack) {
  var width = {
    contents: w
  };
  var result = {
    contents: undefined
  };
  var calculate = function (_indent, _mode, _doc) {
    while(true) {
      var doc = _doc;
      var mode = _mode;
      var indent = _indent;
      if (result.contents !== undefined) {
        return ;
      }
      if (width.contents < 0) {
        result.contents = false;
        return ;
      }
      if (typeof doc === "number") {
        return ;
      }
      switch (doc.TAG | 0) {
        case /* Text */0 :
            width.contents = width.contents - doc._0.length | 0;
            return ;
        case /* Concat */1 :
            var _docs = doc._0;
            while(true) {
              var docs = _docs;
              if (result.contents !== undefined) {
                return ;
              }
              if (!docs) {
                return ;
              }
              calculate(indent, mode, docs.hd);
              _docs = docs.tl;
              continue ;
            };
        case /* Indent */2 :
            _doc = doc._0;
            _indent = indent + 2 | 0;
            continue ;
        case /* IfBreaks */3 :
            var match = doc.broken;
            if (match) {
              _doc = doc.yes;
              continue ;
            }
            break;
        case /* LineBreak */5 :
            break;
        case /* Group */6 :
            var match$1 = doc.shouldBreak;
            if (match$1) {
              _doc = doc.doc;
              _mode = /* Break */0;
              continue ;
            }
            _doc = doc.doc;
            continue ;
        case /* CustomLayout */7 :
            var match$2 = doc._0;
            if (!match$2) {
              return ;
            }
            _doc = match$2.hd;
            continue ;
        default:
          return ;
      }
      if (mode) {
        if (typeof doc !== "number") {
          if (doc.TAG === /* IfBreaks */3) {
            _doc = doc.no;
            continue ;
          }
          var match$3 = doc._0;
          if (match$3 !== 1) {
            if (match$3 !== 0) {
              result.contents = true;
            } else {
              width.contents = width.contents - 1 | 0;
            }
            return ;
          } else {
            return ;
          }
        }
        
      } else if (typeof doc !== "number") {
        if (doc.TAG !== /* IfBreaks */3) {
          result.contents = true;
          return ;
        }
        _doc = doc.yes;
        continue ;
      }
      
    };
  };
  var _stack = stack;
  while(true) {
    var stack$1 = _stack;
    var match = result.contents;
    if (match !== undefined) {
      return match;
    }
    if (!stack$1) {
      return width.contents >= 0;
    }
    var match$1 = stack$1.hd;
    calculate(match$1[0], match$1[1], match$1[2]);
    _stack = stack$1.tl;
    continue ;
  };
}

function toString(width, doc) {
  propagateForcedBreaks(doc);
  var buffer = Res_minibuffer.create(1000);
  var $$process = function (_pos, _lineSuffices, _stack) {
    while(true) {
      var stack = _stack;
      var lineSuffices = _lineSuffices;
      var pos = _pos;
      if (stack) {
        var rest = stack.tl;
        var cmd = stack.hd;
        var doc = cmd[2];
        var mode = cmd[1];
        var ind = cmd[0];
        if (typeof doc === "number") {
          if (doc === /* Nil */0) {
            _stack = rest;
            continue ;
          }
          _stack = rest;
          continue ;
        } else {
          switch (doc.TAG | 0) {
            case /* Text */0 :
                var txt = doc._0;
                Res_minibuffer.add_string(buffer, txt);
                _stack = rest;
                _pos = txt.length + pos | 0;
                continue ;
            case /* Concat */1 :
                var ops = List.map((function(ind,mode){
                    return function (doc) {
                      return [
                              ind,
                              mode,
                              doc
                            ];
                    }
                    }(ind,mode)), doc._0);
                _stack = List.append(ops, rest);
                continue ;
            case /* Indent */2 :
                _stack = {
                  hd: [
                    ind + 2 | 0,
                    mode,
                    doc._0
                  ],
                  tl: rest
                };
                continue ;
            case /* IfBreaks */3 :
                var breakDoc = doc.yes;
                var match = doc.broken;
                if (match) {
                  _stack = {
                    hd: [
                      ind,
                      mode,
                      breakDoc
                    ],
                    tl: rest
                  };
                  continue ;
                }
                if (mode === /* Break */0) {
                  _stack = {
                    hd: [
                      ind,
                      mode,
                      breakDoc
                    ],
                    tl: rest
                  };
                  continue ;
                }
                _stack = {
                  hd: [
                    ind,
                    mode,
                    doc.no
                  ],
                  tl: rest
                };
                continue ;
            case /* LineSuffix */4 :
                _stack = rest;
                _lineSuffices = {
                  hd: [
                    ind,
                    mode,
                    doc._0
                  ],
                  tl: lineSuffices
                };
                continue ;
            case /* LineBreak */5 :
                var lineStyle = doc._0;
                if (mode === /* Break */0) {
                  if (lineSuffices) {
                    _stack = List.concat({
                          hd: List.rev(lineSuffices),
                          tl: {
                            hd: {
                              hd: cmd,
                              tl: rest
                            },
                            tl: /* [] */0
                          }
                        });
                    _lineSuffices = /* [] */0;
                    _pos = ind;
                    continue ;
                  }
                  if (lineStyle === /* Literal */3) {
                    Res_minibuffer.add_char(buffer, /* '\n' */10);
                    _stack = rest;
                    _lineSuffices = /* [] */0;
                    _pos = 0;
                    continue ;
                  }
                  Res_minibuffer.flush_newline(buffer);
                  Res_minibuffer.add_string(buffer, $$String.make(ind, /* ' ' */32));
                  _stack = rest;
                  _lineSuffices = /* [] */0;
                  _pos = ind;
                  continue ;
                }
                var pos$1;
                switch (lineStyle) {
                  case /* Classic */0 :
                      Res_minibuffer.add_string(buffer, " ");
                      pos$1 = pos + 1 | 0;
                      break;
                  case /* Soft */1 :
                      pos$1 = pos;
                      break;
                  case /* Hard */2 :
                      Res_minibuffer.flush_newline(buffer);
                      pos$1 = 0;
                      break;
                  case /* Literal */3 :
                      Res_minibuffer.add_char(buffer, /* '\n' */10);
                      pos$1 = 0;
                      break;
                  
                }
                _stack = rest;
                _pos = pos$1;
                continue ;
            case /* Group */6 :
                var shouldBreak = doc.shouldBreak;
                var doc$1 = doc.doc;
                if (shouldBreak || !fits(width - pos | 0, {
                        hd: [
                          ind,
                          /* Flat */1,
                          doc$1
                        ],
                        tl: rest
                      })) {
                  _stack = {
                    hd: [
                      ind,
                      /* Break */0,
                      doc$1
                    ],
                    tl: rest
                  };
                  continue ;
                }
                _stack = {
                  hd: [
                    ind,
                    /* Flat */1,
                    doc$1
                  ],
                  tl: rest
                };
                continue ;
            case /* CustomLayout */7 :
                var findGroupThatFits = (function(pos,ind,rest){
                return function findGroupThatFits(_groups) {
                  while(true) {
                    var groups = _groups;
                    if (!groups) {
                      return /* Nil */0;
                    }
                    var docs = groups.tl;
                    var lastGroup = groups.hd;
                    if (!docs) {
                      return lastGroup;
                    }
                    if (fits(width - pos | 0, {
                            hd: [
                              ind,
                              /* Flat */1,
                              lastGroup
                            ],
                            tl: rest
                          })) {
                      return lastGroup;
                    }
                    _groups = docs;
                    continue ;
                  };
                }
                }(pos,ind,rest));
                var doc$2 = findGroupThatFits(doc._0);
                _stack = {
                  hd: [
                    ind,
                    /* Flat */1,
                    doc$2
                  ],
                  tl: rest
                };
                continue ;
            
          }
        }
      } else {
        if (!lineSuffices) {
          return ;
        }
        _stack = List.rev(lineSuffices);
        _lineSuffices = /* [] */0;
        _pos = 0;
        continue ;
      }
    };
  };
  $$process(0, /* [] */0, {
        hd: [
          0,
          /* Flat */1,
          doc
        ],
        tl: /* [] */0
      });
  return Res_minibuffer.contents(buffer);
}

function debug(t) {
  var toDoc = function (_x) {
    while(true) {
      var x = _x;
      if (typeof x === "number") {
        if (x === /* Nil */0) {
          return {
                  TAG: /* Text */0,
                  _0: "nil"
                };
        } else {
          return {
                  TAG: /* Text */0,
                  _0: "breakparent"
                };
        }
      }
      switch (x.TAG | 0) {
        case /* Text */0 :
            return {
                    TAG: /* Text */0,
                    _0: "text(\"" + (x._0 + "\")")
                  };
        case /* Concat */1 :
            var docs = x._0;
            if (!docs) {
              return {
                      TAG: /* Text */0,
                      _0: "concat()"
                    };
            }
            var l_0 = {
              TAG: /* Text */0,
              _0: ","
            };
            var l_1 = {
              hd: line,
              tl: /* [] */0
            };
            var l = {
              hd: l_0,
              tl: l_1
            };
            var l_1$1 = {
              hd: join({
                    TAG: /* Concat */1,
                    _0: _concat(/* [] */0, l)
                  }, List.map(toDoc, docs)),
              tl: /* [] */0
            };
            var l$1 = {
              hd: line,
              tl: l_1$1
            };
            var l_0$1 = {
              TAG: /* Text */0,
              _0: "concat("
            };
            var l_1$2 = {
              hd: {
                TAG: /* Indent */2,
                _0: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$1)
                }
              },
              tl: {
                hd: line,
                tl: {
                  hd: {
                    TAG: /* Text */0,
                    _0: ")"
                  },
                  tl: /* [] */0
                }
              }
            };
            var l$2 = {
              hd: l_0$1,
              tl: l_1$2
            };
            return {
                    TAG: /* Group */6,
                    shouldBreak: false,
                    doc: {
                      TAG: /* Concat */1,
                      _0: _concat(/* [] */0, l$2)
                    }
                  };
        case /* Indent */2 :
            var l_0$2 = {
              TAG: /* Text */0,
              _0: "indent("
            };
            var l_1$3 = {
              hd: softLine,
              tl: {
                hd: toDoc(x._0),
                tl: {
                  hd: softLine,
                  tl: {
                    hd: {
                      TAG: /* Text */0,
                      _0: ")"
                    },
                    tl: /* [] */0
                  }
                }
              }
            };
            var l$3 = {
              hd: l_0$2,
              tl: l_1$3
            };
            return {
                    TAG: /* Concat */1,
                    _0: _concat(/* [] */0, l$3)
                  };
        case /* IfBreaks */3 :
            var trueDoc = x.yes;
            var match = x.broken;
            if (match) {
              _x = trueDoc;
              continue ;
            }
            var l_0$3 = {
              TAG: /* Text */0,
              _0: ","
            };
            var l_1$4 = {
              hd: line,
              tl: /* [] */0
            };
            var l$4 = {
              hd: l_0$3,
              tl: l_1$4
            };
            var l_1$5 = {
              hd: toDoc(trueDoc),
              tl: {
                hd: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$4)
                },
                tl: {
                  hd: toDoc(x.no),
                  tl: /* [] */0
                }
              }
            };
            var l$5 = {
              hd: line,
              tl: l_1$5
            };
            var l_0$4 = {
              TAG: /* Text */0,
              _0: "ifBreaks("
            };
            var l_1$6 = {
              hd: {
                TAG: /* Indent */2,
                _0: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$5)
                }
              },
              tl: {
                hd: line,
                tl: {
                  hd: {
                    TAG: /* Text */0,
                    _0: ")"
                  },
                  tl: /* [] */0
                }
              }
            };
            var l$6 = {
              hd: l_0$4,
              tl: l_1$6
            };
            return {
                    TAG: /* Group */6,
                    shouldBreak: false,
                    doc: {
                      TAG: /* Concat */1,
                      _0: _concat(/* [] */0, l$6)
                    }
                  };
        case /* LineSuffix */4 :
            var l_1$7 = {
              hd: toDoc(x._0),
              tl: /* [] */0
            };
            var l$7 = {
              hd: line,
              tl: l_1$7
            };
            var l_0$5 = {
              TAG: /* Text */0,
              _0: "linesuffix("
            };
            var l_1$8 = {
              hd: {
                TAG: /* Indent */2,
                _0: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$7)
                }
              },
              tl: {
                hd: line,
                tl: {
                  hd: {
                    TAG: /* Text */0,
                    _0: ")"
                  },
                  tl: /* [] */0
                }
              }
            };
            var l$8 = {
              hd: l_0$5,
              tl: l_1$8
            };
            return {
                    TAG: /* Group */6,
                    shouldBreak: false,
                    doc: {
                      TAG: /* Concat */1,
                      _0: _concat(/* [] */0, l$8)
                    }
                  };
        case /* LineBreak */5 :
            var breakTxt;
            switch (x._0) {
              case /* Classic */0 :
                  breakTxt = "Classic";
                  break;
              case /* Soft */1 :
                  breakTxt = "Soft";
                  break;
              case /* Hard */2 :
                  breakTxt = "Hard";
                  break;
              case /* Literal */3 :
                  breakTxt = "Liteal";
                  break;
              
            }
            return {
                    TAG: /* Text */0,
                    _0: "LineBreak(" + (breakTxt + ")")
                  };
        case /* Group */6 :
            var shouldBreak = x.shouldBreak;
            var l_0$6 = {
              TAG: /* Text */0,
              _0: ","
            };
            var l_1$9 = {
              hd: line,
              tl: /* [] */0
            };
            var l$9 = {
              hd: l_0$6,
              tl: l_1$9
            };
            var l_1$10 = {
              hd: {
                TAG: /* Text */0,
                _0: "{shouldBreak: " + (Pervasives.string_of_bool(shouldBreak) + "}")
              },
              tl: {
                hd: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$9)
                },
                tl: {
                  hd: toDoc(x.doc),
                  tl: /* [] */0
                }
              }
            };
            var l$10 = {
              hd: line,
              tl: l_1$10
            };
            var l_0$7 = {
              TAG: /* Text */0,
              _0: "Group("
            };
            var l_1$11 = {
              hd: {
                TAG: /* Indent */2,
                _0: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$10)
                }
              },
              tl: {
                hd: line,
                tl: {
                  hd: {
                    TAG: /* Text */0,
                    _0: ")"
                  },
                  tl: /* [] */0
                }
              }
            };
            var l$11 = {
              hd: l_0$7,
              tl: l_1$11
            };
            return {
                    TAG: /* Group */6,
                    shouldBreak: false,
                    doc: {
                      TAG: /* Concat */1,
                      _0: _concat(/* [] */0, l$11)
                    }
                  };
        case /* CustomLayout */7 :
            var l_0$8 = {
              TAG: /* Text */0,
              _0: ","
            };
            var l_1$12 = {
              hd: line,
              tl: /* [] */0
            };
            var l$12 = {
              hd: l_0$8,
              tl: l_1$12
            };
            var l_1$13 = {
              hd: join({
                    TAG: /* Concat */1,
                    _0: _concat(/* [] */0, l$12)
                  }, List.map(toDoc, x._0)),
              tl: /* [] */0
            };
            var l$13 = {
              hd: line,
              tl: l_1$13
            };
            var l_0$9 = {
              TAG: /* Text */0,
              _0: "customLayout("
            };
            var l_1$14 = {
              hd: {
                TAG: /* Indent */2,
                _0: {
                  TAG: /* Concat */1,
                  _0: _concat(/* [] */0, l$13)
                }
              },
              tl: {
                hd: line,
                tl: {
                  hd: {
                    TAG: /* Text */0,
                    _0: ")"
                  },
                  tl: /* [] */0
                }
              }
            };
            var l$14 = {
              hd: l_0$9,
              tl: l_1$14
            };
            return {
                    TAG: /* Group */6,
                    shouldBreak: false,
                    doc: {
                      TAG: /* Concat */1,
                      _0: _concat(/* [] */0, l$14)
                    }
                  };
        
      }
    };
  };
  var doc = toDoc(t);
  console.log(toString(10, doc));
  
}

var MiniBuffer;

var nil = /* Nil */0;

var hardLine = {
  TAG: /* LineBreak */5,
  _0: /* Hard */2
};

var literalLine = {
  TAG: /* LineBreak */5,
  _0: /* Literal */3
};

var breakParent = /* BreakParent */1;

var space = {
  TAG: /* Text */0,
  _0: " "
};

var dot = {
  TAG: /* Text */0,
  _0: "."
};

var dotdot = {
  TAG: /* Text */0,
  _0: ".."
};

var dotdotdot = {
  TAG: /* Text */0,
  _0: "..."
};

var lessThan = {
  TAG: /* Text */0,
  _0: "<"
};

var greaterThan = {
  TAG: /* Text */0,
  _0: ">"
};

var lbrace = {
  TAG: /* Text */0,
  _0: "{"
};

var rbrace = {
  TAG: /* Text */0,
  _0: "}"
};

var lparen = {
  TAG: /* Text */0,
  _0: "("
};

var rparen = {
  TAG: /* Text */0,
  _0: ")"
};

var lbracket = {
  TAG: /* Text */0,
  _0: "["
};

var rbracket = {
  TAG: /* Text */0,
  _0: "]"
};

var question = {
  TAG: /* Text */0,
  _0: "?"
};

var tilde = {
  TAG: /* Text */0,
  _0: "~"
};

var equal = {
  TAG: /* Text */0,
  _0: "="
};

var doubleQuote = {
  TAG: /* Text */0,
  _0: "\""
};

export {
  MiniBuffer ,
  nil ,
  line ,
  hardLine ,
  softLine ,
  literalLine ,
  text ,
  _concat ,
  concat ,
  indent ,
  ifBreaks ,
  lineSuffix ,
  group ,
  breakableGroup ,
  customLayout ,
  breakParent ,
  space ,
  comma ,
  dot ,
  dotdot ,
  dotdotdot ,
  lessThan ,
  greaterThan ,
  lbrace ,
  rbrace ,
  lparen ,
  rparen ,
  lbracket ,
  rbracket ,
  question ,
  tilde ,
  equal ,
  trailingComma ,
  doubleQuote ,
  propagateForcedBreaks ,
  willBreak ,
  join ,
  fits ,
  toString ,
  debug ,
  
}
/* No side effect */
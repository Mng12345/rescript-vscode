(**
 * `startsWith(string, prefix)`
 * true if the string starts with the prefix
 *)
let startsWith s prefix =
  if prefix = "" then true
  else
    let p = String.length prefix in
    p <= String.length s && String.sub s 0 p = prefix

let endsWith s suffix =
  if suffix = "" then true
  else
    let p = String.length suffix in
    let l = String.length s in
    p <= String.length s && String.sub s (l - p) p = suffix

let cmtPosToPosition {Lexing.pos_lnum; pos_cnum; pos_bol} =
  Protocol.{line = pos_lnum - 1; character = pos_cnum - pos_bol}

let cmtLocToRange {Location.loc_start; loc_end} =
  Protocol.{start = cmtPosToPosition loc_start; end_ = cmtPosToPosition loc_end}

let endOfLocation loc length =
  let open Location in
  {
    loc with
    loc_start = {loc.loc_end with pos_cnum = loc.loc_end.pos_cnum - length};
  }

let chopLocationEnd loc length =
  let open Location in
  {
    loc with
    loc_end = {loc.loc_end with pos_cnum = loc.loc_end.pos_cnum - length};
  }

(** An optional List.find *)
let rec find fn items =
  match items with
  | [] -> None
  | one :: rest -> (
    match fn one with
    | None -> find fn rest
    | Some x -> Some x)

let filterMap f =
  let rec aux accu = function
    | [] -> List.rev accu
    | x :: l -> (
      match f x with
      | None -> aux accu l
      | Some v -> aux (v :: accu) l)
  in
  aux []

let dumpPath path = Str.global_replace (Str.regexp_string "\\") "/" path
let isUncurriedInternal path = startsWith (Path.name path) "Js.Fn.arity"

let flattenLongIdent ?(jsx = false) ?(cutAtOffset = None) lid =
  let rec loop lid =
    match lid with
    | Longident.Lident txt -> ([txt], String.length txt)
    | Ldot (lid, txt) ->
      let path, offset = loop lid in
      if Some offset = cutAtOffset then ("" :: path, offset + 1)
      else if jsx && txt = "createElement" then (path, offset)
      else if txt = "_" then ("" :: path, offset + 1)
      else (txt :: path, offset + 1 + String.length txt)
    | Lapply _ -> ([], 0)
  in
  let path, _ = loop lid in
  List.rev path

let identifyPexp pexp =
  match pexp with
  | Parsetree.Pexp_ident _ -> "Pexp_ident"
  | Pexp_constant _ -> "Pexp_constant"
  | Pexp_let _ -> "Pexp_let"
  | Pexp_function _ -> "Pexp_function"
  | Pexp_fun _ -> "Pexp_fun"
  | Pexp_apply _ -> "Pexp_apply"
  | Pexp_match _ -> "Pexp_match"
  | Pexp_try _ -> "Pexp_try"
  | Pexp_tuple _ -> "Pexp_tuple"
  | Pexp_construct _ -> "Pexp_construct"
  | Pexp_variant _ -> "Pexp_variant"
  | Pexp_record _ -> "Pexp_record"
  | Pexp_field _ -> "Pexp_field"
  | Pexp_setfield _ -> "Pexp_setfield"
  | Pexp_array _ -> "Pexp_array"
  | Pexp_ifthenelse _ -> "Pexp_ifthenelse"
  | Pexp_sequence _ -> "Pexp_sequence"
  | Pexp_while _ -> "Pexp_while"
  | Pexp_for _ -> "Pexp_for"
  | Pexp_constraint _ -> "Pexp_constraint"
  | Pexp_coerce _ -> "Pexp_coerce"
  | Pexp_send _ -> "Pexp_send"
  | Pexp_new _ -> "Pexp_new"
  | Pexp_setinstvar _ -> "Pexp_setinstvar"
  | Pexp_override _ -> "Pexp_override"
  | Pexp_letmodule _ -> "Pexp_letmodule"
  | Pexp_letexception _ -> "Pexp_letexception"
  | Pexp_assert _ -> "Pexp_assert"
  | Pexp_lazy _ -> "Pexp_lazy"
  | Pexp_poly _ -> "Pexp_poly"
  | Pexp_object _ -> "Pexp_object"
  | Pexp_newtype _ -> "Pexp_newtype"
  | Pexp_pack _ -> "Pexp_pack"
  | Pexp_extension _ -> "Pexp_extension"
  | Pexp_open _ -> "Pexp_open"
  | Pexp_unreachable -> "Pexp_unreachable"
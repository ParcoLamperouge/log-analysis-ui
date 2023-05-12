// 提取所有中括号tag
const regSplitTag = /(?<=\[)(.+?)(?=\])/g;

// 仅提取有效字段
const regTimeTag = /(?<=\[)((0?[0-9])|(1[0-9]|2[0-3])):(([1-5][0-9])|(0?[0-9])):(([1-5][0-9])|(0?[0-9]))\.([0-9]{3})(?=\])/;
const regLevelTag = /(?<=\[)([A-Z])(?=\])/;
const regThreadTag = /(?<=\[tid:)(([0-9a-zA-Z]+))(?=\])/;
const regFileTag = /(?<=\[)(([\w-]+\.(cpp|c)+):([0-9]+))(?=\])/;
const regMethodTag = /(?<=\[)(([\w]+)::([\w]+))(?=\])/;
// 提取tag括号+字段
const regTimeWithSquareBrackets = /\[((0?[0-9])|(1[0-9]|2[0-3])):(([1-5][0-9])|(0?[0-9])):(([1-5][0-9])|(0?[0-9]))\.([0-9]{3})\]/;
const regLevelWithSquareBrackets = /\[([A-Z])\]/;
const regThreadWithSquareBracket = /\[tid:(([0-9a-zA-Z]+))\]/;
const regMethodWithSquareBracket = /\[(([\w]+)::([\w]+))\]/;
const regFileWithSquareBracket = /\[(([\w-]+\.(cpp|c)):([0-9]+))\]/;

export default {
  regSplitTag,
  regTimeTag,
  regLevelTag,
  regThreadTag,
  regFileTag,
  regMethodTag,
  regTimeWithSquareBrackets,
  regLevelWithSquareBrackets,
  regThreadWithSquareBracket,
  regMethodWithSquareBracket,
  regFileWithSquareBracket
}
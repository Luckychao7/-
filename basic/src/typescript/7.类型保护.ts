// 类型保护示例：通过判断类型来确定变量的具体类型
type Value = string | number;
let Value = 123; 

function isString(value: Value): value is string {
    return typeof value === 'string';
}

const c= isString(Value);// false
console.log(c);
const d = isString("hello"); // true
console.log(d);
//js 数据类型有哪些？

//1.基本数据类型
//number、string、boolean、null、undefined、symbol、bigint
//2.引用数据类型
//Object、Array、function、Date、RegExp、Error

let a=1;  
let b:string = "hello"
let c: boolean = true;
let d: null=null;
let e: undefined = undefined;
let f: symbol = Symbol("1");
let g: bigint = BigInt(1234567890123456789012345678901234567890);

//引用数据类型
let h: object = { name: "Alice", age: 30 };
let i: Array<number> = [1, 2, 3];
let j: Function = function (x: number, y: number): number {
    return x + y;
};
let k: Date = new Date();
let l: RegExp = /abc/;
let m: Error = new Error("Something went wrong");
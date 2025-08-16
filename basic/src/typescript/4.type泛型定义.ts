//只有在用的时候才知道的类型，可以使用泛型类型定义


//
// type Person <T> = {
// name: string;
// age: number;
// info: T
// }


// type Person <T extends { body: string[] }> = {
// name: string;
// age: number;
// info: T
// }


type Person <T = { body: string[] }> = {
name: string;
age: number;
info: T
}
const person: Person<{ body: string[] }> = {
    name: '合一',
    age: 1,
    info: {
        body: ["reading", "coding"],
    }
};
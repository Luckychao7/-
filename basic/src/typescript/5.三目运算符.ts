//三目运算符，确定条件类型
//extends
//1.继承
class Person {}
class Student extends Person {}

//2.约束类型

function  say <T extends { id: string }> (a: T) :T{
    return  a;
}
say({ id: "1" });
//3.条件类型
type IsString<T> = T extends string ? true : false;

const IsString: IsString<"hello"> = true;
//typeof 可以用来判断基本数据类型，判断是string，就是字符串类型
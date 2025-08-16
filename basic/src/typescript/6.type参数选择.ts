type Person = { name: string; age: number;};
//有一天参数只关注name，不需要age
//类型复用
//type Person2={name: string}
type NamePerson = Pick<Person, "name">;

type AgePerson = Omit<Person, "age">;

//用已有类型来派生新类型